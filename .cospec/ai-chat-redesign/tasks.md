# AI对话模块重写任务清单

- [ ] 1. 创建SSE配置常量
  - 在constants.ts中新增SSE_TOKEN_ESCAPE_REGEX和SSE_LINE_END常量
  - 提供统一的转义正则和行结束符配置
  - _需求：[FR-002]_
  - _测试：[token转义功能可测试]

- [ ] 2. 更新Message类型定义
  - 在types.ts中为Message接口添加id字段
  - 确保类型定义与API响应格式一致
  - _需求：[FR-003], [FR-004]_

- [ ] 3. 实现Token转义功能
  - 在chat/route.ts中创建escapeToken函数
  - 使用JSON.stringify对特殊字符进行转义
  - 在token事件发送前应用转义
  - _需求：[FR-002]_
  - _测试：[SSE格式解析正常]

- [ ] 4. 实现消息保存逻辑
  - 修改chat/route.ts中的消息处理流程
  - 在SSE流结束后将完整助手消息保存到数据库
  - 确保用户消息在发送前入库
  - _需求：[FR-001]_
  - _测试：[助手消息完整入库]

- [ ] 5. 实现SSE消息ID返回
  - 在chat/route.ts的done事件中返回messageId
  - 在message事件中返回消息元数据包含id
  - 确保客户端能获取服务器生成的消息ID
  - _需求：[FR-003], [FR-004]_
  - _测试：[消息ID正确同步]

- [ ] 6. 更新ChatWindow状态管理
  - 修改ChatWindow.tsx添加消息ID状态
  - 实现SSE事件处理：解析message事件更新消息ID
  - 使用服务器消息ID替代临时ID
  - 移除重复的isTyping状态定义
  - _需求：[FR-003], [FR-004], [NFR-001]_
  - _测试：[消息状态一致]

- [ ] 7. 更新MessageBubble组件
  - 修改MessageBubble.tsx接收并使用消息ID作为key
  - 确保消息渲染稳定性
  - _需求：[FR-004]_
  - _测试：[重渲染时消息不抖动]