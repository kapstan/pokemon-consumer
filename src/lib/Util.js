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
}