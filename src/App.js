import React from 'react';
import Pokemon from './lib/Components/Pokemon';
import { DEFAULT_API_ENDPOINT, DEFAULT_API_ACTION, CACHE_DEFAULT_KEY } from './lib/Constants';
import Util from './lib/Util';

export default class App extends React.Component {
   constructor()
   {
       super()
       this.state = {
           pokemonList: [],
       };
   }

   componentDidMount()
   {
       const requestUrl = DEFAULT_API_ENDPOINT + DEFAULT_API_ACTION;
       
       caches.match( requestUrl )
       .then( response => {
           return response || 
           fetch( requestUrl )
           .then( networkResponse => {
               caches.open( CACHE_DEFAULT_KEY )
               .then( cache => {
                   cache.put( requestUrl, networkResponse );
               } );

               return networkResponse.clone();
           } );
       } )
       .then( response => response.json() )
       .then( responseJson => {
           let pokemons = responseJson.results;

           // update favorites status for each
           // pokemon we retrieved from the API
           for( let i = 0; i < pokemons.length; i++ ) {
                pokemons[ i ].isFavorite = Util.isFavorite( i );
           }

            this.setState( {
                pokemonList: pokemons
            } );
       } )
       .catch( _ => {
           return caches.match( requestUrl );
       } );
   }

   renderPokemon( index )
   {
       return <Pokemon key={index} value={this.state.pokemonList[index]} onFavoriteClick={ ( e ) => this.onFavoriteClick( e, index )}></Pokemon>
   }

   onFavoriteClick( event, index )
   {
       event.nativeEvent.stopImmediatePropagation();
       event.stopPropagation();
       this.handleFavoriteClick( index );
   }

   handleFavoriteClick( index )
   {
        // update pokemon at this.state.pokemonList[ index ]
        // to include a key indicating their status
        let pokemons = this.state.pokemonList,
            pokemon = pokemons[ index ],
            favorites = Util.getFavorites();

        ++index;

        // check if pokemon has already been marked
        // as a favorite
        if( Util.isFavorite( index ) ) {
            // it's already a favorite, so we
            // need to remove it from the list
            favorites = favorites.split( ',' );
            favorites.splice( favorites.indexOf( index.toString() ), 1 );
        } else {
            // make sure list isn't empty
            if( favorites === null ) {
                // list is empty, just add this index
                // and store it
                favorites = new Array(0);
                favorites.push( index.toString() );
            } else {
                favorites = favorites.split( ',' );
                favorites.push( index.toString() );
            }
        }

        // update CSS class for favorites indicator

        favorites = favorites.join( ',' );
        Util.storeUpdatedFavoritesList( favorites );
   }

   render()
   {
        return (            
            <div id="pokemon-consumer" className="container">
                <header id="pokemon-list-header" className="row">
                    <h5 className="display-4 ml-auto mr-auto">Pok&eacute;mon API Consumer</h5>
                </header>
                <ul id="pokemon-list" className="row">
                    { this.state.pokemonList.map( ( p, index ) => {
                        return this.renderPokemon( index );
                    } ) }                     
                </ul>
            </div>
        );
   }
}
