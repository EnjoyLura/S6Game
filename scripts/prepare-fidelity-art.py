"""Rebuild production assets from the retained, independently generated source art.

No concept screenshot is used as a runtime texture. Preserve alpha in hero cells.
Run from any directory: python scripts/prepare-fidelity-art.py
"""
from pathlib import Path
from shutil import copyfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/美术参考/第二版'
DEST = ROOT / 'assets/resources/art'
for source, target in [
    ('招募场景-精校-v1.png', 'v2-summon-scene.png'),
    ('锻造场景-精校-v1.png', 'v2-forge-scene.png'),
    ('导航图标-精校-v1.png', 'v2-navigation-polished.png'),
]:
    copyfile(SOURCE / source, DEST / target)

sheet = Image.open(SOURCE / '四英雄-精校-v1.png').convert('RGBA')
assert sheet.width == sheet.height and sheet.width % 2 == 0
assert sheet.getextrema()[3][0] == 0, 'Hero source must retain genuine transparency'
cell = sheet.width // 2
for i, name in enumerate(['knight', 'mage', 'priest', 'archer']):
    x, y = i % 2 * cell, i // 2 * cell
    sprite = sheet.crop((x, y, x + cell, y + cell))
    bounds = sprite.getchannel('A').point(lambda a: 255 if a > 24 else 0).getbbox()
    assert bounds, name
    sprite = sprite.crop(bounds)
    sprite.thumbnail((540, 540), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (640, 640))
    canvas.alpha_composite(sprite, ((640 - sprite.width)//2, (640 - sprite.height)//2))
    canvas.save(DEST / f'v2-hero-{name}.png', optimize=True)
print('Prepared 3 scene/icon textures and 4 transparent hero textures')

# Second precision pass: standalone forest and reusable text-free UI decorations.
for source, target in [('战斗森林-精校-v2.png', 'v2-battle-forest.png'), ('票券与共用资源-精校-v2.png', 'v2-resource-symbols.png')]:
    copyfile(SOURCE / source, DEST / target)
decor = Image.open(SOURCE / '标题装饰与UP标签-精校-v2.png').convert('RGBA')
cell = decor.width // 2
for i, name in enumerate(['recruit-title', 'up-badge', 'title-plaque', 'celebration']):
    sprite = decor.crop((i % 2 * cell, i // 2 * cell, (i % 2 + 1) * cell, (i // 2 + 1) * cell))
    bounds = sprite.getchannel('A').point(lambda a: 255 if a > 48 else 0).getbbox()
    assert bounds, name
    sprite.crop(bounds).save(DEST / f'v2-{name}.png', optimize=True)
print('Prepared standalone battle forest, resource atlas and 4 title/tag decorations')

# The wide title uses more than half the sheet; preserve the actual generated layout.
detail = Image.open(SOURCE / '弹窗标题关闭与嫩芽-v3.png').convert('RGBA')
w, h = detail.size
for name, box in [
    ('title-plaque', (0, 0, .62, .5)), ('close', (.62, 0, 1, .5)),
    ('sprout-left', (0, .5, .5, 1)), ('sprout-right', (.5, .5, 1, 1)),
]:
    sprite = detail.crop(tuple(round(v * (w if i % 2 == 0 else h)) for i, v in enumerate(box)))
    bounds = sprite.getchannel('A').point(lambda a: 255 if a > 48 else 0).getbbox()
    assert bounds, name
    sprite = sprite.crop(bounds)
    if name.startswith('sprout'):
        # Put the painted stem tip at bottom-centre, without squeezing the leaves.
        alpha = sprite.getchannel('A')
        tip = [x for y in range(max(0, sprite.height - 3), sprite.height) for x in range(sprite.width) if alpha.getpixel((x, y)) > 48]
        root = round(sum(tip) / len(tip))
        half = max(root, sprite.width - root)
        aligned = Image.new('RGBA', (half * 2, sprite.height))
        aligned.alpha_composite(sprite, (half - root, 0))
        sprite = aligned
    sprite.save(DEST / f'v2-{name}-v3.png', optimize=True)
print('Prepared undistorted title, close button and stem-anchored sprouts')
copyfile(SOURCE / 'UP招募独立背景-v3.png', DEST / 'v2-up-scene-v3.png')

# Identical normalized files are used by Cocos Sprite and the DOM resource labels.
symbols = Image.open(DEST / 'v2-resource-symbols.png').convert('RGBA')
cell = symbols.width // 3
for i, name in [(6, 'heart'), (7, 'shield')]:
    sprite = symbols.crop((i % 3 * cell, i // 3 * cell, (i % 3 + 1) * cell, (i // 3 + 1) * cell))
    sprite = sprite.crop(sprite.getchannel('A').point(lambda a: 255 if a > 32 else 0).getbbox())
    sprite.thumbnail((243, 243), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (256, 256))
    canvas.alpha_composite(sprite, ((256 - sprite.width)//2, (256 - sprite.height)//2))
    canvas.save(DEST / f'v2-status-{name}.png', optimize=True)
print('Prepared shared battlefield and party status icons')

# Recruitment owns its lighter header; keep reward decoration independent.
title = Image.open(SOURCE / '招募结果艺术字-v6.png').convert('RGBA')
bounds = title.getchannel('A').point(lambda a: 255 if a > 40 else 0).getbbox()
assert bounds, 'recruitment display title'
title.crop(bounds).save(DEST / 'v2-result-title-v6.png', optimize=True)
