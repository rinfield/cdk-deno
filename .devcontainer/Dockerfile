FROM node:16-bullseye-slim

ENV TZ=Asia/Tokyo \
    LANG=C.UTF-8

RUN apt-get -qq update \
    && apt-get -qq --no-install-recommends --yes install \
        ca-certificates git less vim jq curl tar zip unzip

RUN npm install -g aws-cdk@2.26.0

RUN curl -fsSL https://deno.land/install.sh | sh \
    && ln -s ~/.deno/bin/deno /usr/bin