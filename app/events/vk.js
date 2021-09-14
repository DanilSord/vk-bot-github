const { CONFIRMATION } = require( '../config/config.js' );
const Chat = require( '../models/chat.js' );
const { VkMessage } = require( '../../index' );

async function addRepository( text, peerId ) {
  const chat = await Chat.findOne( { chatID: peerId } );
  const repositoryURL = text.substr( 'add '.length );

  if ( !chat ) {
    await new Chat( { chatID: peerId, repositories: [ repositoryURL ] } ).save();
  } else {
    await Chat.update( { chatID: chat.chatID }, { $addToSet: { repositories: repositoryURL } } );
  }

  return new VkMessage( 'Репозиторий добавлен. Подключите GitHub webhook для отслеживания.', peerId );
}

module.exports = {
  'message_new': ( body ) => {
    const { text } = body.object.message;
    const peerId = body.object.message.peer_id;

    if ( text.match( /^add .*$/ ) ) {
      return addRepository( text, peerId );
    }
  },

  confirmation() {
    return CONFIRMATION;
  },

  default() {
    return 'OK';
  }
};
