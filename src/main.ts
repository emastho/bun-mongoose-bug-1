import type { Provider } from "./providers/types";
import * as oauth from "oauth4webapi";

class AuthorizationURLCreationError extends Error {}

interface contextParams {
  provider: Provider;
  client_id: string;
  client_secret: string;
  redirect_url: string;
}

export interface AuthieContext {
  as: oauth.AuthorizationServer;
  client: oauth.Client;
  redirect_uri: string;
  code_verifier: string;
}

/**
 *
 * Creates a redirect url
 *
 */

async function createContext({
  provider,
  client_id,
  client_secret,
  redirect_url,
}: contextParams): Promise<AuthieContext> {
  const issuer = new URL(provider.issuer);
  const as = await oauth
    .discoveryRequest(issuer)
    .then((response) => oauth.processDiscoveryResponse(issuer, response));

  const client: oauth.Client = {
    client_id: client_id,
    client_secret: client_secret,
    token_endpoint_auth_method: "client_secret_basic",
  };

  const redirect_uri = redirect_url;
  const code_verifier = oauth.generateRandomCodeVerifier();

  const ctx = { as, client, redirect_uri, code_verifier };

  return ctx;
}

async function createRedirectURL(context: AuthieContext) {
  if (context.as.code_challenge_methods_supported?.includes("S256") !== true) {
    // If it isn't supported, random `nonce` must be used for CSRF protection.
    throw new AuthorizationURLCreationError("PKCE not supported");
  }

  const challenge = await oauth.calculatePKCECodeChallenge(
    context.code_verifier
  );

  const code_challenge_method = "S256";
  // redirect user to as.authorization_endpoint
  const authorizationUrl = new URL(context.as.authorization_endpoint!);
  authorizationUrl.searchParams.set("client_id", context.client.client_id);
  authorizationUrl.searchParams.set("code_challenge", challenge);
  authorizationUrl.searchParams.set(
    "code_challenge_method",
    code_challenge_method
  );
  authorizationUrl.searchParams.set("redirect_uri", context.redirect_uri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "openid email");

  return authorizationUrl;
}

/**
 *
 * Uses code to get access token
 *
 */

async function getAccessToken(context: AuthieContext, current_url: URL) {
  // one eternity later, the user lands back on the redirect_uri
  let sub: string;
  let access_token: string;

  const currentUrl: URL = current_url;
  const params = oauth.validateAuthResponse(
    context.as,
    context.client,
    currentUrl,
    oauth.expectNoState
  );
  if (oauth.isOAuth2Error(params)) {
    console.log("error", params);
    throw new Error(); // Handle OAuth 2.0 redirect error
  }

  const response = await oauth
    .authorizationCodeGrantRequest(
      context.as,
      context.client,
      params,
      context.redirect_uri,
      context.code_verifier
    )
    .catch((e) => console.error(e.message));

  let challenges: oauth.WWWAuthenticateChallenge[] | undefined;
  if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log("challenge", challenge);
    }
    throw new Error(); // Handle www-authenticate challenges as needed
  }

  const result = await oauth.processAuthorizationCodeOpenIDResponse(
    context.as,
    context.client,
    response
  );
  if (oauth.isOAuth2Error(result)) {
    console.log("error", result);
    throw new Error(); // Handle OAuth 2.0 response body error
  }

  console.log("result", result);
  ({ access_token } = result);
  const claims = oauth.getValidatedIdTokenClaims(result);
  console.log("ID Token Claims", claims);
  ({ sub } = claims);

  return {
    access_token,
    sub,
  };
}

// interface fetchUserInfoParams {
//   accessToken: string;
//   dependencies: [oauth.AuthorizationServer, oauth.Client, string];
// }

// /**
//  *
//  * Fetches user info using access token
//  *
//  */

// async function fetchUserInfo(params: fetchUserInfoParams) {
//   const response = await oauth.userInfoRequest(
//     params.dependencies[0],
//     params.dependencies[1],
//     params.accessToken
//   );

//   let challenges: oauth.WWWAuthenticateChallenge[] | undefined;
//   if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
//     for (const challenge of challenges) {
//       console.log("challenge", challenge);
//     }
//     throw new Error(); // Handle www-authenticate challenges as needed
//   }

//   const result = await oauth.processUserInfoResponse(
//     params.dependencies[0],
//     params.dependencies[1],
//     params.dependencies[2],
//     response
//   );
//   console.log("result", result);

//   return { result };
// }

export { createContext, createRedirectURL, getAccessToken };
