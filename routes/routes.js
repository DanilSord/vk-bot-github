const vkRout = require('./vk.js');

module.exports = function(app)
{
    app.use('/api/vk', vkRout);
}