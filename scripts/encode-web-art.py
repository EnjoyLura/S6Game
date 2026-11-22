"""Encode exported web-mobile textures without editing Cocos source assets."""
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageChops


def main():
    assets = Path(__file__).resolve().parents[1] / 'build/web-mobile/assets'
    sources = sorted(p for p in assets.rglob('*') if p.suffix.lower() in {'.png', '.jpg', '.jpeg'})
    if not sources and not any(assets.rglob('*.webp')):
        raise RuntimeError(f'No exported artwork in {assets}')

    original_bytes = encoded_bytes = 0
    for source in sources:
        target = source.with_suffix('.webp')
        with Image.open(source) as imported:
            original = imported.convert('RGBA')
        output = BytesIO()
        original.save(output, 'WEBP', quality=92, method=6)
        data = output.getvalue()
        with Image.open(BytesIO(data)) as converted:
            if converted.size != original.size or ImageChops.difference(
                converted.convert('RGBA').getchannel('A'), original.getchannel('A')
            ).getbbox():
                raise RuntimeError(f'WebP changed dimensions or alpha: {source}')

        original_bytes += source.stat().st_size
        encoded_bytes += len(data)
        temporary = target.with_suffix('.webp.tmp')
        temporary.write_bytes(data)
        temporary.replace(target)
        source.unlink()

    print(f'WebP Q92: {len(sources)} textures, {original_bytes / 1048576:.2f} → {encoded_bytes / 1048576:.2f} MiB')


if __name__ == '__main__':
    main()
