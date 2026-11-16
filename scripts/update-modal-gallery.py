"""Embed concept art and a separate implementation screenshot collection."""
import base64
import hashlib
import html
import json
import re
import struct
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs'
ART = DOCS / '美术参考'
TARGET = DOCS / '界面效果图合集.html'


def main():
    source = TARGET.read_text(encoding='utf-8')
    original_images = re.findall(r'<img src="([^"]+)"', source)[:4]
    # Replace the generated dungeon card on reruns; leave the four approved pages intact.
    source = re.sub(r'<!-- DUNGEON START -->.*?<!-- DUNGEON END -->', '', source, flags=re.S)
    data = (ART / '副本界面概念-v2.png').read_bytes()
    width, height = struct.unpack('>II', data[16:24])
    encoded = base64.b64encode(data).decode('ascii')
    dungeon = f'<!-- DUNGEON START --><article class="card" id="dungeon"><div class="card-head"><div><h2>副本<span>v2</span></h2><p>{width} × {height}</p></div><span class="badge">当前方案</span></div><button class="preview" aria-label="放大查看副本页"><img loading="lazy" decoding="async" src="data:image/png;base64,{encoded}" alt="副本页效果图 v2"></button><footer>副本界面概念-v2.png<span>点击放大 ↗</span></footer></article><!-- DUNGEON END -->'
    source = re.sub(r'(<section id="pages".*?)(</section>)', lambda m: m[1] + dungeon + m[2], source, count=1, flags=re.S)
    source = source.replace('aria-label="三个页面效果图"', 'aria-label="页面效果图"')
    entries = [('装备详情 · 通用底板', '通用装备弹窗概念-v1.png')]
    entries += [(m['name'], m['file']) for m in json.loads(
        (ART / '弹窗效果图-提示词.json').read_text(encoding='utf-8'))]
    entries.append(('副本挑战 · 弹窗内选择难度', '弹窗-副本挑战-v1.png'))
    cards = []
    for title, filename in entries:
        data = (ART / filename).read_bytes()
        assert data[:8] == b'\x89PNG\r\n\x1a\n'
        width, height = struct.unpack('>II', data[16:24])
        title, filename = html.escape(title), html.escape(filename)
        encoded = base64.b64encode(data).decode('ascii')
        cards.append(f'<article class="card"><div class="card-head"><div><h2>{title}<span>v1</span></h2><p>{width} × {height}</p></div><span class="badge">视觉概念</span></div><button class="preview" aria-label="放大查看{title}"><img loading="lazy" decoding="async" src="data:image/png;base64,{encoded}" alt="{title}弹窗效果图 v1"></button><footer>{filename}<span>点击放大 ↗</span></footer></article>')
    block = '<!-- MODALS START --><section id="modals" class="collection"><h2 class="section-title">通用弹窗 <span>14 张 · 统一暖金底板</span></h2><p class="intro">复用装备详情的外框、标题牌、关闭按钮和内容分区。示例文案与数值用于视觉排版，不代表新增玩法或最终平衡。</p><div class="grid">' + '\n'.join(cards) + '</div></section><!-- MODALS END -->'
    source = re.sub(r'<!-- MODALS START -->.*?<!-- MODALS END -->', '', source, flags=re.S)
    source = re.sub(r'<!-- IMPLEMENTED START -->.*?<!-- IMPLEMENTED END -->', '', source, flags=re.S)
    screenshots = [
        ('副本胜利结算', '副本-胜利结算.png'),
        ('副本失败结算', '副本-失败结算.png'),
        ('无尽挑战结算', '副本-无尽结算.png'),
    ]
    runtime_cards = []
    for title, filename in screenshots:
        data = (DOCS / '验证截图' / filename).read_bytes()
        # Browser captures can contain JPEG bytes despite their legacy .png filenames.
        with Image.open(DOCS / '验证截图' / filename) as image:
            width, height = image.size
            mime = Image.MIME[image.format]
            image.verify()
        encoded = base64.b64encode(data).decode('ascii')
        title, filename = html.escape(title), html.escape(filename)
        runtime_cards.append(f'<article class="card"><div class="card-head"><div><h2>{title}</h2><p>{width} × {height} · 2026.11.15</p></div><span class="badge">实装截图</span></div><button class="preview" aria-label="放大查看{title}实装截图"><img loading="lazy" decoding="async" src="data:{mime};base64,{encoded}" alt="{title} · 实装效果"></button><footer>验证截图/{filename}<span>点击放大 ↗</span></footer></article>')
    implemented = '<!-- IMPLEMENTED START --><section id="implemented" class="collection"><h2 class="section-title">实装效果 <span>3 张 · 副本战斗结算</span></h2><p class="intro">以下为 2026.11.15 游戏运行验证截图，展示实际结算界面，与上方概念图区分。胜利、失败与无尽挑战均使用独立测试存档；数值用于测试，不代表最终平衡。截图按各自原始比例展示。</p><div class="grid">' + '\n'.join(runtime_cards) + '</div></section><!-- IMPLEMENTED END -->'
    source = source.replace('</main>', block + implemented + '</main>')
    source = source.replace('<section class="grid"', '<section id="pages" class="grid"', 1)
    if 'class="jump"' not in source:
        source = source.replace('</header>', '</header><nav class="jump" aria-label="效果图分类"><a href="#pages">页面效果图 · 4</a><a href="#modals">通用弹窗 · 13</a></nav>', 1)
    source = re.sub(r'<p class="intro">.*?</p>', '<p class="intro">概念图与实装效果分区收录。点击图片放大查看，支持原始尺寸与离线浏览。</p>', source, count=1)
    source = re.sub(r'<nav class="jump".*?</nav>', '<nav class="jump" aria-label="效果图分类"><a href="#pages">页面概念图 · 5</a><a href="#dungeon">副本页 v2</a><a href="#modals">弹窗概念图 · 14</a><a href="#implemented">实装效果 · 3</a></nav>', source, count=1, flags=re.S)
    source = re.sub(r'<div class="date">.*?</div>', '<div class="date">更新于 2026.11.16</div>', source, count=1)
    source = re.sub(r'<p class="note">.*?</p>', '<p class="note">原页面图保持不变；图片按原始宽高比展示，不裁切、不拉伸。全部图片已内嵌，可离线打开或单独分享此 HTML。弹窗统一右上角关闭，支持点击空白处关闭；底部只放玩法操作。</p>', source, count=1)
    if '.collection{' not in source:
        source = source.replace('</style>', '.jump{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 24px}.jump a{background:#fff8e9;color:#805129;border:1px solid #ead5b3;border-radius:30px;padding:10px 18px;text-decoration:none;font-size:14px}.collection{margin-top:44px;scroll-margin-top:20px}.section-title{font-size:25px;margin-bottom:10px}.collection>.intro{margin-bottom:24px}.section-title span{font-size:14px}html{scroll-behavior:smooth}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style>', 1)
    assert re.findall(r'<img src="([^"]+)"', source)[:4] == original_images, 'Existing page images changed'
    TARGET.write_text(source, encoding='utf-8')
    images = re.findall(r'<img[^>]+src="data:image/(?:png|jpeg);base64,([^"]+)"', source)
    assert len(images) == 22, len(images)
    for encoded in images[:19]:
        assert base64.b64decode(encoded, validate=True)[:8] == b'\x89PNG\r\n\x1a\n'
    print(f'Validated {len(images)} embedded images; {TARGET.stat().st_size / 1024 / 1024:.1f} MiB')
    print('Existing page image hashes: ' + ', '.join(hashlib.sha256(s.encode()).hexdigest()[:12] for s in original_images))


if __name__ == '__main__':
    main()
