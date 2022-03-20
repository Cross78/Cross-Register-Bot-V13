const reqEvent = event => require(`../Events/${event}`);
module.exports = client => {
    client.on('ready', () => reqEvent('ready')(client));
    client.on('messageCreate', reqEvent('message'));
};