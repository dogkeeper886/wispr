FROM node:19
COPY express/ /
RUN cat ${API_KEY} > /integration.key
CMD [ "npm", "start" ]
