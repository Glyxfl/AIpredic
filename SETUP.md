# ZGSM-AI 项目设置指南

详细的安装和配置说明，帮助您快速部署 ZGSM-AI 项目。

## 📋 前置要求

- Node.js ≥ 20.0.0
- npm 或 pnpm
- PostgreSQL 数据库（推荐使用 Neon）
- AI 模型 API 密钥（至少一个）

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Glyxfl/AIpredic.git
cd ZGSM-AI
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填充以下变量：

```env
# ==================== 数据库配置 ====================
# 使用 Neon PostgreSQL
# 访问 https://neon.tech 创建免费数据库
DATABASE_URL="postgres://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# ==================== NextAuth 配置 ====================
# 生成密钥（Windows）：
# openssl rand -base64 32
NEXTAUTH_SECRET="your-generated-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# 生产环境部署后改为：
# NEXTAUTH_URL="https://your-domain.vercel.app"

# ==================== AI 模型配置 ====================
# 至少配置一个模型的 API 密钥

# OpenAI (GPT-4o)
# 访问 https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"

# Anthropic (Claude 3.5)
# 访问 https://console.anthropic.com/
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxx"

# YI 模型 (零一万物)
# 访问 https://platform.lingyiwanwu.com/
YI_API_KEY="your-yi-api-key"
```

### 4. 设置数据库

#### 4.1 初始化数据库

```bash
# 运行数据库迁移
npx prisma migrate dev --name init

# 生成 Prisma Client
npx prisma generate
```

#### 4.2 创建种子用户（可选）

```bash
# 这将创建一个测试用户
npx prisma db seed
```

测试账号信息：
- 邮箱：test@example.com
- 密码：password123

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 🗄️ 数据库配置详细说明

### 使用 Neon PostgreSQL（推荐）

1. 访问 [Neon](https://neon.tech)
2. 注册并创建新项目
3. 复制连接字符串到 `DATABASE_URL`
4. 确保连接字符串包含 `?sslmode=require`

### 使用本地 PostgreSQL

```bash
# 安装 PostgreSQL (Windows)
# 下载并安装：https://www.postgresql.org/download/windows/

# 创建数据库
createdb zgsm_ai

# 更新 .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/zgsm_ai"
```

## 🔐 用户管理

### 创建新用户（通过 Prisma Studio）

```bash
# 打开 Prisma Studio
npx prisma studio
```

然后：
1. 在浏览器中访问提供的 URL（通常是 http://localhost:5555）
2. 点击 "User" 模型
3. 点击 "Add record"
4. 填写邮箱和密码（密码会自动加密）

### 通过脚本创建用户

创建 `scripts/create-user.ts`：

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })
  
  console.log('✅ 用户创建成功:', user.email)
}

createUser('user@example.com', 'securepassword123')
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

运行：

```bash
npx ts-node scripts/create-user.ts
```

## 🤖 AI 模型配置

### OpenAI GPT-4o

```env
OPENAI_API_KEY="sk-..."
```

支持模型：
- `gpt-4o`
- `gpt-4-turbo`
- `gpt-3.5-turbo`

### Anthropic Claude 3.5

```env
ANTHROPIC_API_KEY="sk-ant-..."
```

支持模型：
- `claude-3-opus-20240229`
- `claude-3-5-sonnet-20241022`
- `claude-3-5-haiku`

### YI 模型

```env
YI_API_KEY="your-yi-api-key"
```

支持模型：
- `yi-34b-chat`
- `yi-large-turbo`

## 🚢 部署到 Vercel

### 1. 准备工作

确保代码已推送到 GitHub

### 2. 连接 Vercel

```bash
npm install -g vercel
vercel login
```

### 3. 部署

```bash
# 开发部署
vercel

# 生产部署
vercel --prod
```

### 4. 配置环境变量

在 Vercel Dashboard 中设置以下环境变量：
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (设为你的 Vercel 域名)
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `YI_API_KEY`

### 5. 配置数据库

如果使用 Neon：
1. 在 Neon Console 中找到 Vercel 集成选项
2. 点击 "Connect Vercel"
3. 自动配置连接

## 🔧 故障排除

### 问题：数据库连接失败

**错误信息**：`Can't reach database server`

**解决方案**：
1. 检查 `DATABASE_URL` 是否正确
2. 确保包含 `?sslmode=require`
3. 验证数据库是否在线
4. 检查防火墙设置

### 问题：NextAuth 认证失败

**错误信息**：`Invalid next.config.js options`

**解决方案**：
1. 确保 `NEXTAUTH_SECRET` 已设置
2. 检查 `NEXTAUTH_URL` 与当前域名匹配
3. 清除浏览器 cookies

### 问题：AI 模型响应错误

**错误信息**：`API key is invalid`

**解决方案**：
1. 验证 API Key 是否正确
2. 检查 API Key 是否有足够的配额
3. 确认 API Key 已启用相应模型
4. 查看对应提供商的状态页面

### 问题：流式响应中断

**错误信息**：Stream connection closed

**解决方案**：
1. 检查网络连接
2. 增加 Vercel 超时配置
3. 确保使用支持流式的模型

## 📊 监控和日志

### Vercel 日志

访问 Vercel Dashboard → Functions → 查看实时日志

### 数据库查询

```bash
# 使用 Prisma Studio
npx prisma studio

# 或使用 psql
psql $DATABASE_URL
```

## 🔒 安全建议

1. **永远不要提交 `.env` 文件到版本控制**
2. 使用强密码作为 `NEXTAUTH_SECRET`
3. 定期轮换 API 密钥
4. 在生产环境使用 HTTPS
5. 启用数据库连接加密
6. 限制 Prisma Studio 的访问

## 📚 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start                # 运行生产版本

# 数据库
npx prisma studio         # 打开数据库 GUI
npx prisma migrate dev    # 运行迁移
npx prisma db seed        # 添加种子数据
npx prisma db push       # 推送 schema 到数据库

# 代码检查
npm run lint             # 运行 ESLint

# 部署
vercel                   # 部署到 Vercel 开发环境
vercel --prod            # 部署到 Vercel 生产环境
```

## 🆘 获取帮助

- 查看 [README.md](./README.md) 了解项目信息
- 查看 Prisma 文档：https://www.prisma.io/docs
- 查看 Next.js 文档：https://nextjs.org/docs
- 查看 NextAuth.js 文档：https://authjs.dev

## 📝 更新日志

项目遵循 Conventional Commits 规范，提交信息格式：

```
feat(chat): 添加新模型支持
fix(auth): 修复登录超时问题
docs(readme): 更新部署说明
```

查看完整变更日志请参考项目 CHANGELOG.md