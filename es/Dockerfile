FROM docker.elastic.co/elasticsearch/elasticsearch:7.8.0

# Install kuromoji
RUN elasticsearch-plugin install analysis-kuromoji

# Install Elasticsearch Analysis Kuromoji Neologd
RUN elasticsearch-plugin install -b org.codelibs:elasticsearch-analysis-kuromoji-neologd:8.2.0

# Insall analysis-icu
RUN elasticsearch-plugin install analysis-icu
