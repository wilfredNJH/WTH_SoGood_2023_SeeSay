export const PRODUCTION_API_URL = "https://seesay.azurewebsites.net/";
export const DEV_API_URL : string = "http://localhost:5000/";
export const IS_DEV : boolean = false;
export const API_URL : string = IS_DEV ? DEV_API_URL : PRODUCTION_API_URL;