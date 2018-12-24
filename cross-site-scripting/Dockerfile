FROM node:11.5-alpine
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN mkdir -p /var/lib/xss
ENTRYPOINT ["yarn", "start"]
