FROM node:16

WORKDIR /server

COPY package.json package-lock.json ./

# Bundle app source
COPY . .

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "npx", "remix-serve", "api/"]