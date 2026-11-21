// Applies the game's display name to the Cocos web-mobile entry page before the build manifest is hashed.
const fs=require('fs'),path=require('path');
const GAME_NAME='挂机传说：无尽征途';
const entry=path.join(__dirname,'..','build','web-mobile','index.html');
const html=fs.readFileSync(entry,'utf8');
if(!/<title>[^<]*<\/title>/.test(html))throw new Error('Missing <title> in '+entry);
fs.writeFileSync(entry,html.replace(/<title>[^<]*<\/title>/,`<title>${GAME_NAME}</title>`));
console.log('Page title: '+GAME_NAME);
