# 花蓮災後救助GPS系統 (Hualien Help GPS)

一個專為花蓮災後救助設計的GPS定位回報系統，讓受災戶能夠快速回報災害狀況，志工能有效管理和回應救助需求。

## 🎯 專案簡介

本系統包含兩個主要部分：
- **前端 (help-hualien)**: Next.js + React + TailwindCSS，提供用戶界面
- **後端 (help-hualien-api)**: NestJS + TypeORM + PostgreSQL，處理API和數據管理

## ✨ 主要功能

- **🔐 使用者認證**: Firebase Auth 整合 Google 登入
- **📍 GPS定位回報**: 自動獲取用戶位置，精確記錄有需求的地點
- **📝 災害回報**: 受災戶可快速填寫災害詳情和聯絡資訊
- **📋 案件管理**: 志工可查看所有回報案件並更新處理狀態
- **📊 狀態追蹤**: 即時追蹤案件處理進度
- **📱 響應式設計**: 支援各種裝置大小

## 🛠 技術架構

### 前端技術
- **框架**: Next.js 15.5.4 (App Router)
- **UI框架**: React 19.1.0
- **樣式**: TailwindCSS 4
- **認證**: Firebase Auth
- **語言**: TypeScript

### 後端技術
- **框架**: NestJS 11
- **資料庫**: PostgreSQL 16 + TypeORM 0.3.27
- **認證**: Firebase Admin SDK
- **API文檔**: Swagger
- **語言**: TypeScript

### 基礎設施
- **容器化**: Docker + Docker Compose
- **資料庫**: PostgreSQL

## 📦 安裝說明

### 前置需求
- Node.js >= 18
- Docker & Docker Compose
- Firebase 專案設定

### 1. 複製專案
```bash
git clone https://github.com/your-username/hualien-help-gps.git
cd hualien-help-gps
```

### 2. 環境設定
複製環境變數範本：
```bash
cp env-example .env
```

編輯 `.env` 檔案並填入必要的環境變數：
```env
PORT=3000
API_URL=http://localhost:3001

# 資料庫設定
DB_HOST=postgres
DB_PORT=5432
DB_NAME=help_hualien
DB_USER=postgres
DB_PASSWORD=your_password

# Firebase 設定
TYPE=service_account
PROJECT_ID=your_firebase_project_id
PRIVATE_KEY_ID=your_private_key_id
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
CLIENT_ID=your_client_id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxx%40your-project.iam.gserviceaccount.com

# 其他設定
NODE_ENV=development
VOLUME_PATH=./data
```

### 3. 使用 Docker 啟動
```bash
docker-compose up -d
```

### 4. 本地開發模式

#### 後端開發
```bash
cd help-hualien-api
npm install
npm run start:dev
```

#### 前端開發
```bash
cd help-hualien
npm install
npm run dev
```

## 🚀 使用方式

1. **用戶註冊/登入**: 使用 Google 帳號登入系統
2. **完善個人資料**: 首次登入需要填寫聯絡資訊
3. **回報災害**: 點擊「受災戶回報」填寫需求詳情
4. **查看案件**: 志工可透過「回報單列表」查看所有案件
5. **更新狀態**: 志工可在「案件狀態」頁面更新處理進度

## 📋 API 文檔

啟動後端後，可透過以下網址查看 Swagger API 文檔：
```
http://localhost:3001/api
```

## 🗂 專案結構

```
hualien-help-gps/
├── help-hualien/                 # 前端應用
│   ├── src/
│   │   ├── app/                 # Next.js App Router 頁面
│   │   └── contexts/            # React Context
│   ├── package.json
│   └── ...
├── help-hualien-api/            # 後端應用
│   ├── src/
│   │   ├── auth/               # 認證模組
│   │   ├── report/             # 回報管理模組
│   │   ├── user/               # 用戶管理模組
│   │   └── ...
│   ├── package.json
│   └── ...
├── docker-compose.yaml          # Docker 配置
├── .env                        # 環境變數 (需自行建立)
└── README.md
```

## 🧪 測試

### 後端測試
```bash
cd help-hualien-api
npm run test          # 單元測試
npm run test:e2e       # 整合測試
npm run test:cov       # 測試覆蓋率
```

### 前端測試
```bash
cd help-hualien
npm run lint          # 程式碼檢查
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來幫助改進這個專案。

## 📞 聯絡資訊

如有任何問題或建議，請聯繫開發團隊。

---

**⚠️ 重要提醒**: 本系統目前為測試階段，正式上線前所有測試資料將會清空重置。