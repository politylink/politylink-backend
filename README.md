## Getting Started

```bash
cd grandstack
docker-compose build
docker-compose up -d
```

## Seeding The Database

Optionally you can seed the GraphQL service by executing mutations that will write sample data to the database:

```bash
docker-compose exec api npm run seedDb
```