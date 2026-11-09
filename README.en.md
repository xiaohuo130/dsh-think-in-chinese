<div align="center">

<img src="docs/images/banner.png" width="100%" alt="dsh-think-in-chinese">

# 🧠 dsh-think-in-chinese

**Let the model do its internal "scratch work" in Chinese — the answer still follows your language.**

**English** · [简体中文](./README.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](./package.json)
[![DSH](https://img.shields.io/badge/DSH-0.1.x%20%7C%200.2.x-blue)](https://github.com/deepseek-ai/dsh)
[![Dependencies](https://img.shields.io/badge/runtime%20deps-0-success)](./package.json)

</div>

---

## The 30-second version

Before answering, a model "thinks it through" — that trace is called **reasoning**, it is usually several times longer than the final answer, and you pay for it in tokens.

This plugin does exactly one thing: **it makes that trace Chinese.**

| | Without it | With it |
| --- | --- | --- |
| The model's reasoning | mostly English | Chinese |
| The model's answer | your language | your language (**unchanged**) |
| Reasoning length | baseline | usually shorter in Chinese (**not guaranteed**) |
| Your bill | baseline | possibly lower, possibly higher |

> ⚠️ **Be clear about this up front**: it is a **reversible, A/B-testable experiment**, not a "install and save money" button.
> Models tuned for Chinese vocabularies may benefit; models tuned for English may get *more* expensive. Coding and math tasks may even lose accuracy.
> The plugin hands the decision to you — **measure it yourself.**

---

## What it actually does

It registers exactly one system-prompt section:

```js
ctx.effect(() => ctx.systemPrompt.section({ name, order, text }))
```

The injected text says, roughly: organise your internal reasoning in Simplified Chinese; keep code, identifiers, commands, paths, formulas and quoted text verbatim; answer in the user's language.

It registers **no tools**, listens to **no events**, makes **no network requests**, and mutates **no messages**. Unload it and everything reverts.

About 130 lines, no build step, **zero runtime dependencies**.

---

## Install

```sh
# Option 1: straight from GitHub
dsh plugin --profile web add github:xiaohuo130/dsh-think-in-chinese

# Option 2: local trial
git clone https://github.com/xiaohuo130/dsh-think-in-chinese
dsh plugin --profile web add ./dsh-think-in-chinese
```

> 📌 Bundles are assembled at **DSH startup** — restart DSH after installing.

The switch lives under **Settings → Plugins → Think in Chinese**.

---

## Configuration

Defaults ship in `cordis.patch.yml`:

```yaml
- insert:
    - id: think-in-chinese
      name: 'dsh-think-in-chinese'
      config:
        mode: zh      # zh | en | off
        order: 100    # position in the system prompt, lower comes first
        # text: 'custom full text; overrides the built-in section'
```

| Option | Values | Meaning |
| --- | --- | --- |
| `mode` | `zh` | Chinese reasoning (default) |
| | `en` | English reasoning, for A/B comparison |
| | `off` | Inject nothing (plugin stays installed, zero effect) |
| `order` | number | Position in the system prompt, default `100` |
| `text` | string | Custom section text, highest priority |

---

## How to measure whether it helps

This is the only part that matters. **Don't trust conclusions — run the comparison:**

1. **Pick a workload you actually run** — e.g. "read a function and find the bug", "explain this stack trace".
2. Prepare **20 comparable prompts** (don't mix task types).
3. With the same model, run two groups:
   - Group A: `mode: zh`
   - Group B: `mode: off`
4. Record two numbers:
   - **token usage** (reasoning + output tokens; use the token meter or session stats)
   - **one-shot success rate** (fixed/answered correctly on the first try)

**Decision rule**: keep it only if tokens drop **and** success rate does not.

Caveats:

- Per-turn variance is huge — **fewer than 10 samples is noise**.
- Public evaluations do **not** agree that Chinese reasoning is cheaper; trust your own numbers.
- Measure **coding tasks in their own group** — mixing them with chat averages hides opposite conclusions.

---

## Boundaries

- Changes *how it thinks*, not *how it answers*: the final answer follows the user's language.
- Code, identifiers, commands, paths, formulas and quoted text stay verbatim.
- **No cost guarantee**; results may invert across models and tasks.
- Adds roughly 100–150 tokens to the system prompt.

---

## Compatibility

| Item | Requirement |
| --- | --- |
| DSH | `systemPrompt` service (0.1.x / 0.2.x both work) |
| Node.js | ≥ 18 |
| Build step | none (pure ESM) |
| Runtime deps | none |
| Tests | `node test/smoke.mjs` (or `npm test`) — 4 smoke cases |

---

## Layout

```
.
├── index.js            # plugin entry, ~130 lines
├── cordis.patch.yml    # bundle patch: mode / order
├── locale/
│   ├── zh.json         # settings strings (Chinese)
│   └── en.json         # settings strings (English)
├── icon.svg            # settings icon
├── test/smoke.mjs      # 4 smoke cases
├── README.md
├── README.en.md
├── CHANGELOG.md
└── LICENSE
```

---

## License

[MIT](./LICENSE) © 2026 xiaohuo130

<div align="center">

If it's useful, a ⭐ helps. Counter-examples are welcome as issues — **the measurement matters more than the claim**.

</div>
