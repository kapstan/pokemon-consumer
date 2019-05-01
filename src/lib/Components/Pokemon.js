import React from 'react';
import { CACHE_DEFAULT_KEY, FAVORITES_CACHE_KEY } from '../Constants';
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
            this.setState( {
                id: responseJson.id,
                name: responseJson.name,
                url: responseJson.url,
                image: responseJson.sprites.front_default,
                isFavorite: null
            } );
        } )
        .catch( _ => {
            return caches.match( requestUrl );
        } );
    }

    getFavoriteStatus( index )
    {
        let favorites = localStorage.getItem( FAVORITES_CACHE_KEY );
        if( favorites === null ) {
            return false;
        }

        favorites = favorites.split( ',' );
        return favorites.includes( index );
    }

    render()
    {
        const nameCapitalized = Util.capitalize( this.state.name );
        const isFavorite = this.getFavoriteStatus( this.state.id );
        const favoriteIconClass = ( isFavorite ) ? 'align-middle fas fa-heart' : 'align-middle far fa-heart';

        return (
            <li className="pokemon col-md-3 col-sm-12 mr-auto mb-2">
                <div className="card w-90">
                    <img className="card-img-top" src={this.state.image} alt={nameCapitalized}></img>
                    <div className="card-body">
                        <h5 className="card-title text-center">{nameCapitalized}</h5>
                        <span className="favorite-indicator-container d-block ml-auto mr-auto text-center" onClick={this.props.onFavoriteClick}>
                            <i className={favoriteIconClass}></i>
                        </span>
                    </div>
                </div>
            </li>
        );
    }
}