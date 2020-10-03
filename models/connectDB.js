const mongoose = require( 'mongoose' )
const { mongoURI } = require( '../config/config.js' )

module.exports = function()
{
    mongoose.connect( mongoURI )
    .then( () => console.log( 'MongoDB connected.' ) )
    .catch( error => console.log( error ) )
}
