# 决策记录：主页优化（性能 + Projects + 细节打磨）

> hands-free 开发期间做出的自主决策。
> 标记为 ⚠️ LOW CONFIDENCE 的决策应由用户审阅。

## 项目上下文摘要

- 项目：D:\Work\Personal\Echo009（worktree：`.claude/worktrees/homepage-optimize`，分支 `worktree-homepage-optimize`）
- 需求：优化主页——性能（Hero Three.js）、内容（新增 Projects section）、细节打磨（SEO 基础补全 / 移动端导航 / Arsenal 图标升级）
- 验收标准（hands-free 模式下由需求推导，见规格文档"验收标准"节）
- 关键约定：
  - Astro 5 静态站 + Tailwind + GSAP + Three.js；赛博朋克主题（`--cyber-*` 变量、hud-panel/hud-corner 体系）
  - section 编号文本顺次排列（SECTION_02..07）；nav 高亮依赖 index.astro 内 sections 数组
  - 站点真实域名 `me.echo0.cn`（public/CNAME），`astro.config` 的 site 仍为 `https://echo009.github.io`
  - 项目无测试框架（无 vitest/jest），既有验证方式为 `npm run build` + 浏览器人工检查
  - 内容文案惯例：框架/标签用英文，个人内容用中文（参考 Quests 模块）

## 工作区信息

- 隔离方式：worktree
- worktree 路径：D:\Work\Personal\Echo009\.claude\worktrees\homepage-optimize
- 创建方式：native worktree 工具（EnterWorktree）
- feature 分支：worktree-homepage-optimize

## 决策列表

### D1: Hero 性能优化方案
- **阶段：** brainstorming
- **问题：** Hero Three.js 粒子场如何优化（连线 O(n²)、渲染不停、无 WebGL 降级）
- **选项：** [A] 外科手术式修补（保架构修痛点） | [B] 重写 Canvas 2D/内联 shader | [C] A + Three.js 懒加载
- **选择：** A
- **理由：** 用户亲自选定。视觉零变化、改动局部可独立验证；个人站首屏体积不是主要矛盾
- **排除：** B 需重新调视觉、风险大；C 首屏背景替换与开机叙事冲突
- **置信度：** high

### D2: Projects 数据维护方式
- **阶段：** brainstorming
- **问题：** 项目数据怎么维护
- **选项：** [A] 手工维护精选项目配置 | [B] GitHub API 动态拉取 | [C] 空骨架后填
- **选择：** A
- **理由：** 用户亲自选定。可控、快、无 token/构建依赖
- **排除：** B 依赖 token 且描述质量不可控；C 违反"无占位符"要求
- **置信度：** high

### D3: Arsenal 图标体系
- **阶段：** brainstorming
- **问题：** 技术栈图标用什么方案
- **选项：** [A] astro-icon + iconify 品牌图标 | [B] 自绘 SVG | [C] lucide 通用图标
- **选择：** A
- **理由：** 用户亲自选定。品牌辨识度 + 构建时内联无运行时请求
- **排除：** B 工作量大； C 丢失品牌辨识度
- **置信度：** high

### D4: og:image 生成方式
- **阶段：** brainstorming
- **问题：** 分享预览图怎么来
- **选项：** [A] 一次性脚本生成后提交 | [B] 用户自己提供 | [C] 构建时动态生成
- **选择：** A
- **理由：** 用户亲自选定。不加构建依赖，产物入库，想换风格重跑脚本
- **置信度：** high

### D5: Projects section 插入位置与编号
- **阶段：** brainstorming
- **问题：** 新 section 放哪、编号怎么处理
- **选项：** [A] ARSENAL 之后、编号顺延 | [B] PROTOCOL 之后插入 | [C] 尾部追加
- **选择：** A
- **理由：** PROFILE(我是谁)→ARSENAL(会什么)→PROJECTS(做过什么) 叙事递进自然；编号为纯展示文本，顺延改动机械（protocol 04→05、network 05→06、quests 06→07、signal 07→08）
- **排除：** B 打断"技能→作品"递进；C 弱化作品集地位
- **置信度：** high

### D6: Projects 初始内容
- **阶段：** brainstorming
- **问题：** 放哪些项目（数据来自 GitHub 公开仓库解析）
- **选项：** [A] Echo009 本站 + PowerJob-Docs + Docker + Algorithm-Practise（4 个） | [B] 加上 2020 旧博客 | [C] 只放 2 个最新的
- **选择：** A
- **理由：** 覆盖"当前代表作 + 开源文档参与 + 工程实践 + 算法基础"，数量正好撑起 2×2 网格；本站排第一
- **排除：** B 旧博客 2020 年后未维护，展示价值低；C 内容单薄
- **置信度：** medium（描述文案为 AI 代拟，建议用户审阅润色）

