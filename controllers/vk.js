const {CONFIRMATION} = require('../config/config.js');
const Chat = require('../models/chat.js');
const send = require('../utils/sendMessage.js');

module.exports.answer = async function(req, res)
{
    const body = req.body;

    switch(body.type)
    {
        case 'confirmation':
            res.send(CONFIRMATION);
            break;
        case 'message_new':
            proccesNewMessage(body);
            res.send('ok');
            break;
        default:
            res.send('ok');
            break; 
    }
}

function proccesNewMessage(body)
{
    const {text} = body.object.message;
    const {peer_id} = body.object.message;
    
    if(text.match(/^add .*$/))
        addRepository(text, peer_id);
}

async function addRepository(text, peer_id)
{
    let chat = await Chat.findOne({chatID: peer_id});
    let repositoryName = "";

    repositoryName = text.substr("add ".length);
    
    if(!chat)
    {
        chat = new Chat({
            chatID: peer_id,
            repositories:[repositoryName]
        }).save();
    }
    else
        await Chat.update({chatID:chat.chatID},{$addToSet:{repositories:repositoryName}});
    
    send("Репозиторий добавлен. Подключите GitHub webhook для отслеживания.", peer_id);
}