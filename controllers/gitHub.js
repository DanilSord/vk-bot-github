const Chat = require('../models/chat.js');
const send = require('../utils/sendMessage');

module.exports.processCommits = async function(req, res)
{
    const body = req.body;
    let dataString = `${body.repository.name}"\nВетка: ".${body.ref}."\nПользователь: ".${body.pusher.name}."\n\nКоммиты:\n"`;

    for(const index in body.commits)
        dataString += `${index}) ${body.commits[index].message} - ${body.commits[index].committer.name}\n`;
    
    sendMessageFromRepository(dataString, body.repository.url);

    res.send("ok");
}

async function sendMessageFromRepository(data, repository)
{
    const chats = await Chat.find({repositories:repository});
    
    for(index in chats)
        send(data, chats[index].chatID);
}