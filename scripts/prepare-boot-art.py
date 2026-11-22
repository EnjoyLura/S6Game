"""Create lightweight startup copies from the same in-game art, preserving source PNGs."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'web/boot/art'
OUT.mkdir(parents=True, exist_ok=True)
for source, name, size in [('v2-battle-forest', 'forest', (960, 1700)), ('v2-hero-knight', 'knight', (360, 360)), ('v2-hero-mage', 'mage', (320, 320)), ('v2-hero-priest', 'priest', (320, 320))]:
    im = Image.open(ROOT / 'assets/resources/art' / (source + '.png')).convert('RGBA')
    if name != 'forest':
        im = im.crop(im.getbbox())
    im.thumbnail(size, Image.Resampling.LANCZOS)
    im.save(OUT / (name + '.webp'), 'WEBP', quality=92, method=6)
print('Startup artwork:', sum(p.stat().st_size for p in OUT.glob('*.webp')), 'bytes')
