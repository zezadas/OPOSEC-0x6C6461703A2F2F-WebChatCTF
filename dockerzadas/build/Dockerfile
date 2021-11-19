#git clone the repo to this same folder. it will be used on the copy process

FROM ubuntu:18.04
EXPOSE 8080
EXPOSE 3001
#why not alpine. Alpine sucks as always and does not use libc.
WORKDIR /ctf

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
        apt-transport-https \
        build-essential \
        ca-certificates \
        curl \
        git \
        libssl-dev \
        wget \
        pkg-config \
        chromium-browser
RUN apt-get install -y nodejs-dev node-gyp libssl1.0-dev
RUN apt-get install -y npm
RUN rm -rf /var/lib/apt/lists/*
#ENV NVM_DIR /usr/local/nvm # or ~/.nvm , depending
#ENV NODE_VERSION 0.39.0
RUN curl curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
#\
#    && . $NVM_DIR/nvm.sh \
#    && nvm install $NODE_VERSION \
#    && nvm use default
#    && nvm use default

#ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
#ENV PATH      $NVM_DIR/v$NODE_VERSION/bin:$PATH

RUN echo 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' > $HOME/.bashrc
RUN source $HOME/.bashrc; nvm install 8
RUN source $HOME/.bashrc; nvm use 8

RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
RUN echo 'source $HOME/.cargo/env' >> $HOME/.bashrc
RUN source $HOME/.bashrc; rustup default nightly
RUN source $HOME/.bashrc; rustup toolchain install nightly
RUN source $HOME/.bashrc; rustup target add wasm32-unknown-unknown

COPY ChatDemo/ /ctf
RUN npm install
RUN source $HOME/.bashrc; cargo install wasm-bindgen-cli --git https://github.com/rustwasm/wasm-bindgen --force
RUN source $HOME/.bashrc; npm run build-debug
#ENTRYPOINT ["mysql"]
