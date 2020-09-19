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

Docker での実行時にマウントしているフォルダ `es/esdata` のオーナーを変更すると、エラーが発生せずに実行できる場合があります。


```bash
sudo chown -R 1000:1000 es/esdata
```

https://techoverflow.net/2020/04/18/how-to-fix-elasticsearch-docker-accessdeniedexception-usr-share-elasticsearch-data-nodes/

## 開発者向け情報

### `schema.graphql` で利用可能なディレクティブの一覧

graphql の定義では、 `@deprecated` のようなディレクティブを、フィールドに対して付けることができます。どういったディレクティブが `politylink-`

* graphql の default directive https://www.apollographql.com/docs/apollo-server/schema/directives/
* grandstack の提供する directive https://grandstack.io/docs/graphql-schema-directives/
* 上記全体でサポートしているのが何かを知りたい場合は下記の graphql query を実行する

```
{
  __schema{
    directives {
      name
      description
    }
  }
}
```

### Authentification の生成方法


