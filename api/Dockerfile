FROM node:latest

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./
COPY wait-for-it.sh ./
RUN npm install
COPY . .

EXPOSE 4000

CMD ["./wait-for-it.sh", "neo4j:7474", "--", "npm", "run", "start:dev"]
