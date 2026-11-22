/**
 * UModelVerse 模型清单（聊天类）。
 *
 * 全量目录公开可查（无需鉴权）：
 *     GET https://api.modelverse.cn/v1/models
 * 137 个模型里含大量图像 / 视频 / TTS / embedding 型号，这里只内置
 * 「文本对话」类的主流型号；运行 `magpie provider models umodelverse`
 * 会从上游拉取全量目录。
 */
export const DEFAULT_BASE_URL = 'https://api.modelverse.cn/v1'

/** 备选接入域名（控制台「API 节点」文档）：可用 UMODELVERSE_BASE_URL 覆盖 */
export const ENDPOINTS = {
  cn: 'https://api.modelverse.cn/v1',        // 中国大陆统一接入（推荐）
  overseas: 'https://api.umodelverse.ai/v1', // 海外统一接入
}

/** 聊天类模型（context 为保守占位，magpie 拉取上游目录后会以真实值为准） */
export const MODELS = [
  // 智谱 GLM
  { id: 'glm-5.3-flash', name: 'GLM-5.3-Flash', vision: false, reasoning: true },
  { id: 'glm-5.3-flashx', name: 'GLM-5.3-FlashX', vision: false, reasoning: true },
  { id: 'glm-5.3', name: 'GLM-5.3 (满血)', vision: false, reasoning: true },
  // DeepSeek
  { id: 'deepseek-v4.1-flash', name: 'DeepSeek-V4.1-Flash', vision: false, reasoning: true },
  { id: 'deepseek-v4.1-flash-1017', name: 'DeepSeek-V4.1-Flash-1017', vision: false, reasoning: true },
  { id: 'deepseek-v4-pro-0813', name: 'DeepSeek-V4-Pro (满血)', vision: false, reasoning: true },
  { id: 'deepseek-v4-flash-vision-exp', name: 'DeepSeek-V4-Flash Vision', vision: true, reasoning: true },
  // Qwen
  { id: 'qwen3.8-flash', name: 'Qwen3.8-Flash', vision: true, reasoning: true },
  { id: 'qwen3.8-max', name: 'Qwen3.8-Max', vision: false, reasoning: true },
  { id: 'qwen3.8-omni-flash', name: 'Qwen3.8-Omni-Flash', vision: true, reasoning: true },
  { id: 'qwen3.7-flash', name: 'Qwen3.7-Flash', vision: false, reasoning: true },
  { id: 'qwen3.7-plus', name: 'Qwen3.7-Plus', vision: false, reasoning: true },
  { id: 'qwen3.7-max', name: 'Qwen3.7-Max', vision: false, reasoning: true },
  // Kimi (Moonshot)
  { id: 'kimi-k3.1-pro', name: 'Kimi K3.1 Pro', vision: false, reasoning: true },
  { id: 'kimi-k3.1-pro-highspeed', name: 'Kimi K3.1 Pro Highspeed', vision: false, reasoning: true },
  { id: 'kimi-k2.7-code', name: 'Kimi K2.7 Code', vision: false, reasoning: true },
  // MiniMax
  { id: 'minimax-m3.1-flash', name: 'MiniMax M3.1 Flash', vision: false, reasoning: true },
  { id: 'MiniMax-M3', name: 'MiniMax M3', vision: false, reasoning: true },
  { id: 'MiniMax-H3', name: 'MiniMax H3', vision: false, reasoning: true },
  // 小米 MiMo
  { id: 'mimo-v2.6-pro', name: 'MiMo v2.6 Pro', vision: false, reasoning: true },
  { id: 'mimo-v2.6-pro-ultraspeed', name: 'MiMo v2.6 Pro Ultraspeed', vision: false, reasoning: true },
  { id: 'mimo-v2.6-flash', name: 'MiMo v2.6 Flash', vision: false, reasoning: true },
  // 字节豆包
  { id: 'doubao-seed-2-1-pro-260628', name: 'Doubao Seed 2.1 Pro', vision: false, reasoning: true },
  { id: 'doubao-seed-2-1-turbo-260628', name: 'Doubao Seed 2.1 Turbo', vision: false, reasoning: true },
  { id: 'doubao-seed-2-1-lite-260628', name: 'Doubao Seed 2.1 Lite', vision: false, reasoning: true },
  { id: 'doubao-seed-evolving', name: 'Doubao Seed Evolving', vision: false, reasoning: true },
  // 蚂蚁百灵（蒸馏版）
  { id: 'LingDT-3.0-flash', name: 'LingDT 3.0 Flash (百灵)', vision: false, reasoning: true },
  // 腾讯 Hy4
  { id: 'hy4-flash', name: 'Hy4 Flash', vision: false, reasoning: true },
  { id: 'hy4', name: 'Hy4', vision: false, reasoning: true },
]

/** 保守占位（上游 /v1/models 未随目录声明窗口；以 magpie 拉取的真实目录为准） */
const CONTEXT = 131_072
const OUTPUT = 16_384

export function buildModels() {
  return Object.fromEntries(MODELS.map((m) => [m.id, {
    id: m.id,
    name: m.name,
    limit: { context: CONTEXT, input: CONTEXT, output: OUTPUT },
    reasoning: m.reasoning,
    tool_call: true,
    attachment: m.vision,
    modalities: { input: m.vision ? ['text', 'image'] : ['text'], output: ['text'] },
  }]))
}