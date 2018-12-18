FROM node:10-jessie

WORKDIR /usr/src/bin

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production

COPY . .

ENV BOT_TOKEN=''

CMD npm start