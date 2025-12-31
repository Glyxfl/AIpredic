# ZGSM-AI

智能运势算命助手 - 基于 Next.js 和多 AI 模型的对话应用

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + 自定义国风主题
- **认证**: NextAuth.js (Credentials + JWT)
- **数据库**: Neon PostgreSQL + Prisma ORM
- **AI 模型**: OpenAI GPT-4o, Anthropic Claude 3.5, YI-34B, Moonshot AI
- **状态管理**: SWR
- **UI 组件**: Radix UI + 自定义组件

## 项目结构

```
src/
├─ app/                    # Next.js App Router
│  ├─ api/                 # API 路由
│  ├─ login/               # 登录页
│  └─ chat/[[...slug]]/    # 主聊天页
├─ components/ui/          # 通用 UI 组件
├─ modules/
│  ├─ auth/               # 认证相关
│  ├─ chat/               # 聊天功能
│  ├─ history/            # 历史记录
│  └─ profile/            # 用户信息
├─ lib/                   # 工具库
│  ├─ prisma.ts           # 数据库客户端
│  ├─ openai.ts           # OpenAI 集成
│  ├─ claude.ts           # Claude 集成
│  ├─ yi.ts               # YI 模型集成
│  ├─ moonshot.ts         # Moonshot AI 集成
│  └─ constants.ts        # 常量配置
└─ styles/                # 样式文件
   ├─ globals.css         # 全局样式
   └─ fortune.css         # 国风主题
```

## 快速开始

### 环境要求

- Node.js ≥ 20
- pnpm 或 npm
- Neon PostgreSQL 数据库

### 安装

```bash
npm install
```

### 环境变量配置

复制 `.env.example` 到 `.env` 并配置以下变量：

```env
# 数据库连接
DATABASE_URL="postgres://user:password@host:port/database?sslmode=require"

# NextAuth 配置
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# AI 模型 API 密钥
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
YI_API_KEY="your-yi-api-key"
MOONSHOT_API_KEY="your-moonshot-api-key"
```

### 数据库迁移

```bash
npx prisma migrate dev --name init
```

### 创建种子用户

```bash
npx prisma db seed
```

（需要创建 `prisma/seed.ts` 文件）

### 运行项目

```bash
# 开发环境
npm run dev

# 构建生产版本
npm run build

# 启动生产版本
npm start
```

访问 http://localhost:3000 查看应用

## 部署

### Vercel 部署

```bash
vercel --prod
```

确保在 Vercel 项目设置中配置所有环境变量。

## 功能特性

- 🔐 安全的用户认证（Credentials + JWT）
- 💬 多 AI 模型支持（GPT-4o, Claude 3.5, YI-34B, Moonshot AI）
- 🎨 国风主题 UI 设计
- 📝 流式对话响应
- 📜 对话历史记录
- 🎯 运势算命专用接口
- 🌍 国内模型支持（Moonshot AI / Kimi）

## API 接口

### 认证
- `POST /api/auth/[...nextauth]` - NextAuth 认证

### 对话
- `POST /api/chat` - 发送对话消息（流式响应）
- `GET /api/chat?chatId=xxx` - 获取对话历史
- `GET /api/models` - 获取可用模型列表
- `GET /api/chats` - 获取用户对话列表

### 运势
- `POST /api/divination` - 运势计算接口

## 可维护性约定

- 所有模型配置集中在 `lib/constants.ts`
- 新增模型只需修改 constants.ts
- UI 组件保持 ≤ 200 行
- 业务逻辑 hooks 独立文件
- 提交信息遵循 Conventional Commits 规范

## 开发说明

### 添加新模型

在 `lib/constants.ts` 中添加新模型：

```typescript
export enum ModelType {
  NEW_MODEL = "new-model",
}

export const MODELS: ModelInfo[] = [
  // ... existing models
  { id: ModelType.NEW_MODEL, name: "New Model", badge: "Provider" },
]
```

### 样式开发

使用国风主题类：
- `.card-glow` - 渐变卡片
- `.btn-primary` - 主按钮
- `.text-gradient` - 渐变文字

## 许可证

ISC
