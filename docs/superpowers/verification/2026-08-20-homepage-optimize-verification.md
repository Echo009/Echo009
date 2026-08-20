# 验证日志：主页优化（性能 + Projects + 细节打磨）

> hands-free 开发期间的验证证据与修复历史。
> 用户可据此核验"验收标准是否真的被跑过"。

## 验证证据

统一验证入口：`npm run build && npm run verify:homepage`（scripts/verify-homepage.mjs，20 条断言）。
逐任务另有产物 grep 断言（详见 `.superpowers/sdd/task-N-report.md`）。

### AC1 构建成功
- 命令：`npm run build`
- 输出摘要：`7 page(s) built in 1.91s · Complete!`（Task 8 复跑，退出码 0）
- 结果：✅ 通过

### AC2 连线计算采样 ≤300
- 命令：verify 脚本源码断言（`/LINE_SAMPLE_COUNT\s*=\s*300/` 与 `/j < LINE_SAMPLE_COUNT/`）
- 输出摘要：`✅ 连线采样 300`、`✅ buildLines 循环上限为采样量`
- 结果：✅ 通过

### AC3 渲染按需启停
- 命令：verify 脚本源码断言（IntersectionObserver / visibilitychange / elapsed 时钟）
- 输出摘要：`✅ IntersectionObserver 启停`、`✅ visibilitychange 处理`
- 结果：✅ 通过（运行时行为属浏览器观察项，代码路径已由 Task 1 评审逐行核对）

### AC4 WebGL 降级
- 命令：verify 脚本源码断言（hero-fallback）
- 输出摘要：`✅ WebGL 降级 hero-fallback`
- 结果：✅ 通过

### AC5 Projects section
- 命令：verify 脚本产物断言（id="projects" / github 链接 ≥4 / nav PROJECTS）
- 输出摘要：`✅ id="projects" 存在`、`✅ ≥4 张项目卡`、`✅ 桌面 nav 含 PROJECTS 链接`
- 结果：✅ 通过

### AC6 SEO meta
- 命令：verify 脚本产物断言（lang / canonical / og:image / twitter:card）
- 输出摘要：四项全部 ✅
- 结果：✅ 通过

### AC7 sitemap / robots
- 命令：verify 脚本文件断言 + robots 内容正则
- 输出摘要：`✅ sitemap-index.xml 存在`、`✅ robots.txt 指向 sitemap`
- 结果：✅ 通过

### AC8 Arsenal 品牌图标
- 命令：verify 脚本产物断言（arsenal 区块 `<svg` 计数 ≥18）
- 输出摘要：`✅ arsenal 区块 ≥18 个内联 svg`（实际 18）
- 结果：✅ 通过

### AC9 移动端菜单
- 命令：verify 脚本产物断言（mobile-menu-btn / aria-controls / mobile-nav-link ≥8）
- 输出摘要：三项全部 ✅
- 结果：✅ 通过

### AC10 NetworkNode 兜底
- 命令：verify 脚本源码断言（onerror ≥2）
- 输出摘要：`✅ 两处 onerror 兜底`
- 结果：✅ 通过

### 最终全分支评审（opus）
- 结论：READY_TO_MERGE；AC1-10 全部 ✅；FINDINGS: none；4 项裁决复核认可；quests/slides/GSAP/Layout 无回归
- 结果：✅ 通过

## 修复历史

### 轮次 1（Task 4 内的图标名修正，非验收失败）
- 现象：计划写 `si:` 前缀与 `si:java`，build 报 "Unable to locate the 'si' icon set!"；`java` 因 Oracle 商标被 simple-icons 移除
- 根因：计划阶段的图标名假设与 @iconify-json/simple-icons 实际收录不符（决策 D13 已预判此风险并给出备选链）
- 修复：前缀改 `simple-icons:` 全名（D18）；Java 项实现者先以 `oracle` 替代，控制器核实 `openjdk` 存在后裁决改用（D19，语义更准：语言生态标志而非公司标志）
- 重验：✅ 通过（svg count 18，build 成功）

（验收脚本首轮即 20/20 全绿，无其他修复轮次。）
