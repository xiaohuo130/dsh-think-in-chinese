# dsh-think-in-chinese

[简体中文](./README.md) · **English**

> A tiny host plugin for [DeepSeek Harness](https://github.com/deepseek-ai/dsh) that injects a configurable "reasoning language" section into the system prompt, nudging the model to organise its **internal reasoning** in Chinese while keeping the final answer in the user's language.

Positioning: **this is not a "sinicisation" of the model — it is a reversible, A/B-testable cost experiment.**

## Why

Many Chinese-first models (DeepSeek / Qwen / GLM families) are more token-efficient in Chinese: the same idea usually takes fewer tokens. Since reasoning traces are long, "thinking in Chinese" looks like a cheap win.

But the claim does **not** hold universally:

- On English-centric tokenisers, Chinese reasoning can cost *more*.
- On coding, math and retrieval tasks, Chinese reasoning may reduce accuracy.
- The prompt section itself costs tokens.

So the plugin does one thing: makes the reasoning language **configurable**, so you can measure it on your own workload.

## What it does

It registers exactly one system-prompt section:

```js
ctx.effect(() => ctx.systemPrompt.section({ name, order, text }))
```

- registers no tools
- listens to no events
- makes no network requests
- mutates no messages
- fully reverts on unload

About 130 lines, no build step, zero runtime dependencies.

## Install

### From GitHub

```sh
dsh plugin --profile web add github:xiaohuo130/dsh-think-in-chinese
```

### Local development

```sh
git clone https://github.com/xiaohuo130/dsh-think-in-chinese
dsh plugin --profile web add ./dsh-think-in-chinese
```

Bundles are assembled at **startup**, so restart DSH after installing.

## Configuration

The default lives in `cordis.patch.yml`:

```yaml
- insert:
    - id: think-in-chinese
      name: 'dsh-think-in-chinese'
      config:
        mode: zh      # zh | en | off
        order: 100    # position in the system prompt, lower comes first
        # text: 'custom full text; overrides the built-in section'
```

| Option | Meaning |
| --- | --- |
| `mode: zh` | Chinese reasoning (default) |
| `mode: en` | English reasoning, for A/B comparison |
| `mode: off` | Inject nothing (plugin stays installed, zero effect) |
| `order` | Position in the system prompt, default `100` |
| `text` | Custom section text, highest priority |

You can also disable the plugin from **Settings → Plugins → Think in Chinese**.

## How to measure whether it helps

1. Pick a workload you actually run (e.g. "read a function and find the bug"), prepare 20 comparable prompts.
2. With the same model, run 20 with `zh` and 20 with `off`, and record:
   - reasoning / output tokens (token meter or session stats)
   - success rate (fixed in one shot or not)
3. Keep it only if tokens drop **and** success rate does not.

Caveats:

- Per-turn variance is large; fewer than 10 samples is noise.
- Public evaluations do **not** agree that Chinese reasoning is cheaper; trust your own numbers.
- Measure coding tasks separately from chat tasks.

## Boundaries

- Changes *how it thinks*, not *how it answers*: the final answer follows the user's language.
- Code, identifiers, commands, paths, formulas and quoted text stay verbatim.
- No cost guarantee; results may invert across models and tasks.
- Adds roughly 100–150 tokens to the system prompt.

## Compatibility

- Requires the DSH `systemPrompt` service (0.1.x / 0.2.x).
- Pure ESM, no build output, no runtime dependencies.
- Tests: `node test/smoke.mjs` (or `npm test`).

## License

[MIT](./LICENSE) © 2026 xiaohuo130
