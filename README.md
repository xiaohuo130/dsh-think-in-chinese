<div align="center">

<img src="docs/images/banner.png" width="100%" alt="dsh-think-in-chinese">

# 🧠 dsh-think-in-chinese

**让 AI 在「心里打草稿」时用中文，回答仍然跟着你的语言走。**

[简体中文](./README.md) · [English](./README.en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](./package.json)
[![DSH](https://img.shields.io/badge/DSH-0.1.x%20%7C%200.2.x-blue)](https://github.com/deepseek-ai/dsh)
[![Dependencies](https://img.shields.io/badge/runtime%20deps-0-success)](./package.json)

</div>

---

## 30 秒看懂

AI 回答你之前，会先「在心里想一遍」——这段过程叫**推理（reasoning）**，通常比最终答案长好几倍，也按 token 计费。

这个插件做的事只有一件：**让那段「心里想的」用中文写**。

| | 没有它 | 有它 |
| --- | --- | --- |
| AI 的思考过程 | 多为英文 | 中文 |
| AI 的最终回答 | 中文 | 中文（**不变**） |
| 思考长度 | 较长 | 中文表达通常更短（**不保证**） |
| 你的账单 | 基准 | 可能更低，也可能更高 |

> ⚠️ **先说清楚**：这是一个「**可开关的实验**」，不是「装了就省钱」。
> 对中文词表优化得好的模型可能更省，对英文词表优化的模型反而更贵；写代码、做数学时中文思考还可能掉准确率。
> 所以它把选择权交给你——**自己去测**。

---

## 它到底做了什么

只往系统提示里插入一小段「推理语言」声明：

```js
ctx.effect(() => ctx.systemPrompt.section({ name, order, text }))
```

注入的内容大致是：

> 你要在内部推理时优先使用简体中文组织思考；代码、标识符、命令、文件路径、公式和引用原文保持原样；最终回答的语言跟随用户。

它**不注册工具、不监听事件、不联网、不改任何消息内容**，卸载即完全复原。

代码约 130 行，无构建步骤，**零运行时依赖**。

---

## 安装

```sh
# 方式一：直接从 GitHub 装
dsh plugin --profile web add github:xiaohuo130/dsh-think-in-chinese

# 方式二：本地试用
git clone https://github.com/xiaohuo130/dsh-think-in-chinese
dsh plugin --profile web add ./dsh-think-in-chinese
```

> 📌 插件在 **DSH 启动时**装配，装完要**重启 DSH** 才生效。

装好后可以在这里找到开关：**设置 → 插件 → 中文思考**。

---

## 配置

默认配置写在本仓库的 `cordis.patch.yml` 里：

```yaml
- insert:
    - id: think-in-chinese
      name: 'dsh-think-in-chinese'
      config:
        mode: zh      # zh | en | off
        order: 100    # 在系统提示里的位置，越小越靠前
        # text: '自定义整段文本，填了就覆盖内置文案'
```

| 配置项 | 可选值 | 说明 |
| --- | --- | --- |
| `mode` | `zh` | 中文推理（默认） |
| | `en` | 英文推理，用来做 A/B 对照 |
| | `off` | 不注入任何内容，插件还在但零影响 |
| `order` | 数字 | 系统提示中的排序位置，默认 `100` |
| `text` | 文本 | 自定义整段文本，优先级最高 |

---

## 怎么验证它值不值

这是这个插件唯一重要的部分。**别信结论，做对照实验**：

1. **挑一类你常做的任务**，比如「读一段代码找 bug」「解释一段报错」。
2. 准备 **20 个同类问题**（不要混类型）。
3. 同一模型下跑两组：
   - A 组：`mode: zh`
   - B 组：`mode: off`
4. 记录两个数：
   - **token 用量**（reasoning token + output token，看会话统计或 token 计量）
   - **一次成功率**（是否一次就改对 / 答对）

**判定标准**：只有「token 明显下降 **且** 成功率没有下降」才值得留着。

几个提醒：

- 单轮波动极大，**样本少于 10 轮没有参考价值**；
- 公开评测对「中文推理更省」并没有一致结论，以你自己的数据为准；
- **代码类任务单独分组**，别和聊天类混在一起平均，它们的结论经常相反。

---

## 边界

- 只改「怎么想」，不改「怎么答」：最终回答仍然跟随用户语言。
- 代码、标识符、命令、文件路径、公式、引用原文保持原样。
- **不保证省钱**；不同模型、不同任务上的结论可能相反。
- 会多占一点系统提示 token（约 100–150 token）。

---

## 兼容性

| 项目 | 要求 |
| --- | --- |
| DSH | 提供 `systemPrompt` 服务（0.1.x / 0.2.x 均可用） |
| Node.js | ≥ 18 |
| 构建 | 无（纯 ESM） |
| 运行时依赖 | 无 |
| 测试 | `node test/smoke.mjs`（或 `npm test`），4 个冒烟用例 |

---

## 目录结构

```
.
├── index.js            # 插件入口，约 130 行
├── cordis.patch.yml    # bundle 补丁：声明 mode / order
├── locale/
│   ├── zh.json         # 设置页文案（中文）
│   └── en.json         # 设置页文案（英文）
├── icon.svg            # 设置页图标
├── test/smoke.mjs      # 4 个冒烟用例
├── README.md
├── README.en.md
├── CHANGELOG.md
└── LICENSE
```

---

## 许可

[MIT](./LICENSE) © 2026 xiaohuo130

<div align="center">

觉得有用就点个 ⭐，测出反例也欢迎开 issue——**结论比结论者更有价值**。

</div>
