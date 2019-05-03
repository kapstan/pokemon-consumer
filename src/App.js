import React from 'react';
import Pokemon from './lib/Components/Pokemon';
import {
    DEFAULT_API_ENDPOINT,
    DEFAULT_API_ACTION,
    CACHE_DEFAULT_KEY,
    DEFAULT_POKEMON_LIST_SELECTOR,
    DEFAULT_ISOTOPE_CONFIG } from './lib/Constants';
import Util from './lib/Util';
import Isotope from 'isotope-layout';


export default class App extends React.Component {
   constructor( props )
   {
       super( props );
       this.state = {
           isotope: null,
           pokemonList: [],
       };
   }
   
    async bindIsotopeToElement( selector )
    {
        if( this.state.isotope !== null ) {
            return this.state.isotope;
        }
        return new Promise( ( resolve ) => {
            try {
                this.setState( {
                    isotope: new Isotope( selector, DEFAULT_ISOTOPE_CONFIG )
                }, () => {
                    resolve( this.state.isotope );
                } );
            } catch( err ) {            
                console.error( 'Error occurred while binding Isotope', err );                
            }
        } ); 
    }

    async componentDidMount()
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

    async componentDidUpdate()
    {
        console.log( 'App::componentDidUpdate' );
    }

    renderPokemon( index )
    {
        return <Pokemon key={index} value={this.state.pokemonList[index]}></Pokemon>
    }

    onSortListClick( event, sortProperty )
    {
        event.nativeEvent.preventDefault();
        event.nativeEvent.stopImmediatePropagation();
        event.stopPropagation();

        this.handleSortList( sortProperty );
    }

    async handleSortList( sortProperty )
    {
        sortProperty = sortProperty || 'name';

        let isotope = ( this.state.isotope === null )
            ? await this.bindIsotopeToElement( DEFAULT_POKEMON_LIST_SELECTOR )
            : this.state.isotope;       

        this.state.isotope.updateSortData();
        this.state.isotope.arrange( { sortBy: sortProperty } );

        this.setState( {
            isotope: isotope
        } );
    }

    render()
    {
       if( !this.state.pokemonList.length ) {
           return null;           
       }
        return (            
            <div id="pokemon-consumer" className="container">
                <header id="pokemon-list-header" className="row">
                    <nav className="mx-auto navbar navbar-expand-lg navbar-light bg-light">
                        <a href="/" className="navbar-brand">
                            <img className="d-inline-block align-top" src="./pokemon-logo.jpeg" alt="Logo" width="100" height="100" />
                        </a>
                        <button aria-controls="basic-navbar-nav" type="button" aria-label="Toggle navigation" className="navbar-toggler">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="navbar-collapse collapse" id="basic-navbar-nav">
                            <a href="/" className="nav-link" onClick={ ( e ) => this.onSortListClick( e, 'name' ) }>Sort Alphabetically</a>
                            <a href="/" className="nav-link" onClick={ ( e ) => this.onSortListClick( e, 'id' ) }>Sort by ID</a>
                        </div>
                    </nav>
                </header>
                <ul id="pokemon-list">
                    { this.state.pokemonList.map( ( p, index ) => {
                        return this.renderPokemon( index );
                    } ) }                     
                </ul>
            </div>
        );
    }
}
