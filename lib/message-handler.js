const { NotImplementedError } = require( './errors' );

const GITHUB_EVENT_HEADER = 'x-github-event';

class MessageHandler {
  constructor( routes ) {
    this.routes = routes;
  }

  handle() {
    throw new NotImplementedError();
  }
}

class GithubHandler extends MessageHandler {
  constructor( routes ) {
    super( routes );
  }

  handle( data, headers ) {
    const event = headers[ GITHUB_EVENT_HEADER ];
    if ( Object.prototype.hasOwnProperty.call( this.routes, event ) ) {
      return this.routes[ event ]( data );
    } else if ( Object.prototype.hasOwnProperty.call( this.routes, 'default' ) ) {
      return this.routes.default( data );
    }
  }
}

class VkHandler extends MessageHandler {
  constructor( routes ) {
    super( routes );
  }

  handle( data ) {
    const event = data.type;
    if ( Object.prototype.hasOwnProperty.call( this.routes, event ) ) {
      return this.routes[ event ]( data );
    } else if ( Object.prototype.hasOwnProperty.call( this.routes, 'default' ) ) {
      return this.routes.default( data );
    }
  }
}

module.exports = {
  GithubHandler,
  VkHandler
};
