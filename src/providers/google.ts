import type { Provider } from "./types";

const GoogleProvider: Provider = {
  issuer: "https://accounts.google.com",
  url: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://accounts.google.com/o/oauth2/v2/token",
};

export default GoogleProvider;
