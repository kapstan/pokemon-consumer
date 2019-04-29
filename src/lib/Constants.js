export const DEFAULT_API_ENDPOINT = 'https://pokeapi.co/api/v2/';
export const DEFAULT_API_ACTION = 'pokemon/';
export const DEFAULT_AXIOS_CONFIG = { baseURL: DEFAULT_API_ENDPOINT };
export const CACHE_DEFAULT_KEY = 'pokemon';

export const ERR_POPULATE_CACHE_FAILURE = '[Cache] Error caught while populating cache: %O';
export const ERR_COMPONENT_DID_MOUNT = '[%s] Error caught in componentDidMount: %O';
export const ERR_UNSUPPORTED_PROPERTY = '[%1$s][ERROR] %2$s is not supported by current browser.';