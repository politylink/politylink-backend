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
docker-compose up -d api
```


## Seeding The Database

Optionally you can seed the GraphQL service by executing mutations that will write sample data to the database:

```bash
docker-compose exec api npm run seedDb
```
