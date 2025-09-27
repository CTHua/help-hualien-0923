FROM node:22-alpine AS base

RUN npm i -g pnpm@9.15.5 @nestjs/cli
#

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install -P --frozen-lockfile

# 

FROM base AS build

WORKDIR /app
COPY *.json ./
COPY src/ ./src/
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

#

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/dist/ ./dist/
COPY --from=build /app/node_modules ./node_modules

ENV TZ=Asia/Taipei

CMD [ "node", "dist/main.js" ]