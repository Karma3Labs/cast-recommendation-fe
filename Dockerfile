FROM node:16

WORKDIR /server

COPY package.json ./

# Bundle app source
COPY . .

ENV NODE_ENV=development

RUN npm clean-install

RUN npx @remix-run/dev build

EXPOSE 3000

CMD [ "npx", "@remix-run/serve", "api/"]