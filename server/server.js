const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

//const ffi = require('ffi');

var users = new Map();

io.on('connection', function(socket){
  // For announcing the connection of new users by public key
  socket.on('REGISTER', function(data,nick){
    
    //user is already registered. dont mess with me
    if(socket.username!=null){
        return;
    }
    
    //set socket inner props, this is also replicated on the users map
    socket.username=nick;
    socket.pubkey=data;
   
    //update users map
    users.set(nick,data); 
    
    console.log("User joined:", data);
    socket.emit('WELCOME', `Welcome ${nick}!\nYour public key: ${data}`);

    //dar as boas novas a todos na sala
    socket.broadcast.emit("NEW_REGISTRATION", data, nick);

    updateUsers();

    function replacer(key, value) {
      if(value instanceof Map) {
        return {
          dataType: 'Map',
          value: Array.from(value.entries()),
        };
      } else {
        return value;
      }
    }

    socket.broadcast.emit("LISTUSERS", JSON.stringify(users, replacer));

  });


  // For displaying and broadcasting all chat messages
  socket.on('MESSAGE', function(data){
    console.log(data);
    io.emit('MESSAGE', data);
  });

  // For displaying and broadcasting all chat messages
  socket.on('LISTUSERS', function(data){
    console.log(users);
    socket.emit('LISTUSERS', users);
  });

  //update nick securely
  socket.on('NICK', function(nick,nickSigned,pubKey){
    //TODO: add a bug here where we accept any pub key, so any user can change the nick. FLAG{MyCryptoBringsAllTheFlags2TheYard}
    //TODO: decrypt nickEnc and check if == nick
    const verified = crypto.verify(nickSigned,pubKey);
    console.log("aaaaaaaaaaaaa");
    console.log(verified);
    updateUsers();
    socket.emit('LISTUSERS', users);
  });


   // For displaying and broadcasting all when users disconnect
   socket.on('disconnect', function(data){
    console.log("User left:", data);
    updateUsers();
    socket.broadcast.emit("LISTUSERS", users);
    io.emit('DISCONNECTED', data);
  });
});

function updateUsers(){
    var tmpUsers = new Map();
    var clients = io.sockets.clients().connected;

    //    console.log(Object.keys(clients));
    //    console.log(clients);
    
    for (const sockID of Object.keys(clients)){
        var client = clients[sockID];
        var username = client.username;
        var pubkey = client.pubkey;
        if (users.has(username) && client.connected){
            tmpUsers.set(username,pubkey);
        }
        //clients[xxx].emit('MESSAGE',"da gracas por estares vivo");
    }
    //update global users list
    users = tmpUsers;
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});
