# Changelog

All notable changes to this project are documented here.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-11-09

首次公开发布。

### Added

- `mode: zh | en | off` 三档推理语言配置。
- `order` 配置，控制 section 在系统提示中的位置。
- `text` 配置，可整段覆盖内置文案。
- 中英双语设置页文案（`locale/zh.json`、`locale/en.json`）。
- 4 个冒烟用例（`test/smoke.mjs`），覆盖默认、英文、关闭、自定义文本四种路径。

### Notes

- 插件只注册一个 `systemPrompt.section`，不注册工具、不监听事件、不发网络请求。
- 不保证省钱；请按 README 的 A/B 方法在真实任务上验证。
