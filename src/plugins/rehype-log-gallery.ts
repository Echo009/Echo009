/**
 * @author Echo009
 * @since 2026-08-19
 * 将 md 中「仅由图片构成」的段落改写为 .log-gallery 容器，
 * 连续写在同一段落的多张图片聚合成网格画廊。
 */

type Node = { type: string; tagName?: string; value?: string; children?: Node[]; properties?: Record<string, unknown> };

export function rehypeLogGallery() {
  return (tree: Node) => {
    for (const p of tree.children ?? []) {
      if (p.type !== 'element' || p.tagName !== 'p') continue;
      const meaningful = (p.children ?? []).filter(
        (c) => !(c.type === 'text' && !(c.value ?? '').trim()),
      );
      if (meaningful.length === 0) continue;
      const allImages = meaningful.every(
        (c) => c.type === 'element' && c.tagName === 'img',
      );
      if (!allImages) continue;
      p.tagName = 'div';
      p.properties = {
        ...(p.properties ?? {}),
        className: ['log-gallery', `log-gallery-${Math.min(meaningful.length, 3)}`],
      };
      p.children = meaningful;
    }
  };
}
