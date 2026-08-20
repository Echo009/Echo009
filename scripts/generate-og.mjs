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
