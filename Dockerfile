FROM node:19
COPY express/public/ /
COPY express/index.js /
COPY express/package.json /
COPY express/package-lock.json /
RUN cat ${API_KEY} > /integration.key
RUN npm install
CMD [ "npm", "start" ]
