const Chat = require('../models/chat.js');
const send = require('../utils/sendMessage');

module.exports.processAction = function( req, res )
{
    const body = req.body
    const event = req.headers[ 'x-github-event' ]

    if ( gitEventsHandlers.hasOwnProperty( event ) ) {
        gitEventsHandlers[ event ]( body )
        res.send( 'ok' )
    } else {
        res.sendStatus( 404 )
    }
}

const gitEventsHandlers = {
    push( body ) {
        let dataString = `|---PUSH---|:\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nBRANCH: .${ body.ref }.\nCOMMITS:\n`
    
        for( const index in body.commits )
            dataString += `${ index }) ${ body.commits[ index ].message } - ${ body.commits[ index ].committer.username ? body.commits[ index ].committer.username : body.commits[ index ].committer.name }\n`
        
        sendMessageFromRepository( dataString, body.repository.html_url )
    },

    pull_request( body ) {
        let data = `|---PULL-REQUEST---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\n`
    
        switch ( body.action ) {
            case 'opened': 
                sendMessageFromRepository( data, body.repository.html_url )
                break
            case 'edited':
                data += `CHANGES-TITLE: ${ body.changes.title ? body.changes.title.from || '' : '' }\nCHANGES-BODY: ${ body.changes.body ? body.changes.body.from || '' : '' }\n`
                sendMessageFromRepository( data, body.repository.html_url )
                break
            case 'closed':
                data += `NOW IS CLOSED`
                sendMessageFromRepository( data, body.repository.html_url )
                break      
        }
    },

    create( body ) {
        let data = `|---CREATE-${ body.ref_type.toUpperCase() }---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nBRANCH: ${ body.ref }\n`
    
        sendMessageFromRepository( data, body.repository.html_url )
    },

    pull_request_review( body ) {
        let data = `|---PULL-REQUEST-REVIEW---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\nREVIEW: ${ body.review.body }\nSTATE: ${ body.review.state }`
    
        switch ( body.action ) {
            case 'submitted':
                sendMessageFromRepository( data, body.repository.html_url )
                break
        }    
    },

    issue_comment( body ) {
        let data = `|---ISSUE-COMMENT---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTITLE: ${ body.issue.title }\nREVIEW: ${ body.comment.body }\n`
    
        switch ( body.action ) {
            case 'created':
                sendMessageFromRepository( data, body.repository.html_url )
                break
        }    
    },

    pull_request_review_comment( body ) {
        let data = `|---PULL-REQUEST-REVIEW-COMMENT---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\nCOMMENT: ${ body.commment.body }`
    
        switch ( body.action ) {
            case 'created':
                sendMessageFromRepository( data, body.repository.html_url )
                break
        }    
    }
}

async function sendMessageFromRepository( data, repository )
{
    const chats = await Chat.find( { repositories:repository } )
    
    for( chat of chats )
        send( data, chat.chatID );
}