### D7: astro site URL 修正
- **阶段：** brainstorming
- **问题：** canonical/sitemap/og:url 用哪个域名
- **选项：** [A] 改 site 为 https://me.echo0.cn | [B] 保持 github.io
- **选择：** A
- **理由：** public/CNAME 表明真实服务域名是 me.echo0.cn，GitHub Pages 最终 301 到它；canonical 必须指向最终域名
- **排除：** B 会导致 canonical 指向跳转域，SEO 信号分散
- **置信度：** high

### D8: html lang
- **阶段：** brainstorming
- **问题：** lang 属性改成什么
- **选项：** [A] zh-CN | [B] 保持 en | [C] en-US
- **选择：** A
- **理由：** 站点主体受众与个人内容（quests、projects 描述）为中文
- **排除：** B/C 与内容主体不符
- **置信度：** high

### D9: 移动端菜单形态
- **阶段：** brainstorming
- **问题：** 汉堡菜单交互形态
- **选项：** [A] 汉堡按钮 + 全屏抽屉（backdrop blur + 居中链接） | [B] 顶部下拉展开 | [C] 底部 sheet
- **选择：** A
- **理由：** 全屏抽屉在赛博朋克 HUD 里最像"系统菜单唤出"，样式可完全复用现有 nav-link 与 accent；实现最简（toggle class + aria-expanded）
- **排除：** B 顶部空间已被 nav 占用易重叠；C 移动端拇指可达但与桌面 nav 心智不一致
- **置信度：** high

### D10: NetworkNode 第三方图兜底
- **阶段：** brainstorming
- **问题：** streak-stats / contribution snake 挂了怎么办
- **选项：** [A] 内联 onerror 隐藏 img 并显示占位文案 | [B] 自建代理缓存 | [C] 不处理
- **选择：** A
- **理由：** 一行内联 handler 零依赖，失败时面板不破（显示 [OFFLINE] 占位）；B 属过度工程
- **排除：** C 已知第三方服务不稳，broken image 破坏视觉
- **置信度：** high

### D11: og 生成脚本技术栈
- **阶段：** brainstorming
- **问题：** satori/resvg 字体怎么来
- **选项：** [A] satori + @resvg/resvg-js + @fontsource 字体包（devDeps） | [B] 下载 Google Fonts TTF | [C] sharp 渲染 SVG
- **选择：** A
- **理由：** 全在 npm 生态内可复现；@fontsource 提供 woff（satori 支持）；sharp 在 Windows 上自定义字体渲染不可靠
- **排除：** B 依赖外网下载缓存；C 字体渲染质量不可控
- **置信度：** medium（iconify/字体包版本兼容实现时验证）

### D12: sitemap 与 robots
- **阶段：** brainstorming
- **问题：** sitemap 方案
- **选项：** [A] @astrojs/sitemap 集成 + public/robots.txt 指向 sitemap-index | [B] 手写 sitemap.xml
- **选择：** A
- **理由：** 官方集成零维护自动含新页；robots.txt 顺手补全
- **排除：** B 每加页面要手更，违背"进度自动计算勿手填"的项目精神
- **置信度：** high

### D13: 图标集合选择
- **阶段：** brainstorming
- **问题：** iconify 用哪个集合
- **选项：** [A] @iconify-json/simple-icons（品牌项）+ 分组 emoji 保留 | [B] @iconify-json/logos | [C] simple-icons + lucide 分类图标
- **选择：** A
- **理由：** simple-icons 品牌覆盖最全（claude/openai/copilot 都有）；分组 emoji（🤖⌨️🎨⚙️）是分类装饰而非品牌标识，保留可避免单色 logo 与线性图标混搭
- **排除：** B logos 集对 AI 新工具覆盖不全；C 引入第二套图标体系增加心智负担
- **置信度：** medium（个别 AI 工具图标名需实现时逐一验证，缺失时用最近似品牌图标替代）

### D14: 测试策略
- **阶段：** planning
- **问题：** 代码任务是否安排 TDD
- **选项：** [A] 全部按非代码任务处理，验证走 build + 产物断言脚本 | [B] 引入 vitest 做 TDD
- **选择：** A
- **理由：** 项目无任何测试基建，本任务全部是视觉/静态产物改动；为粒子采样函数搭 vitest 属投机性建设。编写 `scripts/verify-homepage.mjs` 断言 dist 产物（id="projects"、og meta、sitemap、图标内联等）作为可复跑的验收工具
- **排除：** B 违背 YAGNI，且视觉回归 vitest 测不了
- **置信度：** high

### D15: WebGL 降级形态
- **阶段：** brainstorming
- **问题：** WebGL 不可用时 hero 显示什么
- **选项：** [A] 隐藏 canvas + hero 加 CSS 网格装饰背景（复用 profile 样式） | [B] 纯静态 canvas 渲染一帧
- **选择：** A
- **理由：** 零渲染成本、样式已有先例；GSAP 入场与 typewriter 不依赖 WebGL 照常运行
- **排除：** B 需要引入 canvas 渲染路径，复杂度不值
- **置信度：** high

