"""Publish verified browser artifacts to the independent GitHub Pages repository.

Credentials are obtained from Git's configured helper and never written to disk.
Usage: python scripts/publish-github-pages.py
"""
import hashlib
import json
import re
import subprocess
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = 'EnjoyLura/S6Game-play'
SITE = 'https://enjoylura.github.io/S6Game-play/'


def git(*args, cwd=ROOT):
    return subprocess.check_output(['git', *args], cwd=cwd).decode().strip()


def main():
    subprocess.run(['node', 'scripts/verify-build.cjs'], cwd=ROOT, check=True)
    revision = git('rev-parse', 'HEAD')
    credential = subprocess.run(['git', 'credential', 'fill'], input='protocol=https\nhost=github.com\n\n', text=True, capture_output=True, check=True)
    values = dict(line.split('=', 1) for line in credential.stdout.splitlines() if '=' in line)
    headers = {'Authorization': 'Bearer ' + values['password'], 'Accept': 'application/vnd.github+json', 'User-Agent': 'S6Game-publisher'}

    def api(path, data=None, method=None):
        req = urllib.request.Request('https://api.github.com' + path, headers=headers, data=None if data is None else json.dumps(data).encode(), method=method)
        with urllib.request.urlopen(req, timeout=45) as response:
            body = response.read()
            return json.loads(body) if body else None

    try:
        api('/repos/' + REPO)
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        api('/user/repos', {'name': REPO.split('/')[1], 'description': 'S6Game browser runtime only', 'private': False, 'auto_init': True})

    checkout = ROOT / 'logs' / 'github-pages-release'
    if not (checkout / '.git').exists():
        subprocess.run(['git', 'clone', 'https://github.com/' + REPO + '.git', str(checkout)], check=True)
    if git('remote', 'get-url', 'origin', cwd=checkout) != 'https://github.com/' + REPO + '.git':
        raise RuntimeError('Unexpected release repository')
    subprocess.run(['git', 'config', 'core.autocrlf', 'false'], cwd=checkout, check=True)
    subprocess.run(['git', 'pull', '--ff-only'], cwd=checkout, check=True)
    # Only remove files previously tracked in this dedicated runtime checkout.
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=checkout).decode().split('\0')
    for name in filter(None, tracked):
        target = (checkout / name).resolve()
        if not target.is_relative_to(checkout.resolve()) or '.git' in Path(name).parts:
            raise RuntimeError('Unsafe release path')
        target.unlink(missing_ok=True)

    source = ROOT / 'build' / 'web-mobile'
    files = []
    for item in sorted(source.rglob('*')):
        if item.is_symlink():
            raise RuntimeError('Symlink in build')
        if not item.is_file():
            continue
        relative = item.relative_to(source)
        if any(p.startswith('.') or p in ['node_modules', 'logs'] for p in relative.parts) or item.suffix in ['.map', '.pem', '.key', '.log']:
            continue
        payload = item.read_bytes()
        if relative.as_posix() == 'index.html':
            text = payload.decode()
            # Relative URLs retain compatibility with the /S6Game-play/ subpath.
            text = re.sub(r'((?:src|href)=["\'])(index\.js|style\.css)(["\'])', lambda m: m[1] + m[2] + '?v=' + revision[:12] + m[3], text)
            payload = text.encode()
        relative = Path('releases') / revision[:12] / relative
        dest = checkout / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(payload)
        files.append({'path': relative.as_posix(), 'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest()})
    entry_html = (checkout / 'releases' / revision[:12] / 'index.html').read_text(encoding='utf-8')
    entry_html = entry_html.replace('<head>', '<head><base href="./releases/' + revision[:12] + '/">', 1)
    payload = entry_html.encode()
    (checkout / 'index.html').write_bytes(payload)
    files.append({'path': 'index.html', 'bytes': len(payload), 'sha256': hashlib.sha256(payload).hexdigest()})
    (checkout / '.nojekyll').write_text('')
    (checkout / '.gitattributes').write_text('* -text\n', encoding='utf-8')
    manifest = {'revision': revision, 'files': files}
    (checkout / 'release.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    for entry in files:
        assert hashlib.sha256((checkout / entry['path']).read_bytes()).hexdigest() == entry['sha256']
    subprocess.run(['git', 'add', '-A'], cwd=checkout, check=True)
    if git('status', '--porcelain', cwd=checkout):
        subprocess.run(['git', 'commit', '-m', 'Publish S6Game ' + revision[:12]], cwd=checkout, check=True)
    subprocess.run(['git', 'push', 'origin', 'HEAD:main'], cwd=checkout, check=True)
    try:
        api('/repos/' + REPO + '/pages')
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        api('/repos/' + REPO + '/pages', {'build_type': 'legacy', 'source': {'branch': 'main', 'path': '/'}})
    deadline = time.monotonic() + 600
    while time.monotonic() < deadline:
        try:
            with urllib.request.urlopen(SITE + 'release.json?v=' + revision[:12], timeout=30) as response:
                live = json.load(response)
            if live.get('revision') == revision:
                with urllib.request.urlopen(SITE + '?v=' + revision[:12], timeout=30) as response:
                    assert response.status == 200
                print('Published:', SITE, 'revision:', revision, 'files:', len(files))
                return
        except (urllib.error.URLError, ValueError):
            pass
        state = api('/repos/' + REPO + '/pages')
        if state.get('status') == 'errored':
            raise RuntimeError('GitHub Pages build failed')
        print('Waiting for GitHub Pages:', state.get('status'), flush=True)
        time.sleep(10)
    raise RuntimeError('GitHub Pages verification timed out')


if __name__ == '__main__':
    main()
