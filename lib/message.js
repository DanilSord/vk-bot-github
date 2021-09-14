class Message {
  constructor( data ) {
    this.data = data;
  }
}

class VkMessage extends Message {
  constructor( data, peerId ) {
    super( data );
    this.peerId = peerId;
  }
}

module.exports = {
  VkMessage
};
