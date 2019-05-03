export const DEFAULT_API_ENDPOINT = 'https://pokeapi.co/api/v2/';
export const DEFAULT_API_ACTION = 'pokemon/';
export const DEFAULT_POKEMON_LIST_SELECTOR = '#pokemon-list';
export const DEFAULT_POKEMON_ITEM_SELECTOR = '.pokemon';

export const DEFAULT_ISOTOPE_CONFIG = {
    itemSelector: DEFAULT_POKEMON_ITEM_SELECTOR,
    masonry: {
        columnWidth: 25
    },
    getSortData: {
        'name': '.pokemon-name',
        'id': '[data-pokemon-id]'
    }
};

export const CACHE_DEFAULT_KEY = 'pokemon';
export const FAVORITES_CACHE_KEY = 'favorite_pokemons';
export const SORT_STATE_KEY = 'sort_state';

export const ERR_POPULATE_CACHE_FAILURE = '[Cache] Error caught while populating cache: %O';
export const ERR_COMPONENT_DID_MOUNT = '[%s] Error caught in componentDidMount: %O';
export const ERR_UNSUPPORTED_PROPERTY = '[%1$s][ERROR] %2$s is not supported by current browser.';