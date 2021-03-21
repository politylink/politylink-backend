#!/bin/bash

set -ex

# https://www.elastic.co/guide/en/elasticsearch/reference/master/specify-analyzer.html#specify-analyzer
# https://tech-blog.rakus.co.jp/entry/20191002/elasticsearch


#curl -XPOST localhost:9200/minutes/_close
curl -H "Content-Type: application/json" -X PUT localhost:9200/minutes/ -d '
{
    "settings" : {
        "analysis":{
            "analyzer":{
                "default":{
                    "type":"custom",
                    "char_filter" : ["icu_normalizer", "kuromoji_iteration_mark"],
                    "tokenizer":"kuromoji_tokenizer",
                    "filter": ["kuromoji_baseform", "kuromoji_part_of_speech", "kuromoji_stemmer"]
                }
            }
        }
    }
}'
#curl -XPOST localhost:9200/minutes/_open
