FROM node:7.1

RUN apt-get -y update && apt-get -y upgrade
RUN mkdir -p /hall-of-boids-api /home/nodejs && \
     groupadd -r nodejs && \
     useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
     chown -R nodejs:nodejs /home/nodejs 
RUN apt-get -y install postgresql-client

WORKDIR /hall-of-boids-api
COPY package.json /hall-of-boids-api/
RUN npm install --unsafe-perm=true

COPY . /hall-of-boids-api
RUN chown -R nodejs:nodejs /hall-of-boids-api
USER nodejs

EXPOSE 8080

CMD npm start
