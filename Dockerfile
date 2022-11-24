FROM nvidia/cuda:11.2.1-cudnn8-runtime-ubuntu20.04
RUN apt update
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN npm i -g yarn
RUN npm i -g pm2
WORKDIR /usr/app
COPY . . 
RUN yarn build
CMD [ "pm2-runtime", "dist/src/app.js" ]
