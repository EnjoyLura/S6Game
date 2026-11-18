/** Shared responsive skin, nine-slice controls and square item grids. */
export const SECOND_EDITION_STYLES=`
html,body{background:#263b2c!important}
#s6-v2,#s6-v2 *{box-sizing:border-box}
#s6-v2{--ink:#623719;--cream:#fff2df;--gold:#ffcc27;--scene:none;position:fixed;inset:0;margin:auto;width:min(100vw,56.25dvh,600px);max-width:600px;height:100dvh;color:var(--ink);font-family:'Microsoft YaHei','PingFang SC',sans-serif;font-size:clamp(12px,2.7vw,17px);font-weight:700;z-index:20;pointer-events:none;container-type:inline-size;isolation:isolate}
#s6-v2 button{font:inherit;color:inherit;cursor:pointer;touch-action:manipulation}
#s6-v2 img{object-fit:contain;max-width:100%;user-select:none}
#s6-v2 h1,#s6-v2 h2,#s6-v2 h3,#s6-v2 p{margin:0}
#s6-v2 h1{font-size:5.2cqw}
#s6-v2 h2{font-size:4cqw}
#s6-v2 h3{font-size:3.7cqw}
#s6-v2 small{font-size:2.7cqw}
#s6-v2 em{font-style:normal;color:#348c13}
#s6-backdrop{position:fixed;inset:0;background-position:center;background-size:cover;z-index:0;pointer-events:none}
#GameDiv,#Cocos3dGameContainer{background:transparent!important}
#GameDiv{position:relative!important;z-index:1!important;width:min(100vw,56.25dvh,600px)!important;max-width:600px;margin:auto!important}
#s6-v2 .v2-content{height:100%;position:relative}
#s6-v2 .page,#s6-v2 .secondary{height:100%;pointer-events:auto;background:#fce7ce;overflow:hidden;display:flex;flex-direction:column;padding:2cqw 2cqw 0;gap:1.5cqw;background-image:var(--scene);background-size:100% auto;background-repeat:no-repeat}
#s6-v2 .v2-button{border:1px solid #eda516;border-radius:2.8cqw;background:linear-gradient(#ffe45d 0%,#ffcc20 65%,#ffbc10);box-shadow:inset 0 1px 1px #fffbd1,0 2px 2px #be813040;min-height:7cqw;padding:1cqw 3cqw;display:inline-flex;align-items:center;justify-content:center;gap:.7cqw;position:relative;flex-shrink:0;pointer-events:auto;text-shadow:0 1px #ffffff50}
#s6-v2 .v2-button:hover{filter:brightness(1.035)}
#s6-v2 .v2-button:active{transform:translateY(1px)}
#s6-v2 .v2-button:focus-visible{outline:3px solid #2a83ce;outline-offset:2px}
#s6-v2 .quiet{background:linear-gradient(#fff6e8,#ffe4c1);border-color:#ecd1ae}
#s6-v2 .selected{background:linear-gradient(#ffe969,#ffc213);border-color:#eaaa22;box-shadow:inset 0 0 0 1px #fff6bf,0 2px 3px #a96b3140}
#s6-v2 .v2-button:disabled{filter:grayscale(.7);opacity:.62;cursor:default}
#s6-v2 .flat,#s6-v2 .equipment-slot{border:0;background:none;box-shadow:none;padding:0;min-height:0}
#s6-v2 .wallet{display:flex;gap:2cqw;min-height:8.5cqw;align-items:center;padding:0 1cqw}
#s6-v2 .resource{display:inline-flex;align-items:center;background:#fff0d9;border:1px solid #9e662e;border-radius:8cqw;height:6.5cqw;padding:0 2cqw 0 .3cqw;gap:1cqw;font-size:3.4cqw;box-shadow:0 2px 1px #7d4a3b22}
#s6-v2 .resource img{height:7cqw;width:7cqw;margin-top:-.2cqw}
#s6-v2 .v2-nav{display:grid;grid-template-columns:repeat(5,1fr);gap:1cqw;margin-top:auto;padding:1cqw 0 max(1cqw,env(safe-area-inset-bottom));min-height:14cqw;pointer-events:auto}
#s6-v2 .v2-nav button{padding:1cqw .5cqw;flex-direction:column;gap:0;border-radius:4cqw;font-size:3.5cqw;min-width:0}
#s6-v2 .v2-nav img{height:7cqw;width:11cqw}
#s6-v2 .main-tabs{display:flex;gap:1cqw}
#s6-v2 .main-tabs button{flex:1;min-width:0;border-radius:8cqw;font-size:3.8cqw;padding:1.5cqw .5cqw}
#s6-v2 .page-actions{display:flex;gap:3cqw;justify-content:center}
#s6-v2 .page-actions button{min-width:32%;font-size:3.8cqw}
#s6-v2 .cream-card{background:#fff6e5bd;border:1px solid #fff5df;border-radius:3cqw;padding:2cqw;box-shadow:0 1px 2px #ab6e2b16}
#s6-v2 .section-title{align-self:flex-start;font-size:3.5cqw!important;padding:.8cqw 2cqw;margin-bottom:1cqw!important;background:linear-gradient(90deg,#ffdc9f,#ffdc9f80);border-radius:9cqw;display:table}
#s6-v2 .stat-row{display:flex;justify-content:space-between;align-items:center;background:linear-gradient(90deg,#fbe1be,#fce5c9);border-radius:5cqw;padding:.7cqw 2.5cqw;margin:1cqw 0;font-size:3.2cqw;min-height:4.5cqw;gap:1cqw}
#s6-v2 .two-grid{display:grid;grid-template-columns:1fr 1fr;gap:1cqw 2cqw}
#s6-v2 .face{aspect-ratio:1;object-fit:contain}
#s6-v2 .hero-tabs{display:flex;gap:1cqw}
#s6-v2 .hero-tabs button{flex:1;padding:0;font-size:3.3cqw;border-radius:3cqw;min-width:0;height:9cqw}
#s6-v2 .hero-tabs img{width:10cqw;margin-left:-1cqw}
#s6-v2 .hero-stage{position:relative;flex:1;min-height:44cqw;max-height:65cqw;text-align:center;padding-top:.7cqw}
#s6-v2 .hero-stage h1{font-size:5cqw}
#s6-v2 .stars{color:#f9b800;text-shadow:0 1px #9f540f;font-size:5cqw;display:flex;align-items:center;justify-content:center;gap:.7cqw}
#s6-v2 .stars>span{color:#aaa89b}
#s6-v2 .star-button{border-radius:50%;padding:0;width:6cqw;min-height:6cqw;font-size:5cqw;margin-left:2cqw}
#s6-v2 .roles{font-size:3cqw}
#s6-v2 .hero-figure{position:absolute;width:54%;height:78%;bottom:0;left:23%;pointer-events:none}
#s6-v2 .equipment-left,#s6-v2 .equipment-right{position:absolute;top:11cqw;bottom:0;display:flex;flex-direction:column;justify-content:space-around;width:18cqw;z-index:1}
#s6-v2 .equipment-left{left:3cqw}
#s6-v2 .equipment-right{right:3cqw}
#s6-v2 .equipment-slot{display:flex;flex-direction:column;width:100%;gap:.3cqw}
#s6-v2 .gear-tile{position:relative;aspect-ratio:1;background:linear-gradient(130deg,#ffffff25,transparent),var(--quality,#c4b6a6);border-radius:2cqw;overflow:hidden;width:100%}
#s6-v2 .gear-tile>img{width:98%;height:98%;padding:2%;object-fit:contain}
#s6-v2 .gear-tile.empty{background:#c5b8a7}
#s6-v2 .gear-level{position:absolute;right:4%;bottom:1%;font-size:3.2cqw;color:white;text-shadow:1px 1px #5f3b21,-1px -1px #5f3b21,1px -1px #5f3b21,-1px 1px #5f3b21}
#s6-v2 .gear-lock{position:absolute;right:4%;top:1%;color:#fff4c0;font-size:3.5cqw;text-shadow:1px 1px #4f381b}
#s6-v2 .formation-link{position:absolute;bottom:1cqw;left:38%;font-size:2.5cqw;min-height:5cqw;z-index:2}
#s6-v2 .experience{display:flex;align-items:center;gap:2cqw;padding:0 5cqw}
#s6-v2 progress{width:100%;height:2.3cqw;border-radius:8px;overflow:hidden;accent-color:#ffce32}
#s6-v2 .experience small{white-space:nowrap}
#s6-v2 .hero-skills{display:grid;grid-template-columns:repeat(5,1fr);gap:1.8cqw}
#s6-v2 .hero-skills button{flex-direction:column;font-size:2.8cqw;gap:.4cqw}
#s6-v2 .hero-skills img,#s6-v2 .hero-skills .skill-symbol{width:12cqw;height:12cqw}
#s6-v2 .hero-skills b{font-size:2.8cqw}
#s6-v2 .unavailable{filter:grayscale(.9);opacity:.7}
#s6-v2 .skill-symbol{display:flex;align-items:center;justify-content:center;border-radius:2cqw;color:white;font-size:10cqw;text-shadow:0 0 8px #fff;background:radial-gradient(#fff897,#ffae00 55%,#d85900)}
#s6-v2 .skill-symbol.heal{background:radial-gradient(#eeff8e,#7bcf08 60%,#459a08)}
#s6-v2 .attributes .stat-row{font-size:2.9cqw;min-height:4.7cqw}
#s6-v2 .part-tabs{display:flex;gap:.7cqw;padding:0 1cqw}
#s6-v2 .part-tabs button{flex:1;padding:.5cqw;min-width:0;font-size:6cqw;height:10cqw}
#s6-v2 .part-tabs img{width:8cqw;height:8cqw}
#s6-v2 .filter-row{display:flex;justify-content:space-between;padding:0 2cqw}
#s6-v2 .filter-row button{font-size:3.4cqw;min-height:6.5cqw;border-radius:8cqw}
#s6-v2 .five-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.5cqw;align-content:start}
#s6-v2 .five-grid>.flat{display:block;min-width:0}
#s6-v2 .bag-scroll{flex:1;min-height:0;overflow:auto;padding:2.5cqw;scrollbar-color:#f8b71a #f6dbba;scrollbar-width:thin}
#s6-v2 .bag-footer{display:flex;align-items:center;justify-content:space-between;gap:1cqw;font-size:3cqw;padding:1cqw 2cqw}
#s6-v2 .bag-footer button{font-size:3cqw;padding:1cqw 2cqw;border-radius:6cqw}
#s6-v2 .bag-page>.main-tabs{margin-top:1cqw}
#s6-v2 .empty-message{grid-column:1/-1;text-align:center;opacity:.7;padding:4cqw}
#s6-v2 .reward{aspect-ratio:1;position:relative;background:#48b7e5;border-radius:1.8cqw;overflow:hidden;min-width:0}
#s6-v2 .reward>img{height:90%;width:90%;margin:2% 5%}
#s6-v2 .reward>b{position:absolute;right:5%;bottom:1%;color:#fff;font-size:3cqw;text-shadow:1px 1px #563d21,-1px -1px #563d21}
#s6-v2 .reward>small{display:none}
#s6-v2 .recruit-page{background-size:cover;background-position:center}
#s6-v2 .ticket-wallet{position:absolute;top:2.2cqw;right:2.5cqw;color:#fff;display:flex;align-items:center;gap:1cqw;font-size:2.6cqw}
#s6-v2 .ticket-wallet .resource{font-size:3cqw}
#s6-v2 .recruit-page>.main-tabs{margin-top:1cqw;z-index:1}
#s6-v2 .recruit-cast{position:relative;flex:1;min-height:35cqw}
#s6-v2 .recruit-cast .face{position:absolute;object-fit:contain}
#s6-v2 .cast-center{width:65%;height:90%;left:17%;top:8%;z-index:2}
#s6-v2 .cast-left{width:53%;height:70%;left:-7%;top:0}
#s6-v2 .cast-right{width:53%;height:70%;right:-7%;top:-4%}
#s6-v2 .recruit-caption{text-align:center;color:#fff3b7;text-shadow:0 2px 2px #4d2861}
#s6-v2 .recruit-caption h1{font-size:8cqw}
#s6-v2 .recruit-caption p{font-size:3.5cqw}
#s6-v2 .recruit-bottom{color:#fff8e8;padding:1cqw 3cqw;display:flex;flex-direction:column;gap:1.8cqw}
#s6-v2 .pool-links{display:flex;gap:2cqw;justify-content:center}
#s6-v2 .pool-links button{min-height:5.5cqw;font-size:3cqw}
#s6-v2 .pity{display:flex;justify-content:space-between;font-size:3.3cqw}
#s6-v2 .pity em{color:#ffed64}
#s6-v2 .recruit-bottom .page-actions button{min-width:42%;flex-direction:column;padding:.8cqw;font-size:4cqw;min-height:10cqw}
#s6-v2 .recruit-page>.v2-nav{margin-top:0}
#s6-v2 .dungeon-list{flex:1;overflow:auto;display:flex;flex-direction:column;gap:2cqw;padding:1cqw;min-height:0}
#s6-v2 .dungeon-card{display:grid;grid-template-columns:46% 54%;background:#fff2df;border-radius:3cqw;padding:1cqw;gap:0;min-height:0;flex:1;max-height:31cqw;box-shadow:0 1px 2px #a86a351a}
#s6-v2 .dungeon-card>img{width:100%;height:100%;object-fit:cover;border-radius:2cqw;min-height:0}
#s6-v2 .dungeon-card>div{display:flex;flex-direction:column;padding:.7cqw 1.8cqw;gap:1cqw;min-width:0}
#s6-v2 .dungeon-card h2{font-size:4cqw;text-align:center}
#s6-v2 .drop-icons{display:flex;gap:1cqw;flex:1;min-height:0;justify-content:center;align-items:center}
#s6-v2 .drop-icons>.reward{width:11cqw;max-height:12cqw}
#s6-v2 .drop-icons>img{width:10cqw;height:10cqw;background:#42b4e7;border-radius:1cqw}
#s6-v2 .dungeon-card footer{display:flex;align-items:center;justify-content:space-between;gap:.5cqw}
#s6-v2 .dungeon-card footer button{font-size:3.3cqw;min-height:6cqw;padding:.3cqw 4cqw;border-radius:8cqw}
#s6-v2 .dungeon-card footer small{font-size:2.6cqw;white-space:nowrap}
#s6-v2 .endless-note{text-align:center;padding:7cqw;background:#fff2dfaa;border-radius:3cqw;font-size:3.5cqw;line-height:1.8}
#s6-v2 .v2-modal-host{position:absolute;inset:0;pointer-events:none;z-index:50}
#s6-v2 .v2-scrim{position:absolute;inset:0;background:#18291fc2;backdrop-filter:blur(2px);pointer-events:auto;display:flex;align-items:center;justify-content:center;padding:4cqw}
#s6-v2 .v2-dialog{outline:0;width:100%;max-height:91%;border:3px solid #dda848;border-radius:4cqw;background:linear-gradient(125deg,#fff8e8,#ffeed4);box-shadow:inset 0 0 0 2px #fff4d3,0 5px 20px #080d0a66;padding:0 3.5cqw 3cqw;display:flex;flex-direction:column;gap:2cqw;position:relative;font-size:3.2cqw}
#s6-v2 .dialog-head{min-height:9cqw;display:flex;justify-content:center;align-items:center;margin:-2cqw 0 0}
#s6-v2 .dialog-head h2{background:linear-gradient(#ffe3a1,#ffc779);border:2px solid #f4c672;border-radius:4cqw;padding:1.4cqw 7cqw;font-size:4.6cqw;box-shadow:0 2px 2px #ac722636}
#s6-v2 .dialog-head .close{position:absolute;right:-2cqw;top:-2cqw;padding:0;background:linear-gradient(#ffd879,#f6a32c);border:2px solid #fff2b8;color:#fff;font-size:7cqw;line-height:1;border-radius:50%;width:8cqw;height:8cqw;min-height:0}
#s6-v2 .dialog-body{overflow:auto;min-height:0;scrollbar-width:thin;scrollbar-color:#efb84f #fae1bd;display:flex;flex-direction:column;gap:1.2cqw}
#s6-v2 .dialog-actions{display:flex;justify-content:center;gap:3cqw;padding-top:1cqw}
#s6-v2 .dialog-actions button{min-width:31%;font-size:3.8cqw;min-height:8cqw;flex-direction:column;border-radius:8cqw}
#s6-v2 .outside-hint{position:absolute;bottom:1.5%;color:#fff1d0;font-size:3cqw}
#s6-v2 .small{max-width:84%;gap:2cqw}
#s6-v2 .small .info-pad{min-height:16cqw;font-size:3.4cqw;line-height:1.8;justify-content:center}
#s6-v2 .info-pad{background:#f1e4cf;border:1px solid #f8efde;border-radius:2cqw;padding:2.5cqw;line-height:1.65;white-space:pre-line;font-size:3.2cqw}
#s6-v2 .info-pad.compact{padding:1.6cqw;font-size:2.8cqw}
#s6-v2 .item-heading{display:flex;align-items:center;gap:3cqw;position:relative;padding:1cqw 0}
#s6-v2 .item-heading>.gear-tile,#s6-v2 .item-heading>.face{width:22%;flex-shrink:0}
#s6-v2 .item-heading>div:not(.gear-tile){display:flex;flex-direction:column;gap:1cqw}
#s6-v2 .lock-button{margin-left:auto;font-size:5cqw}
#s6-v2 .equip-owner{font-size:2.7cqw;text-align:center}
#s6-v2 .skill-preview img,#s6-v2 .skill-preview .skill-symbol{width:17cqw;height:17cqw}
#s6-v2 .equipment-scroll{height:66cqw;overflow:auto;padding:1cqw;scrollbar-width:thin}
#s6-v2 .filter-options{display:grid;grid-template-columns:repeat(3,1fr);gap:2cqw;padding:2cqw}
#s6-v2 .salvage-scroll{height:59cqw}
#s6-v2 .quality-checks{display:flex;flex-wrap:wrap;gap:1cqw}
#s6-v2 .quality-checks button{font-size:2.7cqw;padding:1cqw 1.4cqw;min-height:5cqw}
#s6-v2 .list-heading{display:flex;justify-content:space-between;font-size:3.3cqw}
#s6-v2 .checked{position:absolute;left:0;bottom:0;background:#ffe24c;border-radius:50%;font-size:4cqw;padding:0 1cqw}
#s6-v2 .material-line{display:flex;align-items:center;justify-content:center;gap:2cqw;font-size:3cqw}
#s6-v2 .material-line img{height:6cqw;width:6cqw}
#s6-v2 .reward-scroll{height:39cqw;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:#f7bd36 #f5e0bd;background:#f6e6ce;border-radius:2cqw;padding:1.6cqw}
#s6-v2 .offline-rates{display:flex;gap:2cqw;justify-content:center}
#s6-v2 .offline-rates .resource{font-size:2.7cqw}
#s6-v2 .challenge-heading{display:flex;gap:2cqw;align-items:center}
#s6-v2 .challenge-heading>img{width:34%;aspect-ratio:1.4;object-fit:cover;border-radius:2cqw}
#s6-v2 .challenge-cost{display:flex;align-items:center;justify-content:center;font-size:3cqw}
#s6-v2 .challenge-cost img{width:5cqw;height:5cqw}
#s6-v2 .pool-name{text-align:center}
#s6-v2 .pool-heroes{display:grid;grid-template-columns:repeat(4,1fr);gap:2cqw}
#s6-v2 .hero-card{background:linear-gradient(130deg,#fff7,#fff0),var(--quality);border:2px solid #fff1bf;border-radius:2cqw;padding:1cqw;display:flex;flex-direction:column;position:relative;overflow:hidden;text-align:center;min-width:0;box-shadow:0 2px 2px #65452e33}
#s6-v2 .hero-card>.face{width:100%;aspect-ratio:1}
#s6-v2 .hero-card>b{font-size:3cqw}
#s6-v2 .hero-card>small{font-size:2.1cqw;white-space:nowrap}
#s6-v2 .hero-role{font-size:2cqw;text-align:left}
#s6-v2 .hero-card.locked{filter:grayscale(.8);opacity:.65}
#s6-v2 .new{position:absolute;top:1%;right:0;font:italic 800 2.5cqw sans-serif;background:#ff593d;color:white;padding:.4cqw 1cqw;z-index:1}
#s6-v2 .fullscreen{background:transparent;border:0;box-shadow:none;color:#fff6db;gap:4cqw;padding:0;max-height:95%}
#s6-v2 .fullscreen .dialog-head h2{background:none;border:0;box-shadow:none;font-size:8cqw;color:#ffed97;text-shadow:0 2px 2px #b36c17}
#s6-v2 .fullscreen .close{display:none}
#s6-v2 .fullscreen .dialog-body{gap:3cqw;text-align:center}
#s6-v2 .fullscreen .dialog-actions{padding-top:7cqw}
#s6-v2 .fullscreen .hero-card{color:#653b21}
#s6-v2 .result-cards{gap:1.5cqw}
#s6-v2 .result-cards.single{width:34cqw;align-self:center}
#s6-v2 .result-cards.single .hero-card>b{font-size:5cqw}
#s6-v2 .rewards-fullscreen .reward-scroll{background:#a3713233;height:46cqw;padding:2cqw 0}
#s6-v2 .secondary{padding:0;gap:0}
#s6-v2 .title-plaque{display:table;margin:2cqw auto!important;padding:1.6cqw 7cqw;background:linear-gradient(#fff4d8,#ffdfa6);border:2px solid #efbd66;border-radius:2cqw;box-shadow:inset 0 0 0 2px #fff9df;font-size:5cqw}
#s6-v2 .forge-scene{height:42%;position:relative;background-size:cover;background-position:center;flex-shrink:0}
#s6-v2 .forge-scene .wallet{position:absolute;top:1cqw;left:1cqw}
#s6-v2 .forge-scene>.title-plaque{position:relative;width:max-content;font-size:4.5cqw}
#s6-v2 .forge-item{position:absolute;top:12cqw;left:3cqw;display:flex;gap:1.5cqw;align-items:center}
#s6-v2 .forge-item>.gear-tile{width:15cqw}
#s6-v2 .forge-item h2{font-size:3.7cqw}
#s6-v2 .forge-item p{font-size:2.6cqw}
#s6-v2 .forge-weapon{position:absolute;width:27%;height:40%;left:35%;bottom:15%;filter:drop-shadow(0 0 8px #ffdf61)}
#s6-v2 .upgrade-body{padding:1cqw 5cqw 2cqw;display:flex;flex-direction:column;flex:1;gap:.8cqw}
#s6-v2 .level-preview{text-align:center;padding:1cqw 0 2cqw;font-size:5.7cqw}
#s6-v2 .upgrade-body .stat-row{margin:.5cqw 0;padding:1cqw 2.5cqw}
#s6-v2 .upgrade-body .section-title{margin-top:1cqw}
#s6-v2 .upgrade-costs{display:flex;align-items:center;justify-content:space-around;gap:4cqw;margin-top:auto;padding-top:2cqw;font-size:3cqw}
#s6-v2 .upgrade-costs>div{display:flex;flex-direction:column;align-items:center;gap:.4cqw}
#s6-v2 .upgrade-costs .reward{width:10cqw;background:transparent;border:1px solid #d7b38d}
#s6-v2 .upgrade-costs .reward>b{display:none}
#s6-v2 .upgrade-costs button{min-width:33%;border-radius:8cqw;font-size:4.2cqw}
#s6-v2 .secondary-close{align-self:center;width:40%;font-size:4.5cqw;margin:3cqw 0 2cqw;border-radius:9cqw}
#s6-v2 .breakthrough-note{display:flex;align-items:center;justify-content:center;color:#9d6b36;font-size:2.8cqw;margin-top:1cqw}
#s6-v2 .breakthrough-note:before,#s6-v2 .breakthrough-note:after{content:'';height:1px;background:#e5bc76;flex:1}
#s6-v2 .formation-scene{height:37%;background-position:center;background-size:cover;position:relative}
#s6-v2 .standing-heroes{position:absolute;inset:17% 3% 0;display:flex;justify-content:space-around;align-items:center}
#s6-v2 .standing-heroes .standing{width:29%;padding:0;background:none;box-shadow:none;border:0;display:flex;flex-direction:column;font-size:3cqw}
#s6-v2 .standing img{width:100%;height:22cqw}
#s6-v2 .standing small{background:#fff0ccdd;border-radius:3cqw;padding:0 2cqw}
#s6-v2 .slot0{transform:translateY(6cqw)}
#s6-v2 .empty-position{border:2px dashed #bca77b;background:#f7ebcd66;width:22%;height:14cqw}
#s6-v2 .formation-toolbar{display:flex;align-items:center;justify-content:space-between;gap:1cqw;padding:2cqw;font-size:3cqw}
#s6-v2 .formation-toolbar>div{display:flex;gap:1cqw}
#s6-v2 .formation-toolbar>div button{padding:0;width:6cqw;min-height:6cqw;border-radius:50%}
#s6-v2 .formation-toolbar>button{font-size:2.7cqw;min-height:6cqw;padding:1cqw 2cqw}
#s6-v2 .roster-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:2cqw;padding:2cqw 3cqw;flex:1;align-content:start;overflow:auto}
#s6-v2 .roster-grid button{display:block;position:relative;align-self:start}
#s6-v2 .deployed{position:absolute;right:1cqw;top:1cqw;height:max-content;background:#ee8c51;color:white;font-size:2.5cqw;padding:.3cqw 1cqw}
#s6-v2 .formation-types>button{padding:2cqw 1cqw;flex-direction:column;gap:2cqw}
#s6-v2 .formation-mini{display:flex}
#s6-v2 .formation-mini>div{display:flex;flex-direction:column;width:33%}
#s6-v2 .formation-mini img{width:100%}
#s6-v2 .formation-mini b{font-size:3cqw}
#s6-v2 .talent-wallet{text-align:center}
#s6-v2 .talent-tree{position:relative;height:65cqw;min-height:65cqw;background:radial-gradient(ellipse,#b1d26a44,transparent 70%)}
#s6-v2 .talent-tree svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
#s6-v2 .talent-tree path{fill:none;stroke:#a3843c;stroke-width:1.2;stroke-linecap:round}
#s6-v2 .talent-node{position:absolute;transform:translate(-50%,-50%);width:8cqw;height:8cqw;min-height:0;border-radius:50%;padding:0;font-size:4cqw;background:linear-gradient(#e1dac7,#cbbf9c)}
#s6-v2 .talent-node.learned{background:linear-gradient(#fff06e,#efa51d);box-shadow:0 0 5px #ffc600}
#s6-v2 .flow-node{left:50%;top:95%}
#s6-v2 .v2-toast{position:absolute;bottom:25%;left:10%;width:80%;text-align:center;background:#4b3527ef;color:#fff4d6;padding:2cqw 3cqw;border-radius:2cqw;opacity:0;transition:opacity .15s;z-index:100;font-size:3.5cqw;pointer-events:none}
#s6-v2 .v2-toast.visible{opacity:1}
#s6-v2 .battle-hud{height:100%;position:relative;padding:1cqw;pointer-events:none;display:flex;flex-direction:column}
#s6-v2 .battle-hud>.wallet{flex-direction:column;align-items:flex-start;position:absolute;top:1cqw;left:10cqw;gap:.6cqw;z-index:1}
#s6-v2 .battle-hud .resource{height:4.7cqw;font-size:2.8cqw}
#s6-v2 .battle-hud .resource img{height:5.5cqw;width:5.5cqw}
#s6-v2 .menu{position:absolute;left:1cqw;top:1cqw;width:8cqw;height:8cqw;font-size:6cqw;padding:0}
#s6-v2 .stage-heading{text-align:center;margin-top:1cqw;min-height:19cqw;display:flex;flex-direction:column;align-items:center;margin-left:24cqw}
#s6-v2 .stage-heading h1{font-size:5.8cqw;text-shadow:1px 1px #fff5d0,-1px -1px #fff5d0}
#s6-v2 .stage-heading>b{font-size:3.8cqw}
#s6-v2 .checkpoint{display:flex;align-items:center;gap:4cqw;border-top:2px solid #fff1ca;margin-top:2cqw;height:2cqw;color:#7b5c32}
#s6-v2 .checkpoint i{width:2.5cqw;height:2.5cqw;background:#73be31;border:1px solid #fff7d2;border-radius:50%;display:block;margin-top:-2cqw}
#s6-v2 .turn-order{display:flex;align-items:center;justify-content:center;gap:1cqw;font-size:3cqw;margin-top:2cqw;height:8cqw}
#s6-v2 .turn-order>.face{width:7cqw;height:7cqw}
#s6-v2 .monster-turn{width:7cqw;height:7cqw;border-radius:50%;background:#a4dc62;color:#45632f;display:flex;align-items:center;justify-content:center;font-size:5cqw}
#s6-v2 .battle-tools{position:absolute;right:2cqw;top:34cqw;display:flex;flex-direction:column;gap:1.5cqw}
#s6-v2 .battle-tools button{width:8cqw;height:8cqw;min-height:0;padding:0;flex-direction:column;font-size:4cqw;gap:0;border-radius:2.4cqw}
#s6-v2 .battle-tools small{font-size:1.8cqw}
#s6-v2 .battle-tools .on:after{content:'';position:absolute;right:-.4cqw;top:-.4cqw;background:#78d02d;width:1.8cqw;height:1.8cqw;border:1px solid #fff;border-radius:50%}
#s6-v2 .field-actions{margin-top:auto;display:flex;gap:2cqw;padding:1cqw 2cqw}
#s6-v2 .field-actions button{min-height:6.5cqw;border-radius:6cqw;padding:.5cqw 3cqw;font-size:3.4cqw}
#s6-v2 .skill-bar{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:linear-gradient(#fff3e1,#ffeed5);pointer-events:auto;padding:2cqw 1cqw;min-height:36cqw;gap:1.8cqw;border-top:1px solid #fff6cf}
#s6-v2 .party-card{min-width:0;border-right:1px solid #edd1ad;padding-right:1cqw}
#s6-v2 .party-card:last-child{border-right:0}
#s6-v2 .party-card>header{display:flex;align-items:center;min-height:12cqw}
#s6-v2 .party-card>header>.face{width:11cqw;height:11cqw;border:1px solid #edd1ad;border-radius:50%;background:#fff0d5}
#s6-v2 .party-card>header>div{flex:1;min-width:0;display:flex;flex-direction:column;gap:.3cqw}
#s6-v2 .party-card b{font-size:3cqw}
#s6-v2 .party-card small{font-size:2.2cqw;white-space:nowrap}
#s6-v2 .health-track{height:1.7cqw;background:#c8ae83;border:1px solid #675326;border-radius:8px;overflow:hidden}
#s6-v2 .health-track i{display:block;height:100%;background:linear-gradient(#c9ff75,#74ca19)}
#s6-v2 .active-skills{display:grid;grid-template-columns:1fr 1fr;gap:1.2cqw;margin-top:1.5cqw}
#s6-v2 .skill-button{display:flex;flex-direction:column;background:none;box-shadow:none;border:0;padding:0;min-width:0}
#s6-v2 .skill-button>img,#s6-v2 .skill-button>.skill-symbol{width:12cqw;height:12cqw;object-fit:contain;border-radius:2cqw;background:radial-gradient(#fff6a1,#e9b535)}
#s6-v2 .skill-button>span[data-cooldown]{position:absolute;top:30%;color:white;text-shadow:0 1px 2px #3b2411;font-size:4cqw}
#s6-v2 .battle-hud>.v2-nav{background:#fff0d7;margin:0;padding:1cqw}
#s6-v2 .battle-hud>.v2-nav button{min-height:13cqw}
#s6-v2 .page>.wallet{flex-shrink:0}
#s6-v2 .hero-stage{flex:none;height:76cqw;min-height:76cqw;max-height:76cqw}
#s6-v2 .bag-page,#s6-v2 .dungeon-page{background-size:100% 18cqw}
#s6-v2 .hero-page{background-image:linear-gradient(transparent 0%,transparent 42%,#fce7ce 52%),var(--scene);background-size:100% 100%,100% auto}
#s6-v2 .recruit-bottom .v2-button{color:var(--ink)}

#s6-v2 .v2-button{--button-art:var(--gold-art)}
#s6-v2 .v2-button.quiet{--button-art:var(--cream-art)}
#s6-v2 .v2-button.selected{--button-art:var(--gold-art)}
#s6-v2 .v2-button:not(.flat):not(.equipment-slot):not(.talent-node):not(.standing):not(.skill-button){background:none;border-image:var(--button-art) 65 150 fill / 8px 18px stretch;box-shadow:none}
#s6-v2 .dialog-head .close{border-image:none!important;background-image:var(--close-art)!important;background-size:100% 100%!important;border:0!important;color:transparent!important}
#s6-v2 .v2-dialog:not(.fullscreen){border-image:var(--panel-art) 75 fill / 22px stretch;background:none;border-width:12px;padding:0 2cqw 2cqw}
#s6-v2 .dialog-head h2{background-image:var(--plaque-art);background-size:100% 100%;border:0;box-shadow:none;padding:2.5cqw 7cqw}
#s6-v2 .v2-button.flat{border-image:none}
#s6-v2 .up-ticket{filter:hue-rotate(290deg)}
#s6-v2 .empty-position{border-image:none!important;background:#f7ebcd66!important}
#s6-v2 .empty-slot-symbol{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:7cqw;color:#a89984}
#s6-v2 .equipment-slot small{font-size:3cqw;line-height:1.3}
#s6-v2 .hero-tabs button{height:10cqw}
#s6-v2 .hero-tabs img{width:9cqw}
#s6-v2 .bag-page,#s6-v2 .dungeon-page{background-image:linear-gradient(transparent 0 16cqw,#fce7ce 18cqw),var(--scene);background-size:100% 100%,100% auto;background-position:top,center top}
#s6-v2 .dungeon-card{max-height:39cqw}
#s6-v2 .stage-heading small{font-size:2.8cqw}
#s6-v2 .battle-tools small{font-size:1.7cqw;white-space:nowrap;line-height:1.2}
#s6-v2 .turn-portrait{width:7cqw;height:7cqw;display:flex;align-items:center;border-radius:50%;border:1px solid transparent}
#s6-v2 .turn-portrait img{width:100%;height:100%}
#s6-v2 .turn-portrait.turn-current{border-color:#ffe250;filter:drop-shadow(0 0 3px #fff460)}
#s6-v2 .field-actions img{width:5cqw;height:5cqw}#s6-v2 .battle-tools img{width:4.5cqw;height:4.5cqw}
#s6-v2 .field-actions{background:linear-gradient(transparent,#daeabd88)}
#s6-v2 .party-card small{font-size:2.5cqw}
#s6-v2 .skill-button small{font-size:2.7cqw}
#s6-v2 .v2-nav button{font-size:3.8cqw;min-height:14cqw}
#s6-v2 .hero-page{overflow-y:auto}
#s6-v2 .hero-page>.v2-nav{position:sticky;bottom:0;background:#fce7ce;z-index:4;flex-shrink:0}
#s6-v2 .hero-page>.cream-card,#s6-v2 .hero-page>.hero-tabs,#s6-v2 .hero-page>.page-actions{flex-shrink:0}
@media(max-height:650px){#s6-v2 .hero-stage{min-height:35cqw}
#s6-v2 .hero-skills img,#s6-v2 .hero-skills .skill-symbol{width:9cqw;height:9cqw}
#s6-v2 .attributes .stat-row{min-height:3.6cqw}
#s6-v2 .page{gap:.7cqw}
#s6-v2 .skill-bar{min-height:31cqw}
#s6-v2 .v2-dialog{max-height:94%}}@media(prefers-reduced-motion:reduce){#s6-v2 *{transition:none!important}}`;
