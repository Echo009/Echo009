// 赛博朋克主题全局样式
// 复用主页 CSS 变量体系

export default `
:root {
  --cyber-black: #050510;
  --cyber-deep: #0a0a1a;
  --cyber-cyan: #00ffff;
  --cyber-pink: #ff006e;
  --cyber-yellow: #f5ff00;
  --cyber-purple: #7b2fff;
  --cyber-dim-cyan: #00ffff33;
  --cyber-dim-pink: #ff006e33;

  --glow-cyan: 0 0 10px #00ffff, 0 0 30px #00ffff66, 0 0 60px #00ffff33;
  --glow-pink: 0 0 10px #ff006e, 0 0 30px #ff006e66, 0 0 60px #ff006e33;
}

.slidev-layout {
  background-color: var(--cyber-black);
  color: #e0e0e0;
  font-family: 'Share Tech Mono', monospace;
  padding: 2rem 3rem;
  position: relative;
}

/* 扫描线叠加 */
.slidev-layout::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
}

.slidev-layout h1,
.slidev-layout h2,
.slidev-layout h3 {
  font-family: 'Orbitron', monospace;
  color: var(--cyber-cyan);
  text-shadow: var(--glow-cyan);
}

.slidev-layout h1 {
  font-size: 2.5rem;
  font-weight: 900;
}

.slidev-layout h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

.slidev-layout h3 {
  font-size: 1.3rem;
  font-weight: 400;
}

.slidev-layout p {
  line-height: 1.7;
  font-size: 1rem;
}

.slidev-layout a {
  color: var(--cyber-cyan);
  text-decoration: none;
  text-shadow: 0 0 8px #00ffff88;
  transition: color 0.2s ease;
}

.slidev-layout a:hover {
  color: var(--cyber-pink);
  text-shadow: 0 0 8px #ff006e88;
}

.slidev-layout code {
  font-family: 'Share Tech Mono', monospace;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.15);
  padding: 0.15em 0.4em;
  border-radius: 3px;
  color: var(--cyber-cyan);
  font-size: 0.9em;
}

.slidev-layout pre {
  background: var(--cyber-deep) !important;
  border: 1px solid rgba(0, 255, 255, 0.12);
  border-radius: 6px;
  padding: 1rem;
}

.slidev-layout pre code {
  background: none;
  border: none;
  padding: 0;
}

.slidev-layout ul,
.slidev-layout ol {
  padding-left: 1.5rem;
}

.slidev-layout li {
  margin: 0.4rem 0;
  line-height: 1.6;
}

.slidev-layout li::marker {
  color: var(--cyber-cyan);
}

.slidev-layout strong {
  color: var(--cyber-yellow);
  text-shadow: 0 0 8px #f5ff0066;
}

.slidev-layout blockquote {
  border-left: 3px solid var(--cyber-pink);
  padding-left: 1rem;
  color: #b0b0b0;
  font-style: italic;
}

/* HUD 面板边框效果 */
.slidev-layout .hud-panel {
  border: 1px solid var(--cyber-cyan);
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(0, 10, 30, 0.8) 100%);
  box-shadow: 0 0 20px var(--cyber-dim-cyan), inset 0 0 20px rgba(0, 255, 255, 0.02);
  padding: 1.5rem;
  border-radius: 4px;
}

/* 表格样式 */
.slidev-layout table {
  width: 100%;
  border-collapse: collapse;
}

.slidev-layout th {
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.2);
  padding: 0.6rem 1rem;
  text-align: left;
  color: var(--cyber-cyan);
  font-family: 'Orbitron', monospace;
  font-size: 0.85rem;
}

.slidev-layout td {
  border: 1px solid rgba(0, 255, 255, 0.1);
  padding: 0.5rem 1rem;
}

.slidev-layout tr:nth-child(even) {
  background: rgba(0, 255, 255, 0.02);
}
`
