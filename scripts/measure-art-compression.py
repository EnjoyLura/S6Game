"""Compare delivery formats without changing production artwork. Run from any directory."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'temp/art-compression'
OUT.mkdir(parents=True, exist_ok=True)
rows = []
for source in sorted((ROOT / 'assets/resources/art').glob('*.png')):
    im = Image.open(source).convert('RGBA')
    row = dict(name=source.name, width=im.width, height=im.height, original=source.stat().st_size)
    for label, scale, options in [('lossless', 1, dict(lossless=True, quality=80)), ('q92', 1, dict(quality=92)), ('75pct_q92', .75, dict(quality=92))]:
        target = OUT / label / (source.stem + '.webp')
        target.parent.mkdir(exist_ok=True)
        resized = im if scale == 1 else im.resize((round(im.width * scale), round(im.height * scale)), Image.Resampling.LANCZOS)
        resized.save(target, 'WEBP', method=6, **options)
        row[label] = target.stat().st_size
    rows.append(row)
    print(source.name, flush=True)
(OUT / 'results.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({key: sum(row[key] for row in rows) for key in ['original','lossless','q92','75pct_q92']}, ensure_ascii=False))
