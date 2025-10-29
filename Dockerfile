FROM node:20.17.0-alpine AS base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN NODE_TLS_REJECT_UNAUTHORIZED=0 yarn graphql-codegen --config graphql.config.ts

RUN NODE_TLS_REJECT_UNAUTHORIZED=0 yarn build

EXPOSE 3000

CMD ["yarn", "start"]
