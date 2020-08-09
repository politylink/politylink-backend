## Getting Started

```bash
cd grandstack
docker-compose build
docker-compose up -d
```

## Restart Server

```bash
docker-compose down && docker-compose build && docker-compose up -d && docker-compose logs -f
```

## Rebuild and restart only api server

```bash
docker-compose build api
docker-compose up --no-deps -d api
```


## Seeding The Database

Optionally you can seed the GraphQL service by executing mutations that will write sample data to the database:

```bash
docker-compose exec api npm run seedDb
```

## When running elasticsearch fails

Elasticsearch requires to change file owner when you want to run it on the docker.

https://techoverflow.net/2020/04/18/how-to-fix-elasticsearch-docker-accessdeniedexception-usr-share-elasticsearch-data-nodes/

```bash
sudo chown -R 1000:1000 es/esdata
```
