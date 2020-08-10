FROM alpine:latest

RUN apk add --no-cache nodejs npm git

WORKDIR /app

RUN git clone git://github.com/mobz/elasticsearch-head.git .
RUN npm install
CMD npm run start