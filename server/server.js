const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

const ffi = require('ffi');
var library_name = 'target/x86_64-unknown-linux-gnu/debug/libcrypto_module.so';
var  api= ffi.Library(library_name, {
      'verifyC': ['string', ['string', 'string']]
});


var users = new Map();

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
    const unsignedNick = api.verifyC(nickSigned,pubKey);
    if (unsignedNick === nick){
        
        if(socket.pubKey === pubKey){
            //TODO: FLAG{MyCryptoBringsAllTheFlags2TheYard}
            return;
        }
        //TODO: set nickname. procurar nome antigo no mapa e alterar
        updateUsers();
        socket.emit('LISTUSERS', users);
    }
    else{
        return;//dont mess with me
    }

  });


   // For displaying and broadcasting all when users disconnect
   socket.on('disconnect', function(data){
    console.log("User left:", data);
    updateUsers();

    socket.broadcast.emit("LISTUSERS", JSON.stringify(users, replacer));

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
