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
            for( let [ i, pokemon ] of pokemons.entries() ) {
                Util.isFavorite( ++i )
                .then( status => {
                    pokemon.isFavorite = status;
                } );
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
       return <Pokemon key={index} value={this.state.pokemonList[index]}></Pokemon>
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
