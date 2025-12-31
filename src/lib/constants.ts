export enum ModelType {
  GPT_4O = "gpt-4o",
  CLAUDE_35 = "claude-3.5",
  YI_34B = "yi-34b",
  MOONSHOT_V1 = "moonshot-v1",
}

export interface ModelInfo {
  id: string
  name: string
  badge: string
}

export const MODELS: ModelInfo[] = [
  { id: ModelType.GPT_4O, name: "GPT-4o", badge: "OpenAI" },
  { id: ModelType.CLAUDE_35, name: "Claude 3.5", badge: "Anthropic" },
  { id: ModelType.YI_34B, name: "YI-34B", badge: "01.AI" },
  { id: ModelType.MOONSHOT_V1, name: "Moonshot V1", badge: "Kimi" },
]

export const FORTUNE_SYSTEM_PROMPT = `
你是一位精通周易、八字、紫微斗数的中国算命先生。  
请用简洁、温暖、不迷信的语言回答用户运势问题。  
禁止涉及政治、医疗、法律建议。  
回答总字数 ≤ 280 字。
`;

export const DEFAULT_MODEL = ModelType.GPT_4O