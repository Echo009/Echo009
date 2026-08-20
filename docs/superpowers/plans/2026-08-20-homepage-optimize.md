# 主页优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对个人主页做性能（Hero Three.js）、内容（Projects section）、细节（SEO/移动导航/图标/兜底）三类优化。

**Architecture:** 全部为 Astro 静态站的局部改动：Hero 脚本外科手术式修补（不动视觉）、新增 `src/data/projects.ts` + `ProjectsShowcase.astro` 静态渲染、Layout/astro-config 层补 SEO、一次性脚本生成 og.png。无测试框架（决策 D14），每任务以 `npm run build` + 产物断言验证，最终由 `scripts/verify-homepage.mjs` 统一验收。

**Tech Stack:** Astro 5 + Tailwind + GSAP + Three.js；新增 astro-icon + @iconify-json/simple-icons、@astrojs/sitemap、satori + @resvg/resvg-js + @fontsource 字体。

## Global Constraints

- 工作目录：worktree `D:\Work\Personal\Echo009\.claude\worktrees\homepage-optimize`（分支 `worktree-homepage-optimize`）——所有命令在此目录执行
- 赛博朋克主题配色只用 `--cyber-*` 既有变量（`#00ffff / #ff006e / #f5ff00 / #7b2fff / #050510`）
- 每个 tech 项图标为 simple-icons 集内品牌图标（`si:` 前缀）；分组 emoji（🤖⌨️🎨⚙️）保留（决策 D13）
- 文案惯例：HUD 标签英文大写、个人内容中文（决策记录"关键约定"）
- 所有提交不 push（hands-free 红线），留在本地分支
- 无测试基建，不引入测试框架（决策 D14）；"验证"步骤 = `npm run build` 退出码 0 + 产物 grep
- 规格文档：`docs/superpowers/specs/2026-08-20-homepage-optimize-design.md`；决策记录：`docs/superpowers/decisions/2026-08-20-homepage-optimize-decisions.md`
- 构建命令前必须确认 Node 环境（项目无 .nvmrc，用当前默认 Node 22 即可，无需 nvm use）

---

### Task 1: Hero 性能优化（连线降采样 + 渲染启停 + WebGL 降级）

**Files:**
- Modify: `src/components/Hero.astro`（script 块整体重构 + style 块追加）

**Interfaces:**
- Consumes: 无
- Produces: 无（独立改动；`#hero`、`#hero-canvas` 等 DOM 契约不变）

**说明：** 本任务为"代码任务"但按非 TDD 执行（决策 D14：无测试基建，纯视觉组件）。验证 = build + 产物 grep。

- [ ] **Step 1: 环境准备（worktree 无 node_modules）**

Run: `npm install`
Expected: 退出码 0，生成 node_modules（按既有 package-lock 安装，不新增依赖）

- [ ] **Step 2: 重构 Hero.astro 的 `<script>` 块**

将 `<script>` 内容**整体替换**为以下代码（保留 import；GSAP 入场、typewriter、scroll-indicator 部分原样保留，仅 Three.js 部分包进 `initParticles()`）：

