const Chat = require('../models/chat.js');
const send = require('../utils/sendMessage');

module.exports.processAction = function( req, res )
{
    const body = req.body
    switch ( req.headers[ 'x-github-event' ] ) {
        case 'push':
            processCommits( body )
            res.send( 'ok' )
            break
        case 'pull_request':
            processPullRequest( body )
            res.send( 'ok' )
            break
        case 'create':
            processCreate( body )
            res.send( 'ok' )
            break
        case 'pull_request_review':
            processRequestReview( body )
            res.send( 'ok' )
            break
        case 'issue_comment':
            processIssueComment( body )
            res.send( 'ok' )
            break
        case 'pull_request_review_comment':
            processPullRequestReviewComment( body )
            res.send( 'ok' )
            break
    }
}

function processPullRequestReviewComment( body ) {
    let data = `|---PULL-REQUEST-REVIEW-COMMENT---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\nCOMMENT: ${ body.commment.body }`

    switch ( body.action ) {
        case 'created':
            sendMessageFromRepository( data, body.repository.html_url )
            break
    }    
}

function processIssueComment( body ) {
    let data = `|---ISSUE-COMMENT---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTITLE: ${ body.issue.title }\nREVIEW: ${ body.comment.body }\n`

    switch ( body.action ) {
        case 'created':
            sendMessageFromRepository( data, body.repository.html_url )
            break
    }    
}

function processRequestReview( body ) {
    let data = `|---PULL-REQUEST-REVIEW---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nTARGET-BRANCH: ${ body.pull_request.base.ref }\n BRANCH: ${ body.pull_request.head.ref }\n TITLE: ${ body.pull_request.title }\nREVIEW: ${ body.review.body }\nSTATE: ${ body.review.state }`

    switch ( body.action ) {
        case 'submitted':
            sendMessageFromRepository( data, body.repository.html_url )
            break
    }    
}

function processCreate( body ) {
    let data = `|---CREATE-${ body.ref_type.toUpperCase() }---|\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nBRANCH: ${ body.ref }\n`

    sendMessageFromRepository( data, body.repository.html_url )
}

function processPullRequest( body ) {
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
}

function processCommits( body ) {
    let dataString = `|---PUSH---|:\nREPOSITORY: ${ body.repository.name }\nUSER: ${ body.sender.login }\nBRANCH: .${ body.ref }.\nCOMMITS:\n`

    for( const index in body.commits )
        dataString += `${ index }) ${ body.commits[ index ].message } - ${ body.commits[ index ].committer.username ? body.commits[ index ].committer.username : body.commits[ index ].committer.name }\n`
    
    sendMessageFromRepository( dataString, body.repository.html_url )
}

async function sendMessageFromRepository( data, repository )
{
    const chats = await Chat.find( { repositories:repository } )
    
    for( chat of chats )
        send( data, chat.chatID );
}