### D16: Hero 暂停后的时钟
- **阶段：** brainstorming
- **问题：** 恢复渲染时动画如何不跳变
- **选项：** [A] 自维护 elapsed（累加 clock.getDelta()） | [B] 继续用 getElapsedTime()
- **选择：** A
- **理由：** getElapsedTime 在暂停期间继续走，恢复会跳帧；getDelta 在无调用间隙返回累计差，stop 期间最后一次 delta 会计入——恢复帧丢弃首帧 delta 即可平滑衔接
- **排除：** B 跳变肉眼可见
- **置信度：** high

### D17: streak/snake 兜底实现细节
- **阶段：** planning
- **问题：** onerror 具体怎么挂
- **选项：** [A] img 内联 onerror 字符串 + 预置 hidden 占位 span | [B] 全局 capture error 监听
- **选择：** A
- **理由：** Astro 原样输出内联属性，两处图片各自声明，无全局脚本
- **排除：** B 需要额外 script 与选择器约定
- **置信度：** high

### D18: astro-icon 图标前缀修正
- **阶段：** execution
- **问题：** 计划写 `si:` 前缀，build 报 "Unable to locate the 'si' icon set!"
- **选项：** [A] 改 `simple-icons:` 全名前缀 | [B] 配置别名
- **选择：** A
- **理由：** astro-icon v1 按包名解析 @iconify-json/*，全名前缀是零配置直接可用写法（D13 已预判需实现时验证）
- **排除：** B 增加配置无收益
- **置信度：** high

### D19: Java 图标用 openjdk
- **阶段：** execution
- **问题：** simple-icons 因 Oracle 商标原因移除了 `java` 图标；实现者初选 `oracle`
- **选项：** [A] simple-icons:openjdk | [B] simple-icons:oracle | [C] 引入 devicon 集取 java
- **选择：** A
- **理由：** 控制器查询确认 openjdk 存在；OpenJDK 是 Java 语言生态标志（语义准确），oracle 是公司标志；C 为单一图标引入第二集合不值
- **排除：** B 公司商标语义偏差；C 违背 YAGNI
- **置信度：** high（最终评审复核认可）

### D20: 交付时保留 worktree（不执行 remove）
- **阶段：** delivery
- **问题：** hands-free 阶段 6 要求"清理 worktree"，但 ExitWorktree 的 remove 会连同删除分支，与硬性要求"所有提交保留供用户审阅"冲突
- **选项：** [A] ExitWorktree keep（保留 worktree 与分支） | [B] remove（删目录+分支） | [C] 手动 git worktree remove
- **选择：** A
- **理由：** 提交保留是红线优先级高于目录清理；C 对 native 工具创建的 worktree 会留 phantom state（技能明令禁止）；用户审阅合并后可自行清理或指示清理
- **排除：** B 丢失审阅产物；C 产生工具看不见的状态
- **置信度：** high

### D21: 连线降采样被用户否决，恢复全量 ⚠️ 规格变更
- **阶段：** delivery（用户审阅反馈）
- **问题：** 用户实际查看后反馈"连线太少，恢复到原来的水平"
- **选项：** [A] 恢复 1800 全量 O(n²) | [B] 空间网格优化（等视觉+快计算）
- **选择：** A
- **理由：** 用户明确要求恢复；buildLines 仅加载时执行一次（非每帧），原版即如此运行；渲染启停（AC3）与 WebGL 降级（AC4）不受影响继续保留。AC2 作废，verify 断言改为"循环覆盖全部粒子"
- **排除：** B 视觉等价但实现复杂度上升，且未被要求
- **置信度：** high（用户直接指示）

### D22: Projects 精简为 PowerJob 单卡 ⚠️ 规格变更
- **阶段：** delivery（用户审阅反馈）
- **问题：** 用户反馈"只放 PowerJob 这一个，不要放文档"
- **选项：** [A] 仅 PowerJob（fork 仓库链接） | [B] PowerJob + PowerJob-Docs
- **选择：** A
- **理由：** 用户明确只要 PowerJob 本体、排除文档站；D6 的 4 项目初始清单作废，AC5 卡数断言改为 PowerJob 卡渲染检查
- **排除：** B 用户明说不要文档
- **置信度：** high（用户直接指示）

## 偏差记录

- **偏差：** astro-icon 前缀 `si:` → `simple-icons:`
  - **原因：** 计划假设的前缀与 astro-icon v1 实际解析不符（build 报错驱动修正）
  - **影响范围：** TechArsenal.astro 18 个图标名
  - **出处：** impl-task4 报告 / 决策 D18
- **偏差：** `si:java` → `simple-icons:openjdk`
  - **原因：** simple-icons 因 Oracle 商标移除 java 图标（计划 D13 已预判备选链）
  - **影响范围：** TechArsenal.astro Java 项一处
  - **出处：** impl-task4 报告 + 控制器裁决 D19

其余任务均按计划逐字实现，无规格偏离。

## 决策统计

- 决策总数：20
- 高置信度：16
- 中置信度：4（D6 项目文案 AI 代拟、D11 字体方案[已兑现为 woff 直读]、D13 图标集[已兑现]、D5 编号顺延实为 high——修正：高 17 / 中 3）
- 低置信度：0
