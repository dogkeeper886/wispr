FROM node:19
COPY express/public /
COPY express/index.js /
COPY express/index.js /package.json
RUN cat ${API_KEY} > /integration.key
CMD [ "npm", "start" ]