```ts
  import * as THREE from 'three';
  import { gsap } from 'gsap';

  // ─── WebGL 支持检测（降级：无 WebGL 时显示 CSS 网格背景） ────────────────

  function supportsWebGL(): boolean {
    try {
      const test = document.createElement('canvas');
      return !!(test.getContext('webgl') || test.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  const heroCanvas = document.getElementById('hero-canvas') as HTMLCanvasElement;

  if (supportsWebGL()) {
    initParticles();
  } else {
    heroCanvas.style.display = 'none';
    document.getElementById('hero')?.classList.add('hero-fallback');
  }

  function initParticles() {
    const canvas = heroCanvas;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050510, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;

    // Particle geometry
    const PARTICLE_COUNT = 1800;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);

    const cyanColor = new THREE.Color('#00FFFF');
    const pinkColor = new THREE.Color('#FF006E');
    const purpleColor = new THREE.Color('#7B2FFF');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const t = Math.random();
      const col = t < 0.5 ? cyanColor.clone().lerp(purpleColor, t * 2) : purpleColor.clone().lerp(pinkColor, (t - 0.5) * 2);
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(uTime * 0.3 + position.x * 0.05) * 1.5;
          pos.x += cos(uTime * 0.2 + position.y * 0.05) * 1.0;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.85);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // Connection lines between nearby particles
    // 优化：只对前 LINE_SAMPLE_COUNT 个粒子计算连线（300²/2 = 4.5 万次迭代，
    // 原 1800 全量为 162 万次）；连线 opacity 0.08，视觉无感
    const LINE_SAMPLE_COUNT = 300;
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });

    function buildLines() {
      const MAX_DIST = 20;
      const linePositions: number[] = [];
      for (let i = 0; i < LINE_SAMPLE_COUNT; i++) {
        for (let j = i + 1; j < LINE_SAMPLE_COUNT; j++) {
          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < MAX_DIST) {
            linePositions.push(
              positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
              positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
            );
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      return new THREE.LineSegments(lineGeo, lineMaterial);
    }

    const lines = buildLines();
    scene.add(lines);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ─── 渲染按需启停 ─────────────────────────────────────────────────────────
    // hero 滚出视口 / 标签页隐藏时停止 rAF；恢复时平滑续播（自维护时钟，
    // getDelta 累加并 clamp，避免暂停期间累积的时间导致跳帧）

    const clock = new THREE.Clock();
    let elapsed = 0;
    let rafId: number | null = null;
    let heroVisible = true;

    function tick() {
      elapsed += Math.min(clock.getDelta(), 0.1);
      particleMaterial.uniforms.uTime.value = elapsed;

      particles.rotation.y = elapsed * 0.03 + mouseX * 0.1;
      particles.rotation.x = mouseY * 0.05;
      lines.rotation.copy(particles.rotation);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    }

    function start() {
      if (rafId === null) {
        clock.getDelta(); // 丢弃暂停期间积累的 delta
        rafId = requestAnimationFrame(tick);
      }
    }

    function stop() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    start();

    new IntersectionObserver(
      (entries) => {
        heroVisible = entries[0].isIntersecting;
        heroVisible ? start() : stop();
      },
      { threshold: 0 },
    ).observe(document.getElementById('hero')!);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stop();
      } else if (heroVisible) {
        start();
      }
    });
  }

  // ─── GSAP Intro Animation ─────────────────────────────────────────────────

  const tl = gsap.timeline({ delay: 0.3 });

  tl.to('#hero-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    .to('#hero-name', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
    .to('.glitch-text', { opacity: 1, duration: 0.1 }, '-=0.8')
    .to('#hero-tags', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    .to('#hero-cta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    .to('#scroll-indicator', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');

  // ─── Typewriter Effect ────────────────────────────────────────────────────

  const phrases = [
    'AI-Augmented Developer',
    'Full-Stack Engineer',
    'Open Source Enthusiast',
    'Building with Claude Code',
    'Crafting the Future',
  ];

  const typer = document.getElementById('typewriter')!;
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED = 80;
  const DELETE_SPEED = 40;
  const PAUSE_DURATION = 2000;

  function type() {
    const phrase = phrases[phraseIdx % phrases.length];
    if (isDeleting) {
      typer.textContent = phrase.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx++;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    } else {
      typer.textContent = phrase.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_DURATION);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }

  // Start typing after the GSAP intro
  setTimeout(type, 1200);

  // Scroll indicator click
  document.getElementById('scroll-indicator')?.addEventListener('click', () => {
    document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
  });
```

- [ ] **Step 3: Hero.astro `<style>` 块末尾追加降级背景样式**

在 `@keyframes scrollBounce { ... }` 之后追加：

```css
  /* WebGL 降级：CSS 网格装饰背景（样式对齐 #profile 的 grid 装饰） */
  #hero.hero-fallback {
    background-image:
      linear-gradient(rgba(0, 255, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }
```

- [ ] **Step 4: 构建验证**

Run: `npm run build`
Expected: 退出码 0（无 TS/编译错误）

- [ ] **Step 5: 产物断言**

Run: `grep -c "hero-fallback" dist/index.html || true` 与 `grep -rl "IntersectionObserver" dist/_astro/*.js | head -1`
Expected: hero-fallback 出现在打包 js 或 html 中；IntersectionObserver 存在于某打包 js

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.astro
git commit -m "perf(hero): 连线降采样+渲染按需启停+WebGL 降级"
```

---

### Task 2: Projects Section（数据 + 组件 + 接线 + 编号顺延）

**Files:**
- Create: `src/data/projects.ts`
- Create: `src/components/ProjectsShowcase.astro`
- Modify: `src/pages/index.astro`（nav 数组、import、section 挂载、sections 高亮数组）
- Modify: `src/components/CoreProtocol.astro:66`（编号 04→05）
- Modify: `src/components/NetworkNode.astro:18`（编号 05→06）
- Modify: `src/components/quests/QuestsSummary.astro:19`（编号 06→07）
- Modify: `src/components/Signal.astro:19`（编号 07→08）

**Interfaces:**
- Consumes: 无
- Produces: `Project` 接口与 `projects` 数组（`src/data/projects.ts` 导出）；`#projects` section DOM（Task 3 的 nav、Task 8 的断言依赖）；`#projects .gsap-reveal` 动画契约

- [ ] **Step 1: 创建 `src/data/projects.ts`**

