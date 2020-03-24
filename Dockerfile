FROM node:12
RUN useradd --user-group --create-home --shell /bin/bash app
ENV HOME=/home/app
WORKDIR $HOME
COPY ./package.json .
RUN chown -R app:app $HOME/*
USER app
WORKDIR $HOME
RUN npm install --only=prod --silent --progress=false
COPY ./dist ./dist
EXPOSE 3000
#CMD [ "npm", "start" ]