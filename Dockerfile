FROM node:19

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY src/package.json ./
COPY src/package-lock.json ./
COPY src/server.js ./
COPY src/public ./public
COPY src/views ./public

RUN npm install
EXPOSE 8080
EXPOSE 8443
CMD [ "npm", "start" ]