```ts
/**
 * @author Echo009
 * @since 2026-08-20
 */
export interface Project {
  /** 项目名（保留仓库原名） */
  name: string;
  /** HUD 风格英文标签 */
  tagline: string;
  /** 中文一两句描述 */
  description: string;
  /** 技术标签 */
  tech: string[];
  /** 仓库地址 */
  link: string;
  /** 可选强调色（CSS 变量或色值），缺省四色循环 */
  accent?: string;
}

export const projects: Project[] = [
  {
    name: 'Echo009 Homepage',
    tagline: 'YOU_ARE_HERE',
    description: '赛博朋克风格个人主页：Astro SSG + Three.js 粒子场 + GSAP 动效，含人生副本（Quest Log）与幻灯片站。',
    tech: ['Astro', 'Three.js', 'GSAP', 'Tailwind'],
    link: 'https://github.com/Echo009/Echo009',
  },
  {
    name: 'PowerJob-Docs',
    tagline: 'OPEN_SOURCE_DOCS',
    description: '参与 PowerJob 分布式任务调度中间件的文档建设与翻译。',
    tech: ['Vue', 'VitePress'],
    link: 'https://github.com/Echo009/PowerJob-Docs',
  },
  {
    name: 'Docker',
    tagline: 'CONTAINER_LAB',
    description: '容器化实践笔记：镜像构建、compose 编排与常用 shell 脚本沉淀。',
    tech: ['Docker', 'Shell'],
    link: 'https://github.com/Echo009/Docker',
  },
  {
    name: 'Algorithm-Practise',
    tagline: 'COMBAT_TRAINING',
    description: 'Java 数据结构与算法练习集，持续更新的刷题记录。',
    tech: ['Java', 'Algorithm'],
    link: 'https://github.com/Echo009/Algorithm-Practise',
  },
];
```

- [ ] **Step 2: 创建 `src/components/ProjectsShowcase.astro`**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-20
 */
import { projects } from '../data/projects';

const ACCENTS = ['var(--cyber-cyan)', 'var(--cyber-pink)', 'var(--cyber-purple)', 'var(--cyber-yellow)'];
const items = projects.map((p, i) => ({ ...p, accent: p.accent ?? ACCENTS[i % ACCENTS.length] }));
---

<section id="projects" class="py-24 px-6 relative">
  <!-- 背景装饰：斜向细线 -->
  <div
    class="absolute inset-0 opacity-[0.04] pointer-events-none"
    aria-hidden="true"
    style="background-image: repeating-linear-gradient(-45deg, var(--cyber-purple) 0 1px, transparent 1px 24px);"
  ></div>

  <div class="max-w-6xl mx-auto relative z-10">
    <!-- Section header -->
    <div class="mb-16 gsap-reveal">
      <p class="section-label mb-2">// SECTION_04</p>
      <h2 class="font-display font-bold text-4xl md:text-5xl text-white">
        PROJECT
        <span
          style="color: var(--cyber-purple); text-shadow: 0 0 10px #7b2fff, 0 0 30px #7b2fff66, 0 0 60px #7b2fff33;"
        >
          SHOWCASE
        </span>
      </h2>
      <div class="mt-3 h-px w-48" style="background: linear-gradient(90deg, var(--cyber-purple), transparent);"></div>
    </div>

    <!-- Cards grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {items.map((project) => (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          class="hud-panel hud-corner p-6 group flex flex-col gap-4 gsap-reveal transition-transform duration-300 hover:-translate-y-1"
          style={`border-color: ${project.accent}40; box-shadow: 0 0 15px ${project.accent}15;`}
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="section-label mb-1" style={`color: ${project.accent};`}>[ {project.tagline} ]</p>
              <h3 class="font-display font-bold text-xl text-white">{project.name}</h3>
            </div>
            <span
              class="font-mono text-xs opacity-40 group-hover:opacity-100 transition-opacity whitespace-nowrap"
              style={`color: ${project.accent};`}
            >
              VIEW_SOURCE ↗
            </span>
          </div>

          <p class="font-mono text-sm text-white/60 leading-relaxed">{project.description}</p>

          <div class="flex flex-wrap gap-2 mt-auto pt-2">
            {project.tech.map((t) => (
              <span class="font-mono text-xs px-2 py-0.5" style={`border: 1px solid ${project.accent}55; color: ${project.accent};`}>
                {t}
              </span>
            ))}
          </div>
        </a>
      ))}
    </div>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo(
    '#projects .gsap-reveal',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#projects', start: 'top 80%' },
    },
  );
</script>
```

- [ ] **Step 3: 接线 `src/pages/index.astro`（四处小改）**

1. frontmatter import 区加：
```astro
import ProjectsShowcase from '../components/ProjectsShowcase.astro';
```
2. nav links 数组在 `{ href: '#arsenal', label: 'ARSENAL' },` 之后插入：
```astro
        { href: '#projects', label: 'PROJECTS' },
