const vkRoute = require( './vk.js' )
const gitHubRoute = require( './gitHub.js' )

module.exports = function( app )
{
    app.use( '/vk', vkRoute )
    app.use( '/gitHub', gitHubRoute )
}