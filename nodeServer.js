const net = require('net');
const uniqid = require('uniqid');
const userInput = process.stdin;
const fs = require('fs');
userInput.setEncoding('utf-8');
let stream = fs.createWriteStream('chat.log');
let clientList = [];

let server = net.createServer(client => {
    let newId = uniqid();
    client.name = 'client' + '(' + newId + ')';
    let clientName = client.name;
    clientList.push(client);
    broadcast(clientName, `${clientName} has joined the channel.\n`)
    client.write(`Welcome to the chat room, ${clientName}!`);
    stream.write(`${clientName} has joined the channel.\n`)


    client.on('data', data => {
        let message = clientName + ': ' + data.toString();
        stream.write(message);
        broadcast(clientName, message);
    });
    

    client.on('end', () => {
        let message = clientName + ':' + ' has left the channel.\n';
        stream.write(message);
        broadcast(clientName, message);
        clientList.splice(clientList.indexOf(clientName), 1);
    });

    client.on('error', (e) => {
        // console.log("Oops, something went wrong.");
    });

}).listen(5000);
console.log('Listening on port 5000');

function broadcast(from, message) {
    if (clientList.length === 0) {
        process.stdout.write('Everyone left the chat');
        return;
    }
    clientList.forEach(function(client, index, array){
        if(client.name === from) {
            return;
        }else {
            client.write(message);
        }
    
    });
    
};