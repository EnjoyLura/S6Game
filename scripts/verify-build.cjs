const fs=require('fs'),path=require('path'),crypto=require('crypto');const root=path.resolve('build/web-mobile');let files=[];function walk(p){for(const x of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,x.name);if(x.isDirectory())walk(f);else files.push({path:path.relative(root,f).replaceAll('\\','/'),bytes:fs.statSync(f).size,sha256:crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')});}}walk(root);for(const p of ['index.html','index.js','application.js','src/settings.json'])if(!fs.existsSync(path.join(root,p)))throw Error('Missing '+p);const settings=JSON.parse(fs.readFileSync(path.join(root,'src/settings.json')));if(settings.CocosEngine!=='3.8.8'||settings.engine.platform!=='web-mobile')throw Error('Incorrect engine/platform');fs.writeFileSync('logs/web-mobile-manifest.json',JSON.stringify({engine:settings.CocosEngine,platform:settings.engine.platform,files},null,2));console.log('Verified '+files.length+' build files, '+(files.reduce((a,f)=>a+f.bytes,0)/1048576).toFixed(2)+' MiB; SHA256 manifest: logs/web-mobile-manifest.json');
const art=JSON.parse(fs.readFileSync(path.join(root,'art-manifest.json'),'utf8'));
const images=files.filter(f=>/\.(png|jpe?g|webp)$/.test(f.path));
for (const image of images) {
  const bytes = fs.readFileSync(path.join(root, image.path));
  if (!image.path.endsWith('.webp') || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') {
    throw Error('Expected WebP artwork: '+image.path);
  }
}
if(settings.splashScreen.totalTime!==0||settings.splashScreen.logo)throw Error('Cocos splash must be disabled');
if(settings.engine.macros.ENABLE_TRANSPARENT_CANVAS!==true)throw Error('The persistent forest requires a transparent WebGL canvas');
if(images.length!==art.files.length)throw Error('Incomplete startup art manifest');
for(const f of images){const entry=art.files.find(a=>a.path===f.path);if(!entry||entry.sha256!==f.sha256||entry.bytes!==f.bytes)throw Error('Incorrect startup art hash: '+f.path);}
if(!fs.readFileSync(path.join(root,'index.html'),'utf8').includes('id="s6-boot"'))throw Error('Missing startup screen');
console.log('Verified complete startup artwork, hashes and disabled Cocos splash.');
