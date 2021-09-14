const { request } = require( 'undici' );
const { IncorrectMessageError, NotImplementedError } = require( './errors' );
const { VkMessage } = require( './message' );

const SEND_METHOD = 'https://api.vk.com/method/messages.send';
const API_VERSION = '5.103';

class MessageSender {
  send() {
    throw new NotImplementedError();
  }
}

class VkSender extends MessageSender {
  constructor( token ) {
    super();
    this.token = token;
  }

  send( message ) {
    if ( !( message instanceof VkMessage ) ) {
      throw new IncorrectMessageError( 'Expected VkMessage!' );
    }

    const randomId = Math.floor( Math.random() * Number.MAX_SAFE_INTEGER );
    const body = new URLSearchParams( {
      message: message.data,
      'peer_id': message.peerId,
      'access_token': this.token,
      'random_id': randomId,
      v: API_VERSION
    } ).toString();

    return request( SEND_METHOD, { body, method: 'POST' } );
  }
}

module.exports = {
  VkSender
};
