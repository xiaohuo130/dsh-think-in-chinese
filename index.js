/**
 * dsh-think-in-chinese
 *
 * Adds one system-prompt section that nudges the model to organise its
 * internal reasoning in Chinese. It does not touch the answer language and
 * does not translate code, identifiers, formulas or quoted text.
 *
 * Why this exists: CJK-optimised tokenizers (DeepSeek / Qwen / GLM families)
 * spend fewer tokens on the same idea in Chinese, so reasoning-heavy turns can
 * get cheaper. On models whose tokenizer is English-centric the same prompt can
 * cost MORE, and some benchmarks report a lower success rate for Chinese
 * prompting on coding tasks. Measure before keeping it on.
 */

export const name = 'think-in-chinese'

// systemPrompt must be available before apply() runs.
export const inject = ['systemPrompt']

const CHINESE_SECTION = [
  '## 推理语言（可关闭的省钱实验）',
  '',
  '在你的内部思考（reasoning）中，优先用中文组织推理，尽量压缩措辞但不要省略必要的推导步骤。',
  '',
  '边界：',
  '- 只改变「怎么想」，不改变「怎么答」：最终回答仍用用户的语言。',
  '- 代码、标识符、命令、文件路径、公式、引用原文保持原样，不要翻译。',
  '- 不要为了短而跳过校验步骤；若压缩会导致错误风险，宁可写长。',
].join('\n')

const ENGLISH_SECTION = [
  '## Reasoning language (opt-in cost experiment)',
  '',
  'Organise your internal reasoning in English, keeping it concise without omitting necessary steps.',
  '',
  'Boundaries:',
  '- This changes how you think, not how you answer: reply in the user\'s language.',
  '- Keep code, identifiers, commands, paths, formulas and quoted text verbatim.',
  '- Never skip a verification step just to be shorter.',
].join('\n')

/**
 * @param {import('cordis').Context} ctx
 * @param {{ mode?: 'zh' | 'en' | 'off', order?: number, text?: string }} [config]
 */
export function apply(ctx, config = {}) {
  const mode = config.mode ?? 'zh'
  if (mode === 'off') return

  const text = typeof config.text === 'string' && config.text.length > 0
    ? config.text
    : mode === 'en'
      ? ENGLISH_SECTION
      : CHINESE_SECTION

  const order = Number.isFinite(config.order) ? config.order : 100

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'think-in-chinese',
    order,
    text,
  }))
}
