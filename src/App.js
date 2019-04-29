import React from 'react';
import Pokemon from './lib/Components/Pokemon';
import { DEFAULT_API_ENDPOINT, DEFAULT_API_ACTION, CACHE_DEFAULT_KEY } from './lib/Constants';

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
           this.setState( {
               pokemonList: responseJson.results
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
                <div className="row">
                    <ul id="pokemon-list" className="list-inline">
                        { this.state.pokemonList.map( ( p, index ) => {
                            return this.renderPokemon( index );
                        } ) }                     
                    </ul>
                </div>
            </div>
        )
   }
}
