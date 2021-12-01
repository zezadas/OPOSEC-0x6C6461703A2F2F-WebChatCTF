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

function map2json(mapzadas){
 return JSON.stringify(mapzadas, replacer);
}

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

  });


  // For displaying and broadcasting all chat messages
  socket.on('MESSAGE', function(data,pubKey){
    if(pubKey.trim()!=socket.pubkey){
        socket.emit("MESSAGE","nope");
        return;
    }
      //if pubkey != "" and == socket.pubkey
    console.log(data);
    io.emit('MESSAGE', data,pubKey);
  });

  // For displaying and broadcasting all chat messages
  socket.on('LISTUSERS', function(data){
    console.log(users);
    updateUsers();
  });

  socket.on('FLAG', function(data){
    console.log(data);
    socket.emit('FLAG', "flag{BoloRei_And_WebSockets_4_Xmas}");
    console.log("flag{BoloRei_And_WebSockets_4_Xmas}");
  });



  //sock on 'FLAG' ... flag{ez flag}

  //update nick securely
  socket.on('NICK', function(nick,nickSigned,pubKey){
    const unsignedNick = api.verifyC(nickSigned,pubKey);
    if (unsignedNick === nick){
        
        if(!(socket.pubkey === pubKey)){
            //TODO: FLAG{MyCryptoBringsAllTheFlags2TheYard}
            return;
        }
        var oldNick = socket.username; 
        if (!users.has(nick)){
            users.set(nick,users.get(oldNick));
            users.delete(oldNick);
            socket.username=nick;
        }
        //TODO: set nickname. procurar nome antigo no mapa e alterar
        updateUsers(1);
    }
    else{
        //socket emit came at me bro, break me
        return;//dont mess with me
    }

  });


   // For displaying and broadcasting all when users disconnect
   socket.on('disconnect', function(data){
    console.log("User left:", data);
    updateUsers(1);

    io.emit('DISCONNECTED', data);
  });
});

function updateUsers(deleted=0){
    if (deleted == 1){
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
    io.emit("LISTUSERS", map2json(users));

}

http.listen(port, function(){
  console.log('listening on *:' + port);
});
