interface Config {
  url: {
    API_BASE_URL: string;
    OAUTH2_REDIRECT_URI: string;
  };
}

const config: Config = {
  url: {
    API_BASE_URL: import.meta.env.VITE_BASE_API_URL as string,
    OAUTH2_REDIRECT_URI: import.meta.env.VITE_OAUTH2_REDIRECT_URI as string,
  },
};

export const getLoginUrl = (name: string): string => {
  return `${config.url.API_BASE_URL}/oauth2/authorization/${name}?redirect_uri=${config.url.OAUTH2_REDIRECT_URI}`;
};
