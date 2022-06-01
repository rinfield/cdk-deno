FROM node:16-bullseye-slim

ENV TZ=Asia/Tokyo \
    LANG=C.UTF-8

WORKDIR /tmp

RUN apt-get -qq update \
    && apt-get -qq --no-install-recommends --yes install \
        ca-certificates git less vim jq curl tar zip unzip file procps htop ncdu

RUN npm install --global aws-cdk@2.26.0

RUN curl --fail --silent --show-error --location https://deno.land/install.sh | sh \
    && ln --symbolic ~/.deno/bin/deno /usr/local/bin

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" --fail --silent --show-error --location --remote-name \
    && unzip -q "awscli-exe-linux-x86_64.zip" \
    && ./aws/install \
    && rm --force --recursive ./aws