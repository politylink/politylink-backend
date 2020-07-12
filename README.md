## Getting Started

```bash
cd grandstack
docker-compose build
docker-compose up -d
```

If seed data is needed,

```bash
docker-compose exec api npm run seedDb
```