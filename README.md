## 起動方法

```bash
docker-compose build
docker-compose up -d
```

以下のサービスが起動する。
* Neo4j: 7474, 7687 (ホスト側ポートは動的に決定される)
* GraphQL API: 4000
* Elasticsearch: 9200, 9100（管理ツール）
* Https-portal: 80, 443

### 上記の4つのサービスを全てリビルドして、再起動する場合

```bash
docker-compose down && docker-compose build && docker-compose up -d && docker-compose logs -f
```

### GraphQLサーバーだけリビルドして、再起動する場合

たとえばGraphQLのschemaを書き換えた際には、Docker コンテナを作り直す必要があります。その際、以下のコマンドを実行すると便利です。

```bash
docker-compose build api && docker-compose up --no-deps -d api
```

## トラブルシューティング

### Elasticsearch の実行に失敗した場合

Dockerでの実行時にマウントしているフォルダ `es/esdata` のオーナーを変更すると、
エラーが発生せずに実行できる場合があります（[参考](https://techoverflow.net/2020/04/18/how-to-fix-elasticsearch-docker-accessdeniedexception-usr-share-elasticsearch-data-nodes/)）。

```bash
sudo chown -R 1000:1000 es/esdata
```

## 開発者向け情報

### GraphQL Schemaで利用可能なディレクティブ

`./api/src/schema.graphql`にて定義されているGraphQL schemaでは、`@deprecated`や`@relation`といったディレクティブを使うことができます。 
ここで利用できるディレクティブは、以下の2種類です。

1. GraphQLのデフォルトの[directives](https://www.apollographql.com/docs/apollo-server/schema/directives/)
2. GRANDstack固有の[directives](https://grandstack.io/docs/graphql-schema-directives/)

下記のGraphQLクエリを[GraphQL Playground](https://graphql.politylink.jp/)から実行すれば、使用可能なディレクティブの一覧を取得できます。

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

### GraphQLの認証の仕組み

politylink-backendのGraphQLサーバは、外部から勝手にデータを更新されてしまうことを防ぐために、
Mutationを発行する際に、HTTPリクエストのヘッダに認証キーを設定することを要求しています。

例えば[GraphQL Playground](https://graphql.politylink.jp/)からMutationを発行する場合は、画面左下のHTTP HEADERSのセクションにて
```json
{
  "Authorization": "$GRAPHQL_TOKEN"
}
```
を指定する必要があります。

この認証キーは、GraphQLサーバ上にある秘密鍵（`JWT_SECRET`）を使って生成された[JSON Web Tokens](https://jwt.io/)であり、以下の手順で生成できます。

1. `JWT_SECRET`を決め、`api/.env`の`JWT_SECRET`に設定し、コンテナをリビルドする。
2. https://jwt.io/ にアクセスし、VERIFY SIGNATUREのところに、`JWT_SECRET`を入力する。
3. PAYLOAD に、この認証キーに許可するMutationの一覧を記述する。例えば、あらゆるMutationを認める場合、以下のようになる。
```json
{
  "scopes": ["Read", "Merge", "Update", "Insert", "Delete", "Create"]
}
```
4. （オプショナル）生成した認証キーを`api/.env`の`GRAPHQL_TOKEN`に設定し、コンテナをリビルドする。このステップはseedデータをGraphQLに登録する時に必要。

GraphQLサーバーは、HTTPヘッダから認証キーを取得した際に、`api/.env`に記載されている`JWT_SECRET`を用いてデコードし、
その認証キーに許可されているGraphQLの操作のみが実行できるように制御しています。

### GraphQLに仮のデータを保存する

`api/src/seed` に、GraphQLサーバが正常に動作しているか確認するためのモックデータが定義されています。
このデータをバックエンドのデータベースにロードするためには、`api/.env` に環境変数（`JWT_SECRET`と`GRAPHQL_TOKEN`）を設定した上で
下記のコマンドを実行します。

```bash
docker-compose exec api npm run seedDb
```
なお、[politylink-crawler](https://github.com/politylink/politylink-crawler)を使えば
クローラーから取得した実データをGraphQLに保存することも可能です。
