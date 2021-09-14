const http = require( 'http' );
const connectDB = require( './models/connectDB.js' );
const { PORT, TOKEN } = require( './config/config.js' );
const { Bot } = require( '../index' );
const githubEvents = require( './events/github' );
const vkEvents = require( './events/vk' );

connectDB();

const bot = new Bot( { vkEvents, githubEvents }, { vkToken: TOKEN, vkUrl: '/vk', githubUrl: '/gitHub' } );
const server = http.createServer( async ( request, response ) => {
  try {
    const result = await bot.listener( request, response );
    response.statusCode = 200;
    response.end( result );
  } catch ( error ) {
    response.statusCode = 400;
    response.end( 'Something wrong!' );
    console.log( error );
  }
} );
server.listen( PORT );
