FROM node:18-bullseye-slim

ENV TZ=Asia/Tokyo \
    LANG=C.UTF-8

WORKDIR /tmp

RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NOWARNINGS=yes \
    && apt-get -qq update > /dev/null \
    && apt-get -qq --no-install-recommends --yes install \
        ca-certificates git less vim jq curl wget tar zip unzip file procps htop ncdu fish > /dev/null \
    && chsh --shell /usr/bin/fish

RUN npm install --silent --global aws-cdk@2.32.1

RUN curl --fail --silent --show-error --location https://deno.land/install.sh | sh > /dev/null 2>&1 \
    && ln --symbolic ~/.deno/bin/deno /usr/local/bin \
    && deno completions fish > /etc/fish/completions/deno.fish

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" --fail --silent --show-error --location --remote-name \
    && unzip -q "awscli-exe-linux-x86_64.zip" \
    && ./aws/install \
    && rm --force --recursive ./aws