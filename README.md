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


## トラブルシューティング

### Elasticsearch の実行に失敗する場合

Docker での実行時にマウントしているフォルダ `es/esdata` のオーナーを変更すると、エラーが発生せずに実行できる場合があります。


```bash
sudo chown -R 1000:1000 es/esdata
```

https://techoverflow.net/2020/04/18/how-to-fix-elasticsearch-docker-accessdeniedexception-usr-share-elasticsearch-data-nodes/

## 開発者向け情報

### `schema.graphql` で利用可能なディレクティブの一覧

graphql の定義では、 `@deprecated` のようなディレクティブを、フィールドに対して付けることができます。 `politylink-backend` で利用できるディレクティブの一覧は、以下の通りです。

* graphql の default directive https://www.apollographql.com/docs/apollo-server/schema/directives/
* grandstack の提供する directive https://grandstack.io/docs/graphql-schema-directives/
* 上記全体でサポートしている全ての directive を知りたい場合は、下記の graphql query を実行する。

```graphql
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

GraphQL サーバは、外部から勝手にデータを更新されてしまうことを防ぐために、Mutation を発行する際には、HTTP リクエストのヘッダに認証キーを設定することを要求しています。

リクエストヘッダーに、認証キーが含まれている場合のみです、 Mutation によってデータを更新することができます。

この認証キーは、サーバが持っている秘密鍵を用いて暗号化されています。予めサーバ側で、許可するリクエストを含めた認証キーを設定しておく必要があり、 `politylink-backend` では `api/.env` の JWT_SECRET に記載しています。

HTTP リクエストが届いた際、ここに記載されている鍵を用いて暗号化されているかを検証し、またデコードして、そのヘッダで許可されているGraphQL の操作のみが実行できるように制御しています。

```api/.env
#GRAPHQL_TOKEN=
#JWT_SECRET=
```

そのため、`politylink-backend` を起動するためにまず、 `JWT_SECRET` に認証キーを登録する必要があります。次に、具体的にヘッダーに与える認証文字列を生成します。

1. ランダムな文字列を用いて、JWT_SECRET を決める。
2. https://jwt.io/ にアクセスし、 VERIFY SIGNATURE のところに、JWT_SECRET を記載する。
3. PAYLOAD に、この認証キーを持つリクエストが許可したい Mutation の一覧を記述する。
4. これによって生成されたトークン文字列を、`GRAPHQL_TOKEN` に指定する。このトークンは、 `データベースに仮のデータを投入する` で必要となる。

* PAYLOADに記述する文字列の例

Read-onlyの場合

```json
{
  "scopes": ["Read"]
}
```

あらゆる Mutation を認める場合

```json
{
  "scopes": ["Merge", "Update", "Insert", "Read", "Delete", "Create"]
}
```

このとき、 GraphQL Playground で直接 Mutation を発行したい場合は、 HTTP Header に

```json
{
  "Authorization": "Bearer <GRAPHQL_TOKEN>"
}
```

を指定すると、 ヘッダファイルで許可している Mutation が Playground 上で発行できるようになります。


### データベースに仮のデータを投入する

`api/src/seed` に、GraphQL サーバが正常に動作しているか確認するためのモックデータが定義されています。
このデータをバックエンドのデータベースにロードするためには、`api/.env` に環境変数を設定した上で下記のコマンドを実行します。

```bash
docker-compose exec api npm run seedDb
```
