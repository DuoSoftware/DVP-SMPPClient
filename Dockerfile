#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm
#RUN git clone https://github.com/DuoSoftware/DVP-SMPPClient.git /usr/local/src/smppclient
#RUN cd /usr/local/src/smppclient; npm install
#CMD ["nodejs", "/usr/local/src/smppclient/app.js"]

#EXPOSE 8833
FROM node:9.9.0
ARG VERSION_TAG
RUN git clone -b $VERSION_TAG https://github.com/DuoSoftware/DVP-SMPPClient.git /usr/local/src/smppclient
RUN cd /usr/local/src/smppclient;
WORKDIR /usr/local/src/smppclient
RUN npm install
#EXPOSE 8833
CMD [ "node", "/usr/local/src/smppclient/app.js" ]
