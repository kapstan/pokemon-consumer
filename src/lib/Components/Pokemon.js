import React from 'react';
import { CACHE_DEFAULT_KEY } from '../Constants';
import Util from '../Util';

export default class Pokemon extends React.Component {
    constructor( props )
    {
        super( props );     
        this.state = {
            id: null,
            name: null,
            url: null,
            image: null,
            isFavorite: null,
        };
    }

    componentDidMount()
    {
        const requestUrl = this.props.value.url;
        
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
        .then( async responseJson => {
            /**
             * I really don't like that calling setState
             * in this lifecycle method causes an invisible
             * re-render... feels weird to me...
             * componentWillMount seems more appropriate, 
             * but is being deprecated... oh well.
             */
            Util.isFavorite( responseJson.id )
            .then( isFavorite => {
                this.setState( {
                    id: responseJson.id,
                    name: responseJson.name,
                    url: responseJson.url,
                    image: responseJson.sprites.front_default,
                    isFavorite: isFavorite
                } );
            } );
        } )
        .catch( _ => {
            return caches.match( requestUrl );
        } );
    }

    onFavoriteClick( e )
    {
        // e.nativeEvent.stopImmediatePropagation();
        // e.stopPropagation();
        this.handleFavoriteClick();
    }

    async handleFavoriteClick()
    {
        // check if pokemon is already favorite
        // if favorite, remove from list
        // if not, add to list
        // if list empty, add to list
        let favorites = Util.getFavorites(),
            method = '';

        // check base-case
        if( favorites === null ) {
            return Util.initFavorites( this.state.id );
        }

        Util.isFavorite( this.state.id )
        .then( status => {
            method = ( status ) ? 'removeFavorite' : 'addFavorite';

            Util[ method ]( this.state.id );

            this.setState( {
                isFavorite: ( method === 'removeFavorite' ) ? false : true
            } );
        } );
    }

    buildContainerClassName()
    {
        let classes = [ 'favorite-indicator-container', 'd-block', 'ml-auto', 'mr-auto', 'text-center' ];

        if( this.state.isFavorite ) {
            classes.push( 'is-favorite' );
        }

        return classes.join( ' ' );
    }

    buildIconClassName()
    {
        let baseFavoriteIconClasses = [ 'fa-heart', 'align-middle' ];
        ( this.state.isFavorite )
            ? baseFavoriteIconClasses.unshift( 'fas' )
            : baseFavoriteIconClasses.unshift( 'far' );

        return baseFavoriteIconClasses.join( ' ' );
    }

    render()
    {
        let capitalizedName = Util.capitalize( this.state.name ),
            containerCssClass = this.buildContainerClassName(),
            favoriteIconClass = this.buildIconClassName();

        return (            
            <li className="pokemon" data-pokemon-id={this.state.id}>
                <div className="card w-90">
                    <img className="card-img-top" src={this.state.image} alt={capitalizedName}></img>
                    <div className="card-body">
                        <h5 className="card-title text-center pokemon-name">{capitalizedName}</h5>
                        <span className={containerCssClass} onClick={ ( e ) => this.onFavoriteClick( e ) }>
                            <i className={favoriteIconClass}></i>
                        </span>
                    </div>
                </div>
            </li>
        );
    }
}