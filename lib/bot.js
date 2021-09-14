const { GithubHandler, VkHandler } = require( './message-handler' );
const { VkSender } = require( './message-sender' );
const { Readable } = require( 'stream' );
const { RequestParseError, HandlerNotFoundError, UnexpectedMessageTypeError } = require( './errors' );
const { VkMessage } = require( './message' );

class Bot {
  constructor( { githubEvents, vkEvents }, { vkToken, githubUrl, vkUrl } ) {
    this.handlers = {};
    this.handlers[ vkUrl ] = new VkHandler( vkEvents );
    this.handlers[ githubUrl ] = new GithubHandler( githubEvents );
    this.vkSender = new VkSender( vkToken );
  }

  async listener( request ) {
    const { body, handler, headers } = await this.parseRequest( request );
    const result = await handler.handle( body, headers );
    if ( result && typeof result === 'string' ) {
      return result;
    } else if ( result && typeof result === 'object' ) {
      this.answer( result );
    }
    return 'OK';
  }

  sendMessage( message ) {
    if ( message instanceof VkMessage ) {
      this.vkSender.send( message );
    } else {
      throw new UnexpectedMessageTypeError();
    }
  }

  answer( result ) {
    if ( result.length !== undefined ) {
      for ( const message of result ) {
        this.sendMessage( message );
      }
    } else {
      this.sendMessage( result );
    }
  }

  async parseRequest( request ) {
    const body = await this.getBody( request );
    const handler = this.getHandler( request );
    const headers = this.getHeaders( request );

    return { body, handler, headers };
  }

  getHeaders( request ) {
    const { headers } = request;
    if ( !headers ) {
      throw new RequestParseError( 'Cannot get headers from request!' );
    }

    return headers;
  }

  getHandler( request ) {
    const { url } = request;
    if ( !url ) {
      throw new RequestParseError( 'Cannot get url from request!' );
    }
    const handler = this.handlers[ url ];
    if ( !handler ) {
      throw new HandlerNotFoundError();
    }

    return handler;
  }

  async getBody( request ) {
    let body = '';

    if ( request.body ) {
      body = request.body;
    } else if ( request instanceof Readable ) {
      const buffers = [];
      for await ( const chunk of request ) {
        buffers.push( chunk );
      }
      try {
        body = JSON.parse( Buffer.concat( buffers ).toString() );
      } catch ( error ) {
        throw new RequestParseError( 'JSON error parse' );
      }
    } else {
      throw new RequestParseError( 'No body property and request is not Readable!' );
    }

    return body;
  }

}

module.exports = {
  Bot
};
