FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Exposed port should be the same on ldap-server-mock-conf.json
EXPOSE 3890

CMD [ "npm", "start" ]

