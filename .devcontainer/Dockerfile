FROM node:16-bullseye-slim

ENV TZ=Asia/Tokyo \
    LANG=C.UTF-8

RUN apt-get -qq update \
    && apt-get -qq --no-install-recommends --yes install \
        ca-certificates git less vim jq curl tar

RUN npm install -g aws-cdk@2.25.0