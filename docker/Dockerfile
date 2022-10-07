FROM nvidia/cuda:11.2.1-cudnn8-runtime-ubuntu20.04
ARG BUCKET_NAME
ARG CALLBACK_GATEWAY
ARG TRAINING_TABLE
ARG PROJEJCT_TABLE
RUN apt update
RUN apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt install -y nodejs
RUN npm i -g yarn
RUN npm i -g pm2
WORKDIR /usr/app
COPY . . 
RUN yarn --prod
ENV BUCKET_NAME ${BUCKET_NAME}
ENV CALLBACK_GATEWAY ${CALLBACK_GATEWAY} 
ENV TRAINING_TABLE ${TRAINING_TABLE}
ENV PROJEJCT_TABLE ${PROJEJCT_TABLE}
CMD [ "pm2-runtime", "src/app.js" ]
