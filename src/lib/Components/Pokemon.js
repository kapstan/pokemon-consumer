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
            <li className="pokemon col-md-3 col-sm-12 mr-auto mb-2">
                <div className="card w-90">
                    <img className="card-img-top" src={this.state.image} alt={capitalizedName}></img>
                    <div className="card-body">
                        <h5 className="card-title text-center">{capitalizedName}</h5>
                        <span className={containerCssClass} onClick={this.props.onFavoriteClick}>
                            <i className={favoriteIconClass}></i>
                        </span>
                    </div>
                </div>
            </li>
        );
    }
}