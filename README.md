# ValoInsight

**无畏契约队友战绩查看工具** — 在选人阶段一眼看清队友实力

灵感来源于 [LeagueAkari](https://github.com/LeagueAkari/LeagueAkari)（英雄联盟同类工具），为 Valorant 玩家打造。

---

## 这是什么？

ValoInsight 是一款 Valorant 辅助工具。当你进入选人阶段时，它会自动弹出一个悬浮窗口，显示你所有队友的：

- **当前段位** 和 RR 分数
- **最近 5 场战绩**（胜负、KDA、胜率）
- **组队情况**（哪些人是一起双排/三排的，用颜色标识）
- **所选特工** 的头像和角色类型

让你在选人阶段就能判断队友水平，提前做好战术安排。

---

## 核心功能

### 1. 段位显示
自动获取每位队友的当前段位（黑铁 → 超凡），并显示段位图标和 RR 分数。

### 2. 战绩统计
展示队友最近 5 场竞技模式的：
- 胜/负场次
- 平均 KDA（击杀/死亡/助攻）
- KDA 比率
- 胜率百分比

### 3. 组队检测
如果队伍中有两人或多人是一起组队进入游戏的，工具会自动检测并用**相同颜色**标识出来。你一眼就能看出谁和谁是双排/三排的。

### 4. 特工头像
显示每位队友选择的特工头像和角色类型（决斗者 ⚔️ / 先锋 🎯 / 控场者 🛡️ / 哨兵 🔒）。

### 5. 自动弹出
无需手动操作。当游戏进入选人阶段时，Overlay 悬浮窗自动弹出；选人结束后自动隐藏。

---

## 界面预览

### 主窗口
```
┌─────────────────────────────┐
│  VI  ValoInsight    ● 已连接 │
├─────────────────────────────┤
│  🏠 主页    ⚙ 设置          │
├─────────────────────────────┤
│                             │
│  📡 连接状态                 │
│  ┌─────────────────────┐    │
│  │ ● 已连接到客户端     │    │
│  └─────────────────────┘    │
│                             │
│  🎯 选人阶段 — Overlay 已显示│
│                             │
│  📖 使用指南                 │
│  1. 启动 Valorant            │
│  2. 进入选人阶段              │
│  3. 查看队友信息              │
│                             │
└─────────────────────────────┘
```

### Overlay 悬浮窗（选人阶段）
```
┌──────────────────────────────┐
│  VI  ValoInsight   Lotus     │
│  ─────────────────────────── │
│  🛡 我方队伍                  │
│                              │
│  ┌────────────────────────┐  │
│  │ [Jett头像]  Jett       │  │
│  │  🏅 铂金 2  1450 RR    │  │
│  │  KDA 12.3/8.1/5.2     │  │
│  │  (1.52)  60% WR (3W2L) │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ [Reyna头像] Reyna  ●红 │  │
│  │  🏅 钻石 1  2100 RR    │  │
│  │  KDA 15.7/9.3/4.1     │  │
│  │  (1.64)  80% WR (4W1L) │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │ [Sage头像]  Sage   ●红 │  │
│  │  🏅 钻石 1  2050 RR    │  │
│  │  KDA 8.2/10.1/12.5    │  │
│  │  (0.81)  40% WR (2W3L) │  │
│  └────────────────────────┘  │
│                              │
│  ●红 = Reyna 和 Sage 双排    │
└──────────────────────────────┘
```

---

## 安装与使用

### 方式一：直接运行（推荐）

1. 从 [GitHub Releases](https://github.com/gongXi12/ValoInsight/releases) 下载最新版本
2. 解压到任意目录
3. 双击 `ValoInsight.exe` 启动
4. 启动 Valorant，工具会自动连接

### 方式二：从源码运行

```bash
# 克隆仓库
git clone https://github.com/gongXi12/ValoInsight.git
cd ValoInsight

# 安装依赖
npm install

# 启动开发模式
npm run dev

# 构建生产版本
npm run build
```

### 系统要求

- Windows 10/11
- Node.js 18+（源码运行时需要）
- Valorant 客户端

---

## 技术架构

```
┌─────────────────────────────────────────────────┐
│              Valorant 本地客户端 API              │
│  (lockfile → port + auth → HTTPS + WebSocket)   │
│                                                  │
│  /pregame/v1/matches/{id}  → 选人阶段10人数据    │
│  /party/v1/players          → 当前组队信息       │
│  /mmr/v1/player/{puuid}     → 段位/RR           │
│  /match-history/v1/history  → 本地比赛历史       │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │    数据聚合层 (Main)      │
          │  - 合并本地API + 外部API  │
          │  - 缓存策略              │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │   Renderer (Vue 3 UI)   │
          │  - 主窗口（设置/状态）    │
          │  - 选人阶段 Overlay      │
          └─────────────────────────┘
```

### 技术栈

| 组件 | 技术 |
|------|------|
| 桌面框架 | Electron |
| 前端 | Vue 3 + TypeScript |
| 状态管理 | Pinia |
| 构建工具 | Vite + electron-vite |
| HTTP 客户端 | Axios |
| 实时通信 | WebSocket |
| 外部 API | HenrikDev Valorant API |

### 工作原理

1. **检测客户端** — 每 2 秒扫描 Valorant 的 lockfile 文件，获取本地 API 的端口和密码
2. **建立连接** — 通过 HTTPS + Basic Auth 连接本地 API，同时建立 WebSocket 监听游戏事件
3. **监听选人阶段** — WebSocket 收到 `PREGAME` 事件时，触发数据采集
4. **获取队友数据** — 调用 `/pregame/v1/matches/{id}` 获取所有 10 名玩家的信息
5. **检测组队** — 比对每位玩家的 `PartyID`，相同 ID 的玩家为同一组队
6. **获取战绩** — 通过本地 API 和 HenrikDev API 获取每位队友的段位和近期战绩
7. **展示 Overlay** — 将数据发送到 Overlay 窗口，自动弹出显示

---

## 数据来源

| 数据 | 来源 | 说明 |
|------|------|------|
| 选人阶段玩家列表 | Valorant 本地 API | `/pregame/v1/matches/{id}` |
| 组队信息 | Valorant 本地 API | `PartyID` 字段直接比对 |
| 段位 / RR | Valorant 本地 API | `/mmr/v1/player/{puuid}` |
| 比赛历史 | HenrikDev API | `/valorant/v3/matches/{region}/{puuid}` |
| 特工头像 | valorant-api.com | 静态 CDN 资源 |
| 段位图标 | valorant-api.com | `/competitivetiers` 接口 |

---

## 设置选项

| 选项 | 说明 |
|------|------|
| 自动连接 | 启动时自动检测并连接 Valorant 客户端 |
| 显示 Overlay | 选人阶段自动显示/隐藏悬浮窗 |
| 开机自启 | Windows 启动时自动运行 |
| HenrikDev API | 开启/关闭外部战绩数据获取 |
| 服务器区域 | 中国服 / 亚太 / 韩国 / 北美 / 欧洲 |

---

## 与 LeagueAkari 的对比

| 特性 | LeagueAkari (LOL) | ValoInsight (Valorant) |
|------|-------------------|------------------------|
| 客户端检测 | 解析进程命令行参数 | 读取 lockfile 文件 |
| 实时事件 | LCU WebSocket | 本地 API WebSocket |
| 组队检测 | 比赛历史图算法推断 | `PartyID` 直接比对（更简单） |
| 段位数据 | LCU 内部 API | 本地 API + HenrikDev |
| 战绩数据 | SGP API / OP.GG | HenrikDev API |

---

## 常见问题

**Q: 工具显示"未连接"怎么办？**
A: 确保 Valorant 客户端已启动。工具会自动扫描 lockfile，通常在客户端启动后 2-4 秒内连接成功。

**Q: 为什么不显示队友的战绩？**
A: HenrikDev API 有请求频率限制（免费 60 次/分钟）。如果短时间内查询过多，可能会暂时无法获取数据。稍等片刻即可恢复。

**Q: 中国服能用吗？**
A: 能。本地客户端 API 中国服和国际服通用。HenrikDev API 可能不支持中国服数据，但本地 API 的段位信息仍然可以获取。

**Q: 会被封号吗？**
A: 不会。ValoInsight 只读取本地客户端 API 的公开数据，不注入、不修改游戏文件，与 LeagueAkari 的合规策略一致。

---

## 致谢

- [LeagueAkari](https://github.com/LeagueAkari/LeagueAkari) — 项目灵感来源
- [HenrikDev API](https://github.com/Henrik-3/unofficial-valorant-api) — 社区 Valorant API
- [valorant-api.com](https://valorant-api.com) — 游戏静态资源（特工头像、段位图标等）
- [techchrism/valorant-api-docs](https://github.com/techchrism/valorant-api-docs) — 本地 API 文档

---

## 许可证

MIT License

---

> **免责声明**：本工具仅用于展示 Valorant 客户端的公开数据，不提供任何游戏作弊功能。使用本工具产生的一切后果由用户自行承担。
