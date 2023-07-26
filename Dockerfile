FROM node:16

WORKDIR /server

COPY package.json package-lock.json ./

# Bundle app source
COPY . .

RUN npm install

RUN npm build

EXPOSE 3000

CMD [ "npm", "remix-serve", "api/"]