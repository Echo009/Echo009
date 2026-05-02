#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SLIDES_SOURCE="$ROOT_DIR/slides-source"
CONTENT_DIR="$SLIDES_SOURCE/content"
OUTPUT_BASE="$ROOT_DIR/public/slides"

echo "==> Building slides..."

# 确保 slides-source 依赖已安装
cd "$SLIDES_SOURCE"
if [ ! -d "node_modules" ]; then
  echo "  Installing slides dependencies..."
  npm install
fi

# 清理旧的构建产物
rm -rf "$OUTPUT_BASE"
mkdir -p "$OUTPUT_BASE"

# 遍历所有 .md 文件并构建
built_count=0
for md_file in "$CONTENT_DIR"/*.md; do
  [ -f "$md_file" ] || continue

  slug="$(basename "$md_file" .md)"
  echo "  Building: $slug..."

  # 使用绝对路径避免路径解析问题
  npx slidev build "$md_file" --out "$OUTPUT_BASE/$slug" --base "/slides/$slug/"

  # 从 frontmatter 提取元数据生成 meta.json
  meta_file="$OUTPUT_BASE/$slug/meta.json"

  # 使用 node 解析 frontmatter
  node -e "
    const fs = require('fs');
    const content = fs.readFileSync('$md_file', 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    const meta = {};
    if (match) {
      match[1].split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
      });
    }
    const output = {
      title: meta.title || '$slug',
      date: meta.date || '',
      description: meta.description || '',
      cover: meta.cover || ''
    };
    fs.writeFileSync('$meta_file', JSON.stringify(output, null, 2));
  " 2>/dev/null || echo "{\"title\":\"$slug\",\"date\":\"\",\"description\":\"\",\"cover\":\"\"}" > "$meta_file"

  built_count=$((built_count + 1))
done

echo "==> Built $built_count slide(s) to $OUTPUT_BASE"
