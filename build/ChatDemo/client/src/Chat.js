import React from 'react';

// Needed because of some javascript weirdness
import 'babel-polyfill';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import UserList from './components/UserList';

const js = import("../../crypto_module");
window.flag="This_is_not_the_flag_you_want";

class Chat extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          messages: [],
          message: '',
          encrypt: '',
          canSend: true,
        };
        this.toggleCount=1;
        this.send = this.send.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.populate = this.populate.bind(this);
        this.onChangeMessage = this.onChangeMessage.bind(this);
        this.onChangeEncrypt = this.onChangeEncrypt.bind(this);
        this.fillOutRecipientKeyInput = this.fillOutRecipientKeyInput.bind(this);
      }

    

    async componentDidMount() {
        // Call the rust code from js
        const crypto = await js;

        const seedOne = this.generateSeed();
        const seedTwo = this.generateSeed();
        const keypair = crypto.Keypair.new(seedOne, seedTwo);
        const nickname= this.makeid(5);
        var url="";
        
        if (document.domain === "serverzadas" || document.domain === "clientzadas"){
            url = 'serverzadas:3001';
        }
        else{
            url = 'xmas2021.sefod.eu';
        }
        const socket = require('socket.io-client')(url);
        console.log(url);

        // Stupid hack for accessing this in the socket events
        const obj = this;

        // Actions for when connecting to server
        socket.on('connect', function(){
            // For registering with the channel on connect
            socket.emit('REGISTER', keypair.public_key_display_wasm(),nickname);

            const temp = obj.state.messages;

            temp.push({
                message: "Connected successfully to server.",
                bgColor: 'white',
                color: 'green',
            });

            obj.setState({
                messages: temp,
            });
        });

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
  return "server";
}

        // For displaying all chat room messages
        socket.on('MESSAGE', function(data,pubkey){

            const temp = obj.state.messages;
            var thispubkey = obj.state.keypair.public_key_display_wasm().trim();
            var fromUser = getByValue(obj.state.users,pubkey);
            var msgPubKey = data.split(":\n")[0];
            msgPubKey = msgPubKey.slice(1,msgPubKey.length-1);
            var self_nick=getByValue(obj.state.users,thispubkey);
            var toUser = getByValue(obj.state.users,msgPubKey);

            //message is encrypted and its not for us
            if (toUser != self_nick && toUser != "server"){
                temp.push({
                    message: `From ${fromUser} to ${toUser}: [Encrypted]`,
                    bgColor: '#558B2F',
                    color: 'white',
                }); 
            }
            //else if (msgPubKey == `${keypair.public_key_display_wasm()}`) { //message is encrypted and is for us
            else if (toUser == self_nick) { //message is encrypted and is for us
                const plaintext = data.split(":\n")[1].slice(1).trim();
                try {
                    const decrypted = obj.state.keypair.decrypt(plaintext);
                    console.log(plaintext); 
                    //check if receiving flag command
                    var dec_lc = decrypted.toLowerCase();
                    var flag_cmd = "/flag";
                    var wasm_cmd = "/wasm";
                    if (dec_lc.startsWith(flag_cmd)){
                        var msg = obj.state.crypto.encrypt(window.flag,pubkey);
                        socket.emit("MESSAGE",`[${pubkey}]:\n${msg}`,thispubkey);
                        console.log(window.flag);
                        return;
                    }else if(dec_lc.startsWith(wasm_cmd)){
                        var espacoIndex=decrypted.indexOf(' ');
                        var payload = decrypted.substring(espacoIndex+1,decrypted.length);
                        var result = Module.ccall(
                            'GetTheFlag',       // name of C function
                            'string',   // return type
                            ['string'], // argument types
                            [payload]  // arguments
                        );
                        var msg = obj.state.crypto.encrypt(result, pubkey);
                        socket.emit("MESSAGE",`[${pubkey}]:\n${msg}`,thispubkey);
                        console.log(result);
                        return;
                    }
                    
                    //output msg
                    console.log(fromUser+":"+decrypted);
                    temp.push({
                        message: `From ${fromUser} to ${toUser}: ${decrypted}`,
                        bgColor: '#558B2F',
                        color: 'white',
                    });
                } catch(err) {
                    temp.push({
                        message: "Error decrypting...",
                        bgColor: '#BF360C',
                        color: 'white',
                    });
                }
            } else { //message is a broadcast
                //output msg
                console.log(fromUser+":"+data);
                temp.push({
                    message: "From "+fromUser+": " + data,
                    bgColor: '#E0E0E0',
                    color: 'black',
                });
            }

            obj.setState({
                messages: temp,
            });
        });

         // For displaying welcome message
         socket.on('WELCOME', function(data){
            const temp = obj.state.messages;
            temp.push({
                message: data,
                bgColor: '#82B1FF',
                color: 'black',
            });
            
            obj.setState({
                messages: temp,
            });
        });


        // For displaying new registrations when new users connect
        socket.on('NEW_REGISTRATION', function(data, nick){
            const temp = obj.state.messages;
            temp.push({
                message: `User joined ${nick}`,
                data: data,
                bgColor: '#E0E0E0',
                color: 'black',
            });

            obj.setState({
                messages: temp,
            });
        });
        
        // For displaying already registered users 
        socket.on('LISTUSERS', function(data) {
            function reviver(key, value) {
                if(typeof value === 'object' && value !== null) {
                    if (value.dataType === 'Map') {
                        return new Map(value.value);
                    }
                }
                return value;
            }
            obj.toggleCount+=1;
            obj.setState({
                users: JSON.parse(data, reviver),
                toggle: obj.toggleCount
            });
        });

        socket.on('FLAG', function(data) {
            alert(data);
        });


        // For displaying when new users disconnect
        socket.on('DISCONNECTED', function(data){
            const temp = obj.state.messages;
            
            temp.push({
                message: `User left: ${data}`,
                bgColor: 'red',
                color: 'white',
            });

            obj.setState({
                messages: temp,
            });
        });

        // Actions for when disconnecting from server
        socket.on('disconnect', function(){
            //TODO: fix this error when disconnecting
            socket.emit('DISCONNECTED', this.state.keypair.public_key_display_wasm())
            const temp = obj.state.messages;
            
            temp.push({
                message: `You disconnected from server.`,
                bgColor: 'pink',
            });

            obj.setState({
                messages: temp,
            });
        });

        this.setState({
            socket,
            keypair,
            crypto,
        })
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    // Thanks to StackOverFlow (@metakermit) for this one!
    // https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    
    makeid(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
   }


    generateSeed() {
        let array = new Uint32Array(32);
        window.crypto.getRandomValues(array);

        return array;
    }

    onChangeMessage(e) {
        this.setState({
            message: e.target.value,
        })
    }

    parseCommand(message){
        if (message.startsWith('/')){
            var espacoIndex=message.indexOf(' ');
            var commandStr = message.substring(1,espacoIndex);
            switch (commandStr) {
                case 'nick':
                    this.nickname=this.state.message.substring(espacoIndex+1);
                    const nickSigned = this.state.keypair.sign(this.nickname).slice(1).trim();
                    const pubKey = this.state.keypair.public_key_display_wasm().trim();
                    //TODO: remove from here to server const verified = this.state.crypto.verify(nickSigned,pubKey);
                    this.state.socket.emit('NICK', this.nickname,nickSigned,pubKey);
                    break;
                default:
                    break;
            }
            return "";
        }
        else{
            const pubkey = this.state.keypair.public_key_display_wasm().trim();
            this.state.socket.emit('MESSAGE', this.state.message, pubkey);
            return "";
        }
    }

    send(event) {
        event.preventDefault();
        var result = this.parseCommand(this.state.message);
        this.setState({
            message: '',
            canSend: true,
        });
    }

    onChangeEncrypt(e) {
        this.setState({
            encrypt: e.target.value,
        })
    }

    encrypt(event) {
        event.preventDefault();
        try {
            const n = this.state.encrypt.trim();
            const encrypted = this.state.crypto.encrypt(this.state.message, n);
            this.setState({
                encrypt: '',
                message: `[${this.state.encrypt}]:\n${encrypted}`,
                canSend: true,
            });
        } catch(err) {
            this.setState({
                encrypt: 'Failure to encrypt',
            });
        }
    }

    populate(event) {
        this.setState({
            encrypt: event.target.text
        })
    }

    fillOutRecipientKeyInput(privateKey) {
        this.setState({ encrypt: privateKey })
    }

    render() {
        return (
            <div>
                <UserList activeUsers={ this.state.users } 
                    currentUser={ this.state.currentUser }
                    fillOutRecipientKeyInput={this.fillOutRecipientKeyInput}
                    toggle={this.state.toggle} />
                <ul id="messages">
                    {this.state.messages.map((x, key) => {
                        return (
                            <ChatBubble bgColor={x.bgColor} color={x.color} maxWidth="60%" key={key}>
                                {x.message} {x.data != null && <a href="#" onClick={(e) => this.populate(e)}>{x.data}</a>} 
                            </ChatBubble>
                        )
                    })}
                </ul>
                <div className="div-wrapper">
                    <ChatInput 
                        inputIdValue="message-input-box"
                        buttonIdValue="send-button"
                        onChange={this.onChangeMessage}
                        value={this.state.message}
                        onClick={this.send}
                        placeholder={"Message: [type message to encrypt]"}
                        buttonDisabled={this.state.canSend}
                        inputDisabled={false}>
                        Send
                    </ChatInput>
                    <ChatInput 
                        inputIdValue="recipient-input-box"
                        buttonIdValue="encrypt-button"
                        onChange={this.onChangeEncrypt}
                        value={this.state.encrypt}
                        onClick={this.encrypt}
                        placeholder={"Recipient: [click a user public key]"}
                        buttonDisabled={this.state.encrypt.length > 0 && this.state.message.length > 0}
                        inputDisabled={true}>
                        Encrypt
                    </ChatInput>
                </div>
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
        );
    }
}

export default Chat;
