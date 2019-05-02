import { FAVORITES_CACHE_KEY } from './Constants';

export default class Util {
    static getInstance()
    {
        if( !!Util.__instance ) {
            return Util.__instance;
        }

        Util.__instance = this;
        return this;
    }

    static async request( url, params )
    {
        return fetch( url, params );
    }

    static async isFavorite( index )
    {
        let favorites = await Util.getFavorites();

        return new Promise( ( resolve ) => {
            favorites.split( ',' );
            resolve( favorites.includes( index ) );
        } );

        // favorites.split( ',' );
        // return favorites.includes( index );




        // if( favorites === null ) {
        //     return false;
        // }

        // favorites = favorites.split( ',' );
        // return favorites.includes( index.toString() );
    }

    static async getFavorites()
    {
        return localStorage.getItem( FAVORITES_CACHE_KEY );
    }

    static storeUpdatedFavoritesList( favorites )
    {
        localStorage.setItem( FAVORITES_CACHE_KEY, favorites );
    }

    static capitalize( word )
    {
        if( typeof word !== 'string' ) {
            return;
        }

        return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
    }
}