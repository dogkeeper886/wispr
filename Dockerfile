FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY express/package.json ./
COPY express/package-lock.json ./
COPY express/public ./
COPY express/index.js ./
COPY express/integration.key ./

RUN npm install
CMD [ "npm", "start" ]
