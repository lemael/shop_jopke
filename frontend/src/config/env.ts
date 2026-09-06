// src/config/env.ts

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || "https://backend-production-b4b03.up.railway.app/api";
  
  // when the url does not start with http:// or https://, prepend https:// to it
  //if (!url.startsWith("http://") && !url.startsWith("https://")) {
    //url = `https://${url}`;
  //}
  
  return url;
};

export const ENV = {
  API_URL: getApiUrl(),
} as const;