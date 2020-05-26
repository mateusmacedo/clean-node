FROM node:12
USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY ./package.json .
RUN npm install --only=prod --silent --progress=false
COPY ./dist ./dist
COPY ./.env .
EXPOSE 3000
CMD [ "npm", "start" ]