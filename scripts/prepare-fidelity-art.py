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
