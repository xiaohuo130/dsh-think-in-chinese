# dsh-think-in-chinese

[简体中文](./README.md) · [English](./README.en.md)

---

# dsh-think-in-chinese

> 给 [DeepSeek Harness](https://github.com/deepseek-ai/dsh) 的一个极小 Host 插件：往系统提示里插一段「推理语言」声明，让模型在**内部思考**时优先用中文组织推理，最终回答的语言不变。

一句话定位：**这不是「中文化」改造，而是一个可开、可关、可 A/B 对照的省钱实验。**

## 为什么会有它

很多中文模型（DeepSeek / Qwen / GLM 系）的中文词表更高效：同一个意思用中文写出来往往更短。推理过程又特别长，于是「用中文想」看起来能省 token。

但这个结论**不保证成立**：

- 对英文词表优化的模型，改用中文反而更贵；
- 编码、数学、检索类任务上，中文推理可能降低准确率；
- 系统提示本身也要占 token，声明越长越亏。

所以这个插件只做一件事：把「推理语言」变成一个**可配置项**，让你自己在真实任务上测。

## 它做了什么

只注册一个 system-prompt section：

```js
ctx.effect(() => ctx.systemPrompt.section({ name, order, text }))
```

- 不注册工具
- 不监听事件
- 不发起网络请求
- 不修改任何消息内容
- 卸载即完全复原

全文约 130 行，无构建步骤，零运行时依赖。

## 安装

### 从 GitHub 安装

```sh
dsh plugin --profile web add github:xiaohuo130/dsh-think-in-chinese
```

### 本地开发 / 试用

```sh
git clone https://github.com/xiaohuo130/dsh-think-in-chinese
dsh plugin --profile web add ./dsh-think-in-chinese
```

bundle 在**启动时**装配，装完需要重启 DSH。

## 配置

默认配置写在 `cordis.patch.yml`：

```yaml
- insert:
    - id: think-in-chinese
      name: 'dsh-think-in-chinese'
      config:
        mode: zh      # zh | en | off
        order: 100    # 系统提示中的排序位置，数值越小越靠前
        # text: '自定义整段文本，填了就覆盖内置文案'
```

| 配置 | 说明 |
| --- | --- |
| `mode: zh` | 中文推理（默认） |
| `mode: en` | 英文推理，用于 A/B 对照 |
| `mode: off` | 不注入，插件仍在但零影响 |
| `order` | 系统提示中的排序位置，默认 `100` |
| `text` | 自定义整段文本，优先级最高 |

也可以在 **设置 → 插件 → 中文思考** 里直接停用（最彻底）。

## 怎么验证它值不值

1. 选一类你常做的任务（例如「读一段代码找 bug」），准备 20 个同类问题。
2. 同一模型下，`zh` 跑 20 次、`off` 跑 20 次，记录：
   - reasoning token / output token（看 token-meter 或会话统计）
   - 任务成功率（是否一次改对）
3. 只有「token 明显下降 **且** 成功率不降」才值得留下。

注意：

- 单轮波动很大，样本少于 10 轮没有参考价值；
- 公开评测对「中文推理更省」并没有一致结论，请以你自己的数据为准；
- 编码类任务建议单独分一组看，别和聊天类混在一起平均。

## 边界

- 只改「怎么想」，不改「怎么答」：最终回答仍跟随用户语言。
- 代码、标识符、命令、文件路径、公式、引用原文保持原样。
- 不保证省钱；不同模型、不同任务上的结论可能相反。
- 会多占一点系统提示 token（约 100–150 token）。

## 兼容性

- 需要 DSH 提供 `systemPrompt` 服务（0.1.x / 0.2.x 均可用）。
- 纯 ESM，无构建产物，无运行时依赖。
- 测试：`node test/smoke.mjs`（或 `npm test`）。

## 目录结构

```
.
├── index.js            # 插件入口，约 130 行
├── cordis.patch.yml    # bundle 补丁，声明 mode / order
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

## 许可

[MIT](./LICENSE) © 2026 xiaohuo130
