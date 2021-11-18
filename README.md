# Chat Demo
A live demonstration of private communication on a public channel. 

<div style="center"><img src="https://imgur.com/WLDbRZi.png"></div>

## How it Works

We utilize simple web sockets via [socket.io](http://socket.io/) to create a central chat room that broadcasts all messages to all members and [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) for message encryption/decryption.

Before joining the chat room, the user generates a public key `[e,n]` and private key `[d,n]`. After generating the keys, the client *Registers* with the chat server by sending its public key which is broadcasted to all users.

Once the user has joined they can send unencrypted or encrypted messages. To send encrypted messages, they can click on a joined user's public key which will be filled into the *encrypt* field and write the message they want to encrypt in the *send* field. After clicking the encrypt button, their message will be encrypted and replace the plaintext in the *send* field. 

Messages are filtered by each client. When a client receives a message with it's public key as the header, it will automatically decrypt the message and alert the user that a message was received.

<div style="center"><img src="https://imgur.com/ldWBZpO.png"></div>

## Prerequisites
* Make sure you're using version `8.0.0` of Node - a simple way to manage your Node versions is to use [nvm](https://github.com/nvm-sh/nvm):

```
~ nvm install 8.0.0
~ nvm use 8.0.0
```

* Install the latest version of [Nightly Rust](https://www.oreilly.com/library/view/rust-programming-by/9781788390637/e07dc768-de29-482e-804b-0274b4bef418.xhtml):

```
~ rustup default nightly
```

* Install the following cargo:

```
~ cargo install wasm-bindgen-cli --git https://github.com/rustwasm/wasm-bindgen --force
```

* Add missing targets:

```
~ rustup target add wasm32-unknown-unknown
~ rustup target add x86_64-unknown-linux-gnu
```

## How to Use?

### Setup
```shell
git clone https://github.com/robertDurst/ChatDemo.git
cd ChatDemo
npm install
npm run build-debug // or npm run build-release
```

### Start Client
```shell
npm run client
```

### Start Server
```shell
npm run server
```

### Test
```shell
cargo test
```

## Cryptography Dependencies

The underlying crypto makes heavy use of the crates in [rust-num](https://github.com/rust-num), specifically [num-bigint](https://github.com/rust-num/num-bigint) and [num-trait](https://github.com/rust-num/num-trait) crates.

The randomness for the crypto uses the rust [rand](https://crates.io/crates/rand) crate.
