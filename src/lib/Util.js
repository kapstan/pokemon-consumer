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

    static isFavorite( index )
    {
        let favorites = Util.getFavorites();
        if( favorites === null ) {
            return false;
        }

        favorites = favorites.split( ',' );
        return favorites.includes( index.toString() );
    }

    static getFavorites()
    {
        return localStorage.getItem( 'favorite_pokemons' );
    }

    static storeUpdatedFavoritesList( favorites )
    {
        localStorage.setItem( 'favorite_pokemons', favorites );
    }

    static capitalize( word )
    {
        if( typeof word !== 'string' ) {
            return;
        }

        return word.charAt( 0 ).toUpperCase() + word.slice( 1 );
    }
}