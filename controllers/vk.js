module.exports.answer = async function(req, res)
{
    const body = req.body;

    switch(body.type)
    {
        case 'confirmation':
            res.send(CONFIRMATION);
            break;
        case 'message_new':
            res.send('ok');
            break;
        default:
            res.send('ok');
            break; 
    }
}

