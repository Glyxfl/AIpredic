import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建种子数据...')

  // 创建测试用户
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
    },
  })

  console.log('✅ 创建测试用户:', user.email)

  // 可选：创建示例对话
  const chat = await prisma.chat.create({
    data: {
      userId: user.id,
      title: '今日运势询问',
      messages: [
        {
          role: 'system',
          content:
            '你是一位精通周易、八字、紫微斗数的中国算命先生。  请用简洁、温暖、不迷信的语言回答用户运势问题。  禁止涉及政治、医疗、法律建议。  回答总字数 ≤ 280 字。',
        },
        {
          role: 'user',
          content: '我最近工作上不太顺利，能帮我看看运势吗？',
        },
        {
          role: 'assistant',
          content:
            '根据你的描述，近期工作运势略有波折，但这正是转机的开始。本季度宜稳中求进，避免冲动决策。建议多与同事沟通，保持良好人际关系。下个月中旬会有新的合作机会出现，届时可积极把握。记住，运势只是参考，努力才是改变命运的关键。',
        },
      ],
      model: 'gpt-4o',
    },
  })

  console.log('✅ 创建示例对话:', chat.title)

  console.log('种子数据创建完成！')
}

main()
  .catch((e) => {
    console.error('种子数据创建失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })