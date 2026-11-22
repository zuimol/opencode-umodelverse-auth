/**
 * UCloud UModelVerse（星图 · 模型服务平台）的 magpie / OpenCode v1 供应商插件。
 *
 * 平台：https://astraflow.ucloud.cn
 * 文档：https://astraflow.ucloud.cn/docs/modelverse/…（快速开始 → API 节点）
 * 端点：https://api.modelverse.cn/v1 （中国大陆统一接入，OpenAI 兼容）
 *       支持 /v1/chat/completions、/v1/responses、/v1/models
 * 鉴权：Authorization: Bearer <API Key>
 *
 * ## 它做什么
 *
 *   1. `config` 钩子声明供应商 `umodelverse` 与聊天类模型清单；
 *   2. `auth.methods` 提供标准 API Key 录入（/v1/models 公开只读，
 *      authorize 用它确认端点可达；key 的有效性由首次真实调用确认，
 *      也可 `magpie provider test umodelverse` 手动验证）；
 *   3. `auth.loader` 把 key 交给 magpie，按 @ai-sdk/openai-compatible
 *      发 `Authorization: Bearer <key>`。
 *
 * ## 接入节点
 *
 * 默认用中国大陆统一接入域名；海外用户把 UMODELVERSE_BASE_URL 设为
 * 海外统一域名，或在 magpie 里改 baseUrl 选项即可。
 */
import { buildModels, DEFAULT_BASE_URL, ENDPOINTS } from './models.mjs'

export const PROVIDER = 'umodelverse'

export default async function UModelVersePlugin(input = {}) {
  const opts = input?.magpie?.options ?? input?.magpie?.option ?? {}
  const baseUrl = String(
    opts.baseUrl ??
    opts.baseURL ??
    globalThis.process?.env?.UMODELVERSE_BASE_URL ??
    DEFAULT_BASE_URL,
  ).replace(/\/+$/, '')

  return {
    // ------------------------------------------------------------ 供应商与模型
    config: async (cfg) => {
      cfg.provider ??= {}
      cfg.provider[PROVIDER] ??= {
        name: '星图 UModelVerse',
        npm: '@ai-sdk/openai-compatible', // chat completions
        api: baseUrl,
        models: buildModels(),
      }
    },

    // ---------------------------------------------------------------- 登录
    auth: {
      provider: PROVIDER,
      maxConcurrency: 8,

      methods: [
        {
          type: 'api',
          label: 'API Key（UCloud UModelVerse）',
          placeholder: '粘贴控制台里的 API 密钥',
        prompts: [
        { type: 'text', key: 'apiKey', message: '粘贴 UModelVerse API Key（astraflow.ucloud.cn → 认证鉴权）', placeholder: '粘贴控制台里的 API 密钥', required: true },
      ],
        async authorize(inputs) {
            const key =
              typeof inputs === 'string'
                ? inputs.trim()
                : String(inputs?.key ?? inputs?.apiKey ?? '').trim()
            if (key.length === 0) {
              return { type: 'failed', error: '需要粘贴 UModelVerse API Key（astraflow.ucloud.cn → 认证鉴权）' }
            }

            // /v1/models 公开只读：确认端点可达与插件网络环境正常。
            // key 本身的校验不在这里做（上游对公开端点不区分 key），
            // 首次真实调用即验证；也可运行 magpie provider test umodelverse。
            try {
              const res = await fetch(`${baseUrl}/models`, {
                headers: { Authorization: `Bearer ${key}` },
                signal: AbortSignal.timeout(15_000),
              })
              if (res.ok) {
                let count
                try {
                  const body = await res.json()
                  count = Array.isArray(body?.data) ? body.data.length : undefined
                } catch { /* 保留成功结果即可 */ }
                return {
                  type: 'success',
                  key,
                  metadata: {
                    accountName: 'UModelVerse API Key',
                    models: count,
                    baseUrl,
                  },
                }
              }
              const bodyText = await res.text().catch(() => '')
              return { type: 'failed', error: `上游返回 HTTP ${res.status}：${bodyText.slice(0, 200)}` }
            } catch (error) {
              return { type: 'failed', error: `网络错误：${error?.message ?? error}` }
            }
          },
        },
      ],

      /** 每个账号的请求参数：OpenAI 兼容，Bearer 即可 */
      async loader(getAuth) {
        const auth = await getAuth()
        const key = typeof auth?.key === 'string' ? auth.key : ''
        if (key.length === 0) {
          const error = new Error('UModelVerse：未登录（缺少 API Key）')
          error.signIn = 'required'
          throw error
        }
        return { baseURL: baseUrl, apiKey: key }
      },
    },
  }
}