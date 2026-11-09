/**
 * Smoke tests for dsh-think-in-chinese.
 *
 * No test framework on purpose: the plugin has zero runtime dependencies,
 * so the test suite should not drag one in either. Run with `node test/smoke.mjs`.
 */
import assert from 'node:assert/strict'
import { apply, name } from '../index.js'

/** Minimal stand-in for the Cordis context the plugin touches. */
function createFakeContext() {
  const sections = []
  return {
    sections,
    effect(fn) {
      return fn()
    },
    systemPrompt: {
      section(section) {
        sections.push(section)
        return () => {
          const index = sections.indexOf(section)
          if (index !== -1) sections.splice(index, 1)
        }
      },
    },
  }
}

assert.equal(name, 'think-in-chinese', 'plugin name must stay stable')

// Default: Chinese, order 100.
{
  const ctx = createFakeContext()
  apply(ctx, {})
  assert.equal(ctx.sections.length, 1)
  assert.equal(ctx.sections[0].name, 'think-in-chinese')
  assert.equal(ctx.sections[0].order, 100)
  assert.match(ctx.sections[0].text, /中文/)
  assert.match(ctx.sections[0].text, /代码/)
}

// English mode with a custom order.
{
  const ctx = createFakeContext()
  apply(ctx, { mode: 'en', order: 5 })
  assert.equal(ctx.sections.length, 1)
  assert.equal(ctx.sections[0].order, 5)
  assert.match(ctx.sections[0].text, /English/)
}

// Off mode must register nothing at all.
{
  const ctx = createFakeContext()
  apply(ctx, { mode: 'off' })
  assert.equal(ctx.sections.length, 0)
}

// Custom text wins over the built-in sections.
{
  const ctx = createFakeContext()
  apply(ctx, { text: 'custom reasoning policy', order: 0 })
  assert.equal(ctx.sections.length, 1)
  assert.equal(ctx.sections[0].text, 'custom reasoning policy')
  assert.equal(ctx.sections[0].order, 0)
}

console.log('ok: 4 smoke cases passed')
