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

GraphQL サーバは、外部から勝手にデータを更新されてしまうことを防ぐために、Mutation を発行する際には、HTTP リクエストのヘッダに認証キーを設定することを要求しています。
この認証キーは、サーバが持っている秘密鍵を用いて暗号化されています。予めサーバ側で、許可するリクエストを含めた認証キーを設定しておいて、
HTTP リクエストが届いた際、サーバーは、`api/.env` の JWT_SECRET に記載されている鍵を用いて暗号化されているかを検証すること、またデコードして、そのヘッダで許可されている
GraphQL の

```api/.env
#GRAPHQL_TOKEN=
#JWT_SECRET=
```

そのためまず、 `JWT_SECRET` に承認キーを登録する必要があります。次に、具体的にヘッダーにどのような文字列を与えればよいかを作ります。

1. ランダムな文字列を用いて、JWT_SECRET を決める。
2. https://jwt.io/ にアクセスし、 VERIFY SIGNATURE のところに、JWT_SECRET を記載する。
3. PAYLOAD に、この認証キーを持つリクエストが許可したい Mutation の一覧を記述する。例えば、

Read-onlyの場合

```json
{
  "scopes": ["Read"]
}
```

あらゆるMutationを認める場合

```json
{
  "scopes": ["Merge", "Update", "Insert", "Read", "Delete", "Create"]
}
```

4. これによって生成された文字列を、`GRAPHQL_TOKEN` に指定すると、`データベースに仮のデータを投入する` がうまく動くようになる。

たとえば、 GraphQL Playground でこれを使う場合は、 H
