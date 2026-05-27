# 班级宠物园 (ClassPetGarden) 🐾

> 游戏化班级管理与虚拟宠物养成系统，专为教师设计，通过正向激励激发学生的学习与行为动力。

本项目是一个精美的 Web 应用程序，将积分追踪与虚拟宠物成长机制深度结合。现在已适配 **Vercel 一键部署**，并支持**云端服务器模式**与**纯前端本地存储模式**双模自适应切换！

---

## 🌟 核心特色

- **🐱 丰富宠物系统**：内置 25 种可爱宠物（18 种普通宠物 + 7 种珍稀神兽），分为 8 个成长等级（Lv.1 ~ Lv.8 毕业）。
- **🏆 徽章荣誉体系**：宠物成长到满级（Lv.8）后即可“毕业”，学生将荣获专属的宠物毕业徽章。
- **📈 智能积分系统**：积分按“学习”、“行为”、“健康”、“其他”四大维度划分。加分自动转化为宠物经验，扣分自动扣除相应经验，等级自适应升级与降级。
- **📊 实时排行榜**：一键查看班级学生的积分与宠物等级排行，支持徽章数量展示，激发良性竞争。
- **🔄 双模自适应架构**：
  - **本地存储模式（默认）**：无需任何后端服务器与数据库，所有班级、学生、宠物、评价数据均保存在浏览器本地（LocalStorage），零成本、开箱即用，支持一键备份与恢复。
  - **云端服务器模式**：配置环境变量后自动切换，与云端 Express + SQLite API 进行数据同步，支持多终端协作。
- **⚙️ 完善的管理后台**：支持班级创建/编辑/级联删除，支持学生名单一键 Excel 批量复制导入，支持自定义评价规则。

---

## 🛠️ 技术栈

### 前端 (Frontend)
- **核心框架**：Vue 3 (SFC, `<script setup>`) + TypeScript (严格模式)
- **构建工具**：Vite
- **样式方案**：Tailwind CSS + CSS 变量自定义主题
- **路由管理**：Vue Router (HTML5 History 模式)
- **网络请求**：Axios + 自定义本地拦截适配器 (Axios Adapter)

### 后端 (Backend - 可选)
- **运行环境**：Node.js + Express
- **数据库**：SQLite (`better-sqlite3`)
- **身份认证**：JWT (jsonwebtoken)

---

## 🚀 部署到 Vercel (自适应纯前端本地模式)

本项目进行了深度的 Vercel 适配，可以在 **Vercel** 上一键极简部署：

1. **导入代码**：将本项目推送到您的 GitHub 仓库，并在 Vercel 仪表盘中导入该仓库。
2. **选择预设**：Vercel 会自动识别为 **Vite** 前端项目：
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **完成部署**：**无需配置任何环境变量和数据库**，直接点击 **Deploy**。部署完成后访问 Vercel 生成的域名，即可直接在浏览器本地开始使用！

> [!TIP]
> **多设备同步或使用独立后端**：如果您部署了云端 API 服务器，只需在 Vercel 项目设置中添加环境变量：
> `VITE_API_URL=https://您的云端API服务器域名/api`
> 重新打包后，系统将自动从本地存储模式无缝升级为云端数据库同步模式。

---

## 💻 本地运行与开发

### 1. 克隆项目
```bash
git clone https://github.com/178991907/class-pet.git
cd class-pet
```

### 2. 纯前端模式运行
1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动前端开发服务器：
   ```bash
   npm run dev
   ```
3. 打开浏览器访问 `http://localhost:3001`，开始体验本地存储版。

### 3. 前后端联调运行
1. 同时启动前端与后端服务器（前端使用开发服务器，后端使用 Express，端口 3002，使用本地 SQLite 数据库 `server/pet-garden.db`）：
   ```bash
   npm run start
   ```
2. 在浏览器中打开 `http://localhost:3001`，此时数据会持久化保存在本地 SQLite 数据库中。

---

## 📦 项目结构说明

```
class-pet/
├── src/                      # 前端源码
│   ├── main.ts              # 入口文件
│   ├── App.vue              # 根组件
│   ├── style.css            # 全局样式（Tailwind）
│   ├── router/              # Vue Router 路由
│   ├── data/pets.ts         # 宠物预设与等级计算
│   ├── pages/Home.vue       # 系统主页（所有业务 UI 与交互逻辑）
│   ├── utils/
│   │   ├── localDb.ts       # 本地 LocalStorage 数据库模拟引擎
│   │   └── localApiAdapter.ts # Axios 本地适配器（实现本地降级拦截）
│   └── composables/
│       └── useAuth.ts       # 用户鉴权与双模自适应调度
├── server/                   # 后端源码（Node.js + Express + SQLite）
│   ├── index.js             # 服务端入口
│   ├── db.js                # SQLite 数据库表初始化
│   └── routes/              # 后端 API 路由
├── public/                  # 静态资源（含宠物各等级原画）
├── vercel.json              # Vercel 部署路由配置文件
├── tailwind.config.js       # Tailwind 主题预设
└── package.json             # 依赖配置
```

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。
