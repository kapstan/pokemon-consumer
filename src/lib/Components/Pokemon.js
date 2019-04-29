import React from 'react';
import { CACHE_DEFAULT_KEY } from '../Constants';

export default class Pokemon extends React.Component {
    constructor()
    {
        super();
        this.state = {
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
        .then( responseJson => {
            this.setState( {
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

    render()
    {
        return (
            <li className="pokemon list-inline-item card col-xs-12 col-md-4">
                <img className="card-img-top" src={this.state.image} alt={this.state.name}></img>
                <div className="card-body">
                    <h5 className="card-title">{this.state.name}</h5>
                    <p className="card-text"></p>
                    <button className="btn btn-primary btn-toggle-favorite">{this.state.name}</button>
                </div>
            </li>
        );
    }
}