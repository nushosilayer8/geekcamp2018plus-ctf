FROM node:11.5-alpine
WORKDIR /src
COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
ENTRYPOINT ["yarn", "start"]
