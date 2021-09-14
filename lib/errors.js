class IncorrectMessageError extends Error {
  constructor( message ) {
    super( message );
  }
}

class NotImplementedError extends Error {
  constructor( message ) {
    super( message );
  }
}

class RequestParseError extends Error {
  constructor( message ) {
    super( message );
  }
}

class HandlerNotFoundError extends Error {
  constructor( message ) {
    super( message );
  }
}

class UnexpectedMessageTypeError extends Error {
  constructor( message ) {
    super( message );
  }
}

module.exports = {
  IncorrectMessageError,
  NotImplementedError,
  RequestParseError,
  HandlerNotFoundError,
  UnexpectedMessageTypeError
};
