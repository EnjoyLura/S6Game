// 把 Cocos 导出包整理成站点发布目录：剔除 sourcemap 与本地调试产物，并校验运行包完整性。
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const source = path.join(projectRoot, 'build', 'web-mobile');
const target = path.join(projectRoot, 'dist', 'web-mobile');

const excludedDirs = new Set(['.runtime-bridge', '_qoder', 'node_modules', '.git']);
const isExcluded = (name) => name.endsWith('.map') || name.startsWith('.env') || name.endsWith('.pem') || name.endsWith('.key');

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`拒绝符号链接: ${path.join(from, entry.name)}`);
    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name)) continue;
      copyTree(path.join(from, entry.name), path.join(to, entry.name));
    } else if (!isExcluded(entry.name)) {
      fs.copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
    }
  }
}

if (!fs.existsSync(path.join(source, 'index.html'))) throw new Error(`缺少导出包入口: ${source}`);
fs.rmSync(target, { recursive: true, force: true });
copyTree(source, target);

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push({ path: path.relative(target, full).replaceAll('\\', '/'), bytes: fs.statSync(full).size });
  }
})(target);

for (const required of ['index.html', 'index.js', 'application.js', 'style.css', 'src/settings.json', 'src/import-map.json', 'src/polyfills.bundle.js', 'src/system.bundle.js']) {
  if (!fs.existsSync(path.join(target, required))) throw new Error(`发布目录缺少 ${required}`);
}
if (files.some((f) => isExcluded(path.basename(f.path)) || f.path.startsWith('.runtime-bridge/'))) throw new Error('发布目录仍含被排除文件');

const settings = JSON.parse(fs.readFileSync(path.join(target, 'src/settings.json'), 'utf8'));
if (settings.engine.platform !== 'web-mobile') throw new Error(`平台不正确: ${settings.engine.platform}`);
if (settings.assets.server) throw new Error(`导出包依赖远程资源服务器: ${settings.assets.server}`);

const bytes = files.reduce((sum, f) => sum + f.bytes, 0);
const limit = 50 * 1024 * 1024;
if (bytes > limit) throw new Error(`发布目录 ${(bytes / 1048576).toFixed(2)} MiB 超过 ${limit / 1048576} MiB 上限`);

fs.mkdirSync(path.join(projectRoot, 'logs'), { recursive: true });
fs.writeFileSync(path.join(projectRoot, 'logs', 'site-dist-manifest.json'), JSON.stringify({ engine: settings.CocosEngine, platform: settings.engine.platform, files }, null, 2));
console.log(`站点发布目录: ${target}`);
console.log(`引擎 ${settings.CocosEngine} / ${settings.engine.platform}，${files.length} 个文件，${(bytes / 1048576).toFixed(2)} MiB`);