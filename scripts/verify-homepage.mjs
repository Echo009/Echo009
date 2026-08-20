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
const projectsStart = html.indexOf('id="projects"');
const projectsEnd = html.indexOf('id="protocol"');
const projectsBlock = html.slice(projectsStart, projectsEnd);
check('PowerJob 项目卡渲染', /PowerJob/.test(projectsBlock) && /VIEW_SOURCE/.test(projectsBlock));
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

console.log('— AC2/3/4: Hero 性能（源码断言；连线为全量粒子——2026-08-20 用户反馈恢复） —');
const heroSrc = await readFile(path.join(cwd(), 'src', 'components', 'Hero.astro'), 'utf8');
check('buildLines 循环覆盖全部粒子', /j < PARTICLE_COUNT/.test(heroSrc) && !/LINE_SAMPLE_COUNT/.test(heroSrc));
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