const Chat = require('../models/chat.js');
const send = require('../utils/sendMessage');

module.exports.processAction = function( req, res )
{
    const body = req.body

    if( !!body.commits.length ) {
        processCommits( body )
    } else if ( !!body.pull_request ) {
        
    }
            

    res.send( 'ok' )
}

function processPullRequest( body ) {
    let data = `|---PULL-REQUEST---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\n`

    switch ( body.action ) {
        case 'opened': 
            sendMessageFromRepository( data, body.repository.url )
            break;
        case 'edited':
            data += `CHANGES-TITLE: ${ body.changes.title ? body.changes.title.from || '' : '' }\nCHANGES-BODY: ${ body.changes.body ? body.changes.body.from || '' : '' }\n`
            sendMessageFromRepository( data, body.repository.url )
            break;
        case 'closed':
            data += `NOW IS CLOSED`
            sendMessageFromRepository( data, body.repository.url )
            break;      
    }
}

function processCommits( body ) {
    let dataString = `|---PUSH---|:\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nBRANCH: .${ body.ref }.\nCOMMITS:\n`

    for( const index in body.commits )
        dataString += `${ index }) ${ body.commits[ index ].message } - ${ body.commits[ index ].committer.username ? body.commits[ index ].committer.username : body.commits[ index ].committer.name }\n`
    
    sendMessageFromRepository( dataString, body.repository.url )
}

async function sendMessageFromRepository( data, repository )
{
    const chats = await Chat.find( { repositories:repository } )
    
    for( chat of chats )
        send( data, chat.chatID );
}