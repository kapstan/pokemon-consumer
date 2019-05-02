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

    static isArray( obj )
    {
        return Object.prototype.toString.call( obj ) === '[object Array ]';
    }

    static async request( url, params )
    {
        return fetch( url, params );
    }

    static async isFavorite( index )
    {
        let favorites = Util.getFavorites();

        return new Promise( ( resolve, reject ) => {
            if( !favorites.length ) {
                resolve( false );
            }

            resolve( favorites.includes( index ) );
        } );
    }

    static initList( id )
    {
        let favorites = [ id ];
        favorites = favorites.join( ',' );
        Util.storeUpdatedFavoritesList( favorites );        
    }

    static addFavorite( id )
    {
        let favorites = Util.getFavorites();
        favorites = favorites.split( ',' );
        favorites.push( id );

        favorites = favorites.join( ',' );
        Util.storeUpdatedFavoritesList( favorites );
    }

    static removeFavorite( id )
    {
        let favorites = Util.getFavorites();
        favorites = favorites.split( ',' );
        favorites.splice( favorites.indexOf( id ), 1 );

        return favorites;
    }

    static getFavorites()
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