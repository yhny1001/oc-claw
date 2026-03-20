# 🐾 OC-Claw

A macOS menu bar desktop pet that monitors your AI coding agents in real time.

一个 macOS 菜单栏桌宠应用，实时监控你的 AI 编程 agent 工作状态。

---

## 中文

OC-Claw 是一个坐在 MacBook 刘海旁边的桌宠。它会监控 [OpenClaw](https://github.com/openclaw) agent 和 [Claude Code](https://claude.ai/claude-code) 会话，用小角色动画展示它们的工作状态。

### 功能

- **刘海桌宠** — 角色栖息在 MacBook 刘海旁边，工作时播放动画，休息时打盹
- **OpenClaw 监控** — 自动发现本地 OpenClaw agent，显示 session 列表、聊天记录、调用量/token 统计图表
- **Claude Code 监控** — 通过 Hook 监听本地 Claude Code 会话，查看实时对话
- **远程模式** — 连接远程服务器上的 OpenClaw 实例
- **角色系统** — 自定义角色 GIF 动画，将不同 agent 配对不同角色
- **纯状态栏应用** — 不占用程序坞，仅在菜单栏显示托盘图标

### 技术栈

- **Tauri v2** + **React** + **TypeScript**
- **Rust** 后端处理系统交互与 API 通信
- macOS 原生 API 实现刘海定位与窗口管理

### 开发

```bash
cd frontend
npm install
npx tauri dev
```

---

## English

OC-Claw is a desktop pet that sits next to your MacBook notch. It monitors [OpenClaw](https://github.com/openclaw) agents and [Claude Code](https://claude.ai/claude-code) sessions, showing their working status with animated characters.

### Features

- **Notch Pet** — A character lives beside the MacBook notch, animating when agents are working and sleeping when idle
- **OpenClaw Monitoring** — Auto-discovers local OpenClaw agents, displays session lists, chat history, and daily calls/tokens charts
- **Claude Code Monitoring** — Listens to local Claude Code sessions via hooks, view live conversations
- **Remote Mode** — Connect to OpenClaw instances running on remote servers
- **Character System** — Custom GIF animations, pair different agents with different characters
- **Menu Bar Only** — No dock icon, runs as a status bar tray app

### Tech Stack

- **Tauri v2** + **React** + **TypeScript**
- **Rust** backend for system interaction and API communication
- macOS native APIs for notch positioning and window management

### Development

```bash
cd frontend
npm install
npx tauri dev
```

## License

MIT
