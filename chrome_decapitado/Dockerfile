FROM ubuntu:18.04
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
RUN apt-get install -y nodejs-dev
RUN apt-get install -y npm
RUN rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash chromezadas
RUN chown chromezadas:chromezadas /ctf
USER chromezadas

RUN curl curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

RUN echo 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' > $HOME/.bashrc
RUN source $HOME/.bashrc; nvm install lts/gallium
RUN source $HOME/.bashrc; nvm use lts/gallium

RUN mkdir -p /ctf
COPY example.js /ctf/
RUN source $HOME/.bashrc; npm install puppeteer
RUN source $HOME/.bashrc; npm --prefix /ctf/node_modules/puppeteer/ install
RUN source $HOME/.bashrc; npm i puppeteer --save