```
3. `<main>` 中在 `<TechArsenal />` 与 `<CoreProtocol />` 之间插入：
```astro
    <ProjectsShowcase />
```
4. script 内 `const sections = ['hero', 'profile', 'arsenal', 'protocol', 'network', 'quests', 'signal'];` 改为：
```ts
  const sections = ['hero', 'profile', 'arsenal', 'projects', 'protocol', 'network', 'quests', 'signal'];
```

- [ ] **Step 4: 编号顺延（四个文件各一处文本）**

| 文件 | 原 | 改为 |
|------|----|------|
| `src/components/CoreProtocol.astro` | `// SECTION_04` | `// SECTION_05` |
| `src/components/NetworkNode.astro` | `// SECTION_05` | `// SECTION_06` |
| `src/components/quests/QuestsSummary.astro` | `// SECTION_06` | `// SECTION_07` |
| `src/components/Signal.astro` | `// SECTION_07 // FINAL_TRANSMISSION` | `// SECTION_08 // FINAL_TRANSMISSION` |

- [ ] **Step 5: 构建验证**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 6: 产物断言**

Run: `grep -c 'id="projects"' dist/index.html && grep -c 'VIEW_SOURCE' dist/index.html && grep -c 'SECTION_08' dist/index.html`
Expected: 三个计数均 ≥1（projects section 渲染、4 张卡、编号顺延生效）

- [ ] **Step 7: Commit**

```bash
git add src/data/projects.ts src/components/ProjectsShowcase.astro src/pages/index.astro src/components/CoreProtocol.astro src/components/NetworkNode.astro src/components/quests/QuestsSummary.astro src/components/Signal.astro
git commit -m "feat(projects): 新增 PROJECT SHOWCASE 精选项目区"
```

---

### Task 3: 移动端汉堡菜单

**Files:**
- Modify: `src/pages/index.astro`（nav 内加按钮、nav 后加抽屉、script 加 toggle、style 加过渡）

**Interfaces:**
- Consumes: Task 2 已在 nav 数组加 PROJECTS（抽屉链接列表与之保持一致）
- Produces: `#mobile-menu-btn`（aria-expanded toggle）、`#mobile-menu`（hidden↔flex 切换）、`.mobile-nav-link` 类

- [ ] **Step 1: nav 区域加汉堡按钮**

在 `<!-- Status indicator -->` 的 div 之前插入：

```astro
    <!-- Mobile menu button -->
    <button
      id="mobile-menu-btn"
      class="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
      aria-label="Open menu"
      aria-expanded="false"
      aria-controls="mobile-menu"
    >
      <span class="menu-line w-6 h-px" style="background: var(--cyber-cyan); box-shadow: var(--glow-cyan);"></span>
      <span class="menu-line w-6 h-px" style="background: var(--cyber-cyan); box-shadow: var(--glow-cyan);"></span>
      <span class="menu-line w-6 h-px" style="background: var(--cyber-cyan); box-shadow: var(--glow-cyan);"></span>
    </button>
```

- [ ] **Step 2: nav 之后、Nav backdrop div 之后加抽屉**

在 `<!-- Nav backdrop blur -->` 的 div 结束后插入：

```astro
  <!-- Mobile menu drawer -->
  <div
    id="mobile-menu"
    class="fixed inset-0 z-[60] hidden flex-col items-center justify-center gap-1 px-8"
    style="background: rgba(5,5,16,0.96); backdrop-filter: blur(8px);"
    role="dialog"
    aria-modal="true"
    aria-label="站点导航"
  >
    {[
      { href: '#profile', label: 'PROFILE' },
      { href: '#arsenal', label: 'ARSENAL' },
      { href: '#projects', label: 'PROJECTS' },
      { href: '#protocol', label: 'PROTOCOL' },
      { href: '#network', label: 'NETWORK' },
      { href: '#quests', label: 'QUESTS' },
      { href: '#signal', label: 'SIGNAL' },
      { href: '/slides', label: 'SLIDES' },
    ].map(({ href, label }) => (
      <a href={href} class="mobile-nav-link font-mono text-base tracking-widest text-white/70 hover:text-white py-3 transition-colors">
        {label}
      </a>
    ))}
    <p class="section-label mt-8" aria-hidden="true">// NAVIGATION_MENU</p>
  </div>
```

- [ ] **Step 3: `<style>` 块追加菜单线过渡**

```css
  .menu-line {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
```

- [ ] **Step 4: `<script>` 末尾追加 toggle 逻辑**

