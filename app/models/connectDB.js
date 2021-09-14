const mongoose = require( 'mongoose' );
const { MONGO_URI } = require( '../config/config.js' );

module.exports = function() {
  mongoose.connect( MONGO_URI )
    .then( () => console.log( 'MongoDB connected.' ) )
    .catch( ( error ) => console.log( error ) );
};
