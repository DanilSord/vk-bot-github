const express = require( 'express' )
const bodyParser = require( 'body-parser' )
const app = express()
const setRoutes = require( './routes/routes.js' )
const connectDB = require( './models/connectDB.js' )
const { PORT } = require( './config/config.js' )

app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json( { limit: '50mb' } ) )
setRoutes( app )
connectDB()

app.get( '/', ( req, res ) => {
  res.send( 'Hello from VkBot by DanilSord' )
} )

app.listen( PORT, () => console.log( `Example app listening on port ${ PORT }!` ) )