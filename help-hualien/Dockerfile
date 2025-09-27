# 使用 Node.js 官方鏡像
FROM node:22-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm@9.15.5

# 安裝依賴，但不會複製 node_modules 進去
RUN pnpm install --frozen-lockfile --shamefully-hoist

# 複製專案的其他檔案（.dockerignore 會確保 node_modules 和 .next 不會被複製）
COPY . .

# 設定 ARG
ARG API_URL

# 設定 ENV（這樣應用程式可以使用 process.env.API_URL）
ENV API_URL=${API_URL}

# 執行 build
RUN pnpm build

# 預設執行指令
CMD ["pnpm", "start"]