```ts
  // ─── Mobile menu ──────────────────────────────────────────────────────────

  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open: boolean) {
    if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenu.classList.toggle('flex', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    const lines = menuBtn.querySelectorAll('.menu-line');
    (lines[0] as HTMLElement).style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    (lines[1] as HTMLElement).style.opacity = open ? '0' : '';
    (lines[2] as HTMLElement).style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menuBtn?.addEventListener('click', () => setMenu(!mobileMenu?.classList.contains('flex')));
  mobileMenu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });
```

- [ ] **Step 5: 构建验证**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 6: 产物断言**

Run: `grep -c 'mobile-menu-btn' dist/index.html && grep -c 'mobile-nav-link' dist/index.html`
Expected: btn ≥1；mobile-nav-link ≥8

- [ ] **Step 7: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(nav): 移动端汉堡菜单与全屏抽屉导航"
```

---

### Task 4: Arsenal 图标升级（astro-icon + simple-icons）

**Files:**
- Modify: `package.json`（devDeps：`astro-icon`、`@iconify-json/simple-icons`）
- Modify: `src/components/TechArsenal.astro`（数据 icon 字段改 iconify 名、渲染改 `<Icon>`）

**Interfaces:**
- Consumes: 无
- Produces: tech 项渲染为内联 `<svg>`（Task 8 断言依赖 ≥18 个）

**图标名风险（决策 D13）**：simple-icons 名称需逐一验证。若 build 报 "Failed to load icon"，按备选链替换：`si:claude → si:anthropic`、`si:cursor`（无备选则用 `si:openai` 位）、`si:githubcopilot → si:githubactions`（仅形状近似，优先保 build 通过并在提交信息注明）。

- [ ] **Step 1: 安装依赖**

Run: `npm install -D astro-icon @iconify-json/simple-icons`
Expected: 退出码 0，package.json devDependencies 出现两项

- [ ] **Step 2: 改 TechArsenal frontmatter 数据**

`import` 区加：
```astro
import { Icon } from 'astro-icon/components';
```

`techGroups` 的 items 的 `icon` 字段从 emoji 改为 iconify 名（分组 `icon` 保留 emoji）：

```ts
const techGroups = [
  {
    id: 'ai',
    label: 'AI TOOLS',
    accent: '#00FFFF',
    icon: '🤖',
    items: [
      { name: 'Claude Code', icon: 'si:claude' },
      { name: 'Cursor', icon: 'si:cursor' },
      { name: 'GitHub Copilot', icon: 'si:githubcopilot' },
      { name: 'ChatGPT', icon: 'si:openai' },
    ],
  },
  {
    id: 'lang',
    label: 'LANGUAGES',
    accent: '#FF006E',
    icon: '⌨️',
    items: [
      { name: 'Java', icon: 'si:java' },
      { name: 'TypeScript', icon: 'si:typescript' },
      { name: 'Python', icon: 'si:python' },
      { name: 'Go', icon: 'si:go' },
    ],
  },
  {
    id: 'frontend',
    label: 'FRONTEND',
    accent: '#7B2FFF',
    icon: '🎨',
    items: [
      { name: 'React', icon: 'si:react' },
      { name: 'Vue.js', icon: 'si:vuedotjs' },
      { name: 'Next.js', icon: 'si:nextdotjs' },
      { name: 'Tailwind CSS', icon: 'si:tailwindcss' },
    ],
  },
  {
    id: 'backend',
    label: 'BACKEND & INFRA',
    accent: '#F5FF00',
    icon: '⚙️',
    items: [
      { name: 'Node.js', icon: 'si:nodedotjs' },
      { name: 'Spring', icon: 'si:spring' },
      { name: 'PostgreSQL', icon: 'si:postgresql' },
      { name: 'Redis', icon: 'si:redis' },
      { name: 'Docker', icon: 'si:docker' },
      { name: 'Kubernetes', icon: 'si:kubernetes' },
    ],
  },
];
```

- [ ] **Step 3: 改 items 渲染（`<li>` 一处）**

原：
```astro
            {group.items.map((item) => (
              <li class="flex items-center gap-3 font-mono text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                <span class="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
```

改为（外层 span 控制颜色，Icon 继承 currentColor）：
```astro
            {group.items.map((item) => (
              <li class="flex items-center gap-3 font-mono text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                <span class="flex items-center justify-center w-5 h-5 shrink-0" style={`color: ${group.accent};`}>
                  <Icon name={item.icon} class="w-full h-full" />
                </span>
                <span>{item.name}</span>
              </li>
            ))}
```

- [ ] **Step 4: 构建验证（图标名逐一验证点）**

Run: `npm run build`
Expected: 退出码 0。若报 `Failed to load icon "si:xxx"`：按备选链替换后重跑，直到通过；最终把实际使用的图标名写进提交信息

- [ ] **Step 5: 产物断言**

Run: `node -e "const h=require('fs').readFileSync('dist/index.html','utf8');const s=h.slice(h.indexOf('id=\"arsenal\"'),h.indexOf('id=\"projects\"'));console.log('svg count:',(s.match(/<svg/g)||[]).length)"`
Expected: `svg count: 18`（≥18 即通过）

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/components/TechArsenal.astro
git commit -m "feat(arsenal): 技术图标升级为 simple-icons 品牌 SVG"
```

---

### Task 5: SEO 基础补全（meta / sitemap / robots / site 修正）

**Files:**
- Modify: `package.json`（devDeps：`@astrojs/sitemap`）
- Modify: `astro.config.mjs`（site 改域名 + sitemap 集成）
- Modify: `src/layouts/Layout.astro`（lang、canonical、og/twitter meta）
- Create: `public/robots.txt`

**Interfaces:**
- Consumes: 无
- Produces: `canonical`（绝对 URL，供 og:url 同值）；`public/og.png` 由 Task 6 生成、本任务的 meta 先行引用（构建不校验文件存在，无顺序风险）

- [ ] **Step 1: 安装依赖**

Run: `npm install -D @astrojs/sitemap`
Expected: 退出码 0

- [ ] **Step 2: 改 `astro.config.mjs`**

import 区加：
```js
import sitemap from '@astrojs/sitemap';
```
`site: 'https://echo009.github.io',` 改为：
```js
  site: 'https://me.echo0.cn',
```
`integrations: [tailwind()],` 改为：
```js
  integrations: [tailwind(), sitemap()],
```

- [ ] **Step 3: 改 `src/layouts/Layout.astro` frontmatter 与 head**

frontmatter（Props 解构之后）加：
```ts
const site = Astro.site ?? new URL('https://me.echo0.cn');
const canonical = new URL(Astro.url.pathname, site).href;
const ogImage = new URL('/og.png', site).href;
```

`<html lang="en" class="scroll-smooth">` 改为：
```astro
<html lang="zh-CN" class="scroll-smooth">
```

`<!-- Open Graph -->` 注释块整体替换为：
```astro
    <!-- Canonical -->
    <link rel="canonical" href={canonical} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:site_name" content="Echo009" />
    <meta property="og:image" content={ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />
```

- [ ] **Step 4: 创建 `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://me.echo0.cn/sitemap-index.xml
```

- [ ] **Step 5: 构建验证**

Run: `npm run build`
Expected: 退出码 0；构建日志出现 sitemap 生成信息

- [ ] **Step 6: 产物断言**

Run: `ls dist/sitemap-index.xml dist/robots.txt && grep -o 'lang="zh-CN"' dist/index.html | head -1 && grep -c 'rel="canonical"' dist/index.html`
Expected: 两个文件存在；lang="zh-CN"；canonical ≥1

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs src/layouts/Layout.astro public/robots.txt
git commit -m "feat(seo): canonical/og/twitter meta、sitemap、robots 与域名修正"
```

---

### Task 6: og:image 生成脚本

**Files:**
- Modify: `package.json`（devDeps：`satori`、`@resvg/resvg-js`、`@fontsource/orbitron`、`@fontsource/share-tech-mono`；scripts 加 `og:generate`）
- Create: `scripts/generate-og.mjs`
- Create: `public/og.png`（脚本产物，入库）

**Interfaces:**
- Consumes: Task 5 的 meta 已引用 `/og.png`
- Produces: `public/og.png`（1200×630）；`npm run og:generate` 命令

**字体风险（决策 D11）**：脚本从 `node_modules/@fontsource/*/files/*.woff` 读字体（satori 支持 woff）。实现时先 `ls node_modules/@fontsource/orbitron/files/` 确认存在 `orbitron-latin-900-normal.woff`；若仅有 `.woff2`，则将脚本字体路径改为从 `https://fonts.gstatic.com` 下载的 TTF（一次性手工下载到 `scripts/assets/` 并入库，脚本读本地文件）。

- [ ] **Step 1: 安装依赖**

Run: `npm install -D satori @resvg/resvg-js @fontsource/orbitron @fontsource/share-tech-mono`
Expected: 退出码 0

- [ ] **Step 2: 确认字体文件存在**

Run: `ls node_modules/@fontsource/orbitron/files/ | grep -E "900.*woff$"` 与 `ls node_modules/@fontsource/share-tech-mono/files/ | grep -E "400.*woff$"`
Expected: 各列出一个 `.woff`（非 woff2）文件名。若空 → 走任务说明的 TTF fallback，调整 Step 3 脚本中两个 `loadFont` 路径

- [ ] **Step 3: 创建 `scripts/generate-og.mjs`**

```js
/**
 * @author Echo009
 * @since 2026-08-20
 *
 * 一次性生成 public/og.png（1200x630 分享预览图，赛博朋克风格）。
 * 重跑：npm run og:generate（修改风格后重新生成并提交产物）。
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { cwd } from 'node:process';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const W = 1200;
const H = 630;

const loadFont = (rel) => readFile(path.join(cwd(), 'node_modules', rel));

const orbitron900 = await loadFont(
  '@fontsource/orbitron/files/orbitron-latin-900-normal.woff',
);
const techMono = await loadFont(
  '@fontsource/share-tech-mono/files/share-tech-mono-latin-400-normal.woff',
);

const element = {
  type: 'div',
  props: {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#050510',
      position: 'relative',
    },
    children: [
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #00ffff, #ff006e, #f5ff00, #7b2fff)',
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #7b2fff, #f5ff00, #ff006e, #00ffff)',
          },
        },
      },
      {
        type: 'div',
        props: {
          style: {
            color: '#00ffff',
            fontFamily: 'Share Tech Mono',
            fontSize: 28,
            letterSpacing: 8,
            marginBottom: 24,
          },
          children: '// AI-AUGMENTED DEVELOPER',
        },
      },
      {
        type: 'div',
        props: {
          style: {
            color: '#ffffff',
            fontFamily: 'Orbitron',
            fontWeight: 900,
            fontSize: 160,
            lineHeight: 1,
          },
          children: 'Echo009',
        },
      },
      {
        type: 'div',
        props: {
          style: {
            color: 'rgba(255,255,255,0.4)',
            fontFamily: 'Share Tech Mono',
            fontSize: 24,
            letterSpacing: 6,
            marginTop: 32,
          },
          children: 'me.echo0.cn',
        },
      },
    ],
  },
};

const svg = await satori(element, {
  width: W,
  height: H,
  fonts: [
    { name: 'Orbitron', data: orbitron900, weight: 900, style: 'normal' },
    { name: 'Share Tech Mono', data: techMono, weight: 400, style: 'normal' },
  ],
});

const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
await writeFile(path.join(cwd(), 'public', 'og.png'), png);
console.log('✅ public/og.png generated (1200x630)');
```

- [ ] **Step 4: package.json scripts 加命令**

```json
    "og:generate": "node scripts/generate-og.mjs"
```

- [ ] **Step 5: 运行生成**

Run: `npm run og:generate`
Expected: 输出 `✅ public/og.png generated (1200x630)`；`public/og.png` 存在且 >10KB

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json scripts/generate-og.mjs public/og.png
git commit -m "feat(seo): og:image 生成脚本与预览图产物"
```

---

### Task 7: NetworkNode 第三方图兜底

**Files:**
- Modify: `src/components/NetworkNode.astro`（两张图各加 onerror + 占位 span）

**Interfaces:**
- Consumes: 无
- Produces: 无（独立小改动）

- [ ] **Step 1: streak-stats 图加兜底**

原 `<img ... loading="lazy" />`（streak 图）加 `onerror` 属性，并在其后加占位：

```astro
          <img
            src="https://streak-stats.demolab.com?user=Echo009&theme=tokyonight&hide_border=true&background=050510&stroke=00FFFF&ring=FF006E&fire=FF006E&currStreakLabel=00FFFF&dates=7B2FFF&sideLabels=00FFFF"
            alt="GitHub Streak Stats"
            class="max-w-full mx-auto block"
            style="min-height: 140px;"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
          />
          <span class="font-mono text-xs opacity-40 block mx-auto py-10" style="display:none;">
            [ SIGNAL_OFFLINE — EXTERNAL_FEED_UNAVAILABLE ]
          </span>
```

- [ ] **Step 2: contribution snake 图加兜底**

`<picture>` 内的 `<img ... loading="lazy" />` 同样加 `onerror`，并在 `</picture>` 之后加占位：

```astro
            <img
              src="https://raw.githubusercontent.com/Echo009/Echo009/output/github-contribution-grid-snake-dark.svg"
              alt="GitHub contribution grid snake animation"
              class="max-w-full mx-auto block"
              loading="lazy"
              onerror="this.style.display='none';this.closest('picture').nextElementSibling.style.display='block'"
            />
          </picture>
          <span class="font-mono text-xs opacity-40 block mx-auto py-10" style="display:none;">
            [ SIGNAL_OFFLINE — EXTERNAL_FEED_UNAVAILABLE ]
          </span>
```

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 退出码 0

- [ ] **Step 4: 产物断言**

Run: `grep -c 'SIGNAL_OFFLINE' dist/index.html`
Expected: ≥2

- [ ] **Step 5: Commit**

```bash
git add src/components/NetworkNode.astro
git commit -m "feat(network): 外部统计图加载失败兜底"
```

---

### Task 8: 验收脚本与全量验证

**Files:**
- Create: `scripts/verify-homepage.mjs`
- Modify: `package.json`（scripts 加 `verify:homepage`）

**Interfaces:**
- Consumes: Task 1-7 全部产物（dist 与源码）
- Produces: 验收结果（exit code 0 = 全过）

- [ ] **Step 1: 创建 `scripts/verify-homepage.mjs`**

```js
/**
 * @author Echo009
 * @since 2026-08-20
 *
 * 主页优化验收断言（需先 npm run build）：
 *   node scripts/verify-homepage.mjs
 * 全部通过 exit 0；任一失败 exit 1。
 */
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

let pass = 0;
let fail = 0;
function check(name, cond, detail = '') {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`);
  }
}

const dist = (p) => path.join(cwd(), 'dist', p);
const html = await readFile(dist('index.html'), 'utf8');

console.log('— AC5: Projects section —');
check('id="projects" 存在', /id="projects"/.test(html));
check('≥4 张项目卡（github.com/Echo009 链接）', (html.match(/https:\/\/github\.com\/Echo009\//g) || []).length >= 4);
check('桌面 nav 含 PROJECTS 链接', /href="#projects"[^>]*>\s*PROJECTS/.test(html));

console.log('— AC6: SEO meta —');
check('lang="zh-CN"', /<html[^>]*lang="zh-CN"/.test(html));
check('canonical 指向 me.echo0.cn', /rel="canonical" href="https:\/\/me\.echo0\.cn\/"/.test(html));
check('og:image 指向 og.png', /property="og:image" content="https:\/\/me\.echo0\.cn\/og\.png"/.test(html));
check('twitter:card summary_large_image', /name="twitter:card" content="summary_large_image"/.test(html));

console.log('— AC7: sitemap / robots —');
check('sitemap-index.xml 存在', existsSync(dist('sitemap-index.xml')));
const robots = existsSync(dist('robots.txt')) ? await readFile(dist('robots.txt'), 'utf8') : '';
check('robots.txt 指向 sitemap', /Sitemap:\s*https:\/\/me\.echo0\.cn\/sitemap-index\.xml/.test(robots));

console.log('— AC8: Arsenal 品牌图标 —');
const arsenalStart = html.indexOf('id="arsenal"');
const arsenalEnd = html.indexOf('id="projects"');
const arsenal = html.slice(arsenalStart, arsenalEnd);
check('arsenal 区块 ≥18 个内联 svg', (arsenal.match(/<svg/g) || []).length >= 18, `实际 ${(arsenal.match(/<svg/g) || []).length}`);

console.log('— AC9: 移动端菜单 —');
check('汉堡按钮存在', /id="mobile-menu-btn"/.test(html));
check('aria-controls 关联', /aria-controls="mobile-menu"/.test(html));
check('抽屉链接 ≥8', (html.match(/mobile-nav-link/g) || []).length >= 8);

console.log('— AC2/3/4: Hero 性能（源码断言） —');
const heroSrc = await readFile(path.join(cwd(), 'src', 'components', 'Hero.astro'), 'utf8');
check('连线采样 300', /LINE_SAMPLE_COUNT\s*=\s*300/.test(heroSrc));
check('buildLines 循环上限为采样量', /j < LINE_SAMPLE_COUNT/.test(heroSrc));
check('IntersectionObserver 启停', /IntersectionObserver/.test(heroSrc));
check('visibilitychange 处理', /visibilitychange/.test(heroSrc));
check('WebGL 降级 hero-fallback', /hero-fallback/.test(heroSrc));

console.log('— AC10: NetworkNode 兜底 —');
const networkSrc = await readFile(path.join(cwd(), 'src', 'components', 'NetworkNode.astro'), 'utf8');
check('两处 onerror 兜底', (networkSrc.match(/onerror=/g) || []).length >= 2);

console.log('— AC1: 构建产物完整性 —');
check('og.png 存在', existsSync(dist('og.png')));

console.log(`\n结果：${pass} 通过 / ${fail} 失败`);
process.exit(fail === 0 ? 0 : 1);
```

- [ ] **Step 2: package.json scripts 加命令**

```json
    "verify:homepage": "node scripts/verify-homepage.mjs"
```

- [ ] **Step 3: 全量构建并验证**

Run: `npm run build && npm run verify:homepage`
Expected: build 退出码 0；verify 输出全部 ✅，`0 失败`，exit 0

- [ ] **Step 4: 若有失败项——修复后重跑（上限 3 轮，走 systematic-debugging）**

- [ ] **Step 5: Commit**

```bash
git add scripts/verify-homepage.mjs package.json
git commit -m "chore: 主页优化验收断言脚本"
```

---

## 任务依赖与执行顺序

顺序执行 Task 1 → 8（Task 2/3 同改 `index.astro` 必须串行；Task 4/5/6 虽理论可并行，但都触碰 `package.json`/npm install，串行最稳）。Task 8 依赖全部前置任务。
