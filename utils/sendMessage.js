const axios = require( 'axios' )
const querystring = require( 'querystring' )
const { TOKEN, SENDMETHOD, APIVERSION } = require( '../config/config.js' )
const maxnumber = 1000000000

module.exports = function( text, peerId )
{
    let randomId = Math.floor( Math.random() * maxnumber )
    let params = {   
            message:text,
            peer_id:peerId,
            access_token:TOKEN,
            random_id:randomId,
            v:APIVERSION   
    }
    
    return axios.post( `${ SENDMETHOD }`, querystring.stringify( params ) ).then( data => data.data )
}