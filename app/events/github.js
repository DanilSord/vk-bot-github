const Chat = require( '../models/chat.js' );
const { VkMessage } = require( '../../index' );

const FIELDS_NAMES = {
  'repository.name': 'REPOSITORY',
  'sender.login': 'USER',
  'ref': 'BRANCH',
  'pull_request.base.ref': 'TARGET-BRANCH',
  'pull_request.head.ref': 'BRANCH',
  'pull_request.title': 'TITLE',
  'pull_request.commits': 'COMMITS',
  'pull_request.additions': 'ADDITIONS',
  'pull_request.deletions': 'DELETIONS',
  'pull_request.changed_files': 'CHANGED-FILES',
  'ref_type': 'CREATE',
  'review.body': 'REVIEW',
  'review.state': 'STATE',
  'issue.title': 'TITLE',
  'comment.body': 'REVIEW',
  'commment.body': 'COMMENT'
};

async function getMessages( data, repositoryUrl ) {
  const chats = await Chat.find( { repositories: repositoryUrl } );
  const messeges = [];
  for ( const chat of chats ) {
    messeges.push( new VkMessage( data, chat.chatID ) );
  }
  return messeges;
}

function getDeepProperty( object, path ) {
  const fields = path.split( '.' );
  let result = object;
  for ( const field of fields ) {
    if ( result[ field ] ) {
      result = result[ field ];
    } else {
      return result[ field ];
    }
  }

  return result;
}

function getFieldsData( eventName, body ) {
  let data = `|---${ eventName }---|:\n`;
  for ( const name in FIELDS_NAMES ) {
    const value = getDeepProperty( body, name );
    if ( value ) {
      data += `${ FIELDS_NAMES[ name ] }: ${ value }\n`;
    }
  }

  return data;
}

module.exports = {
  push( body ) {
    let data = getFieldsData( 'PUSH', body );

    for ( const index in body.commits ) {
      data += `${ index }) ${ body.commits[ index ].message } -
      ${ body.commits[ index ].committer.username ? body.commits[ index ].committer.username
    : body.commits[ index ].committer.name }\n`;
    }
    return getMessages( data, body.repository.html_url );
  },

  'pull_request': ( body ) => {
    let data = getFieldsData( 'PULL-REQUEST', body );

    switch ( body.action ) {
    case 'opened':
      return getMessages( data, body.repository.html_url );
    case 'edited':
      data += `CHANGES-TITLE: ${ body.changes.title ? body.changes.title.from || '' : '' }\n
                CHANGES-BODY: ${ body.changes.body ? body.changes.body.from || '' : '' }\n`;
      return getMessages( data, body.repository.html_url );
    case 'closed':
      data += 'NOW IS CLOSED';
      return getMessages( data, body.repository.html_url );
    }
  },

  create( body ) {
    const data = getFieldsData( 'CREATE', body );
    return getMessages( data, body.repository.html_url );
  },

  'pull_request_review': ( body ) => {
    const data = getFieldsData( 'PULL-REQUEST-REVIEW', body );

    if ( body.action === 'submitted' ) {
      return getMessages( data, body.repository.html_url );
    }
  },

  'issue_comment': ( body ) => {
    const data = getFieldsData( 'ISSUE-COMMENT', body );

    if ( body.action === 'created' ) {
      return getMessages( data, body.repository.html_url );
    }
  },

  'pull_request_review_comment': ( body ) => {
    const data = getFieldsData( 'PULL-REQUEST-REVIEW-COMMENT', body );

    if ( body.action === 'created' ) {
      return getMessages( data, body.repository.html_url );
    }
  },

  default( body ) {
    const data = getFieldsData( 'DEFAULT', body );
    return getMessages( data, body.repository.html_url );
  }
};
