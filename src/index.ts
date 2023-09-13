import { pipe } from "fp-ts/lib/function";
import {
  getAccessToken,
  createContext,
  createRedirectURL,
  AuthieContext,
} from "./main";
import GoogleProvider from "./providers/google";

const useGoogle = await createContext({
  provider: GoogleProvider,
  client_id: "qwe",
  client_secret: "qwe",
  redirect_url: "qwe",
});

const { href: url } = await createRedirectURL(useGoogle);
