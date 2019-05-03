import { FAVORITES_CACHE_KEY, SORT_STATE_KEY } from './Constants';

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
        return Object.prototype.toString.call( obj ) === '[object Array]';
    }

    static async request( url, params )
    {
        return fetch( url, params );
    }

    static async isFavorite( index )
    {
        let favorites = Util.getFavorites();
         
        return new Promise( ( resolve ) => {
            // nothing in local storage stored
            // as a favorite under FAVORITES_CACHE_KEY            
            if( favorites === null) {
                resolve( false );
            }

            resolve( favorites.includes( index ) );
        } );
    }

    static initFavorites( id )
    {
        let favorites = [ id ];
        favorites = favorites.join( ',' );
        Util.persistFavoritesList( favorites );        
    }

    static addFavorite( id )
    {
        let favorites = Util.getFavorites();
        favorites = favorites.split( ',' );
        favorites.push( id );

        favorites = favorites.join( ',' );
        return Util.persistFavoritesList( favorites );
    }

    static removeFavorite( id )
    {
        let favorites = Util.getFavorites();

        favorites = favorites.split( ',' );
        favorites.splice( favorites.indexOf( id.toString() ), 1 );
        favorites = favorites.join( ',' );
        return Util.persistFavoritesList( favorites );
    }

    static getFavorites()
    {
        return localStorage.getItem( FAVORITES_CACHE_KEY );
    }

    static persistFavoritesList( favorites )
    {
        return localStorage.setItem( FAVORITES_CACHE_KEY, favorites );
    }

    static sortListBy( list, property, sortDirection )
    {
        let comparator = ( sortDirection === 'asc' )
            ? ( a, b ) => a[ property ].localeCompare( b[ property ] )
            : ( a, b ) => b[ property ].localeCompare( a[ property ] );

        return list.sort( comparator );
    }

    static capitalize( word )
    {
        if( typeof word !== 'string' ) {
            return;
        }

        return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
    }
}