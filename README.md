## インストール

```bash
cd grandstack
docker-compose build
docker-compose up -d
```

### サーバーを再起動する

```bash
docker-compose down && docker-compose build && docker-compose up -d && docker-compose logs -f
```

### APIサーバーだけリビルドしてリスタートする

```bash
docker-compose build api
docker-compose up --no-deps -d api
```

### データベースに仮のデータを投入する

`src/`

```bash
docker-compose exec api npm run seedDb
```

## トラブルシューティング

### Elasticsearch の実行に失敗する場合

Elasticsearch requires to change file owner when you want to run it on the docker.

https://techoverflow.net/2020/04/18/how-to-fix-elasticsearch-docker-accessdeniedexception-usr-share-elasticsearch-data-nodes/

```bash
sudo chown -R 1000:1000 es/esdata
```

## 開発者向け情報
### `schema.graphql` で利用可能なディレクティブの一覧

