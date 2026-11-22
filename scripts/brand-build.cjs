// Reproducible startup shell, complete art manifest and engine splash removal.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),out=path.join(root,'build/web-mobile');
const source=path.join(root,'web/boot'),entry=path.join(out,'index.html');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
fs.cpSync(path.join(source,'art'),path.join(out,'boot/art'),{recursive:true});
const settingsFile=path.join(out,'src/settings.json');
const settings=JSON.parse(fs.readFileSync(settingsFile,'utf8'));
settings.splashScreen={totalTime:0,logo:null,background:null};
fs.writeFileSync(settingsFile,JSON.stringify(settings,null,2));
const files=[];
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){
  const file=path.join(dir,ent.name);
  if(ent.isDirectory())walk(file);
  else if(/\.(png|jpe?g|webp)$/i.test(ent.name)){
    const bytes=fs.readFileSync(file),ext=path.extname(file).slice(1);
    files.push({path:path.relative(out,file).replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes),mime:'image/'+(ext==='jpg'?'jpeg':ext)});
  }
}}
walk(path.join(out,'assets'));walk(path.join(out,'boot/art'));files.sort((a,b)=>Number(b.path.startsWith('boot/'))-Number(a.path.startsWith('boot/'))||a.path.localeCompare(b.path));
const manifest={version:hash(JSON.stringify(files)).slice(0,16),bytes:files.reduce((n,f)=>n+f.bytes,0),files};
fs.writeFileSync(path.join(out,'art-manifest.json'),JSON.stringify(manifest,null,2));
let html=fs.readFileSync(entry,'utf8').replace(/<!-- S6 BOOT HEAD -->[\s\S]*?<!-- END S6 BOOT HEAD -->/g,'').replace(/<!-- S6 BOOT BODY -->[\s\S]*?<!-- END S6 BOOT BODY -->/g,'');
if(!/<title>[^<]*<\/title>/.test(html))throw new Error('Missing page title');
html=html.replace(/<title>[^<]*<\/title>/,'<title>挂机传说：无尽征途</title>');
html=html.replace('<head>',`<head><!-- S6 BOOT HEAD --><script>document.documentElement.classList.add('s6-loading');</script><style>${fs.readFileSync(path.join(source,'screen.css'),'utf8')}</style><!-- END S6 BOOT HEAD -->`);
const shell=fs.readFileSync(path.join(source,'screen.html'),'utf8');
const loader=fs.readFileSync(path.join(source,'loader.js'),'utf8');
html=html.replace('<body>',`<body><!-- S6 BOOT BODY -->${shell}<script id="s6-art-manifest" type="application/json">${JSON.stringify(manifest)}</script><script>${loader}</script><!-- END S6 BOOT BODY -->`);
html=html.replace(/(?:window\.S6Boot\.fail\(err\);\s*)*console\.error\(err\);/g,'window.S6Boot.fail(err); console.error(err);');
fs.writeFileSync(entry,html);
const indexFile=path.join(out,'index.js');let index=fs.readFileSync(indexFile,'utf8');
if(!index.includes('/* S6 preload */')){
  if(!index.includes('return application.init(engine);'))throw new Error('Cocos engine bootstrap changed');
  index=index.replace('return application.init(engine);','/* S6 preload */ return window.S6Boot.install(engine).then(function () { return application.init(engine); });');
  index=index.replace('console.error(err);','window.S6Boot.fail(err); console.error(err);');
  fs.writeFileSync(indexFile,index);
}
console.log(`Startup: ${files.length} artwork files, ${(manifest.bytes/1048576).toFixed(2)} MiB, version ${manifest.version}; Cocos splash disabled.`);
