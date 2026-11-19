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
#s6-v2 .v2-dialog{max-height:94%}}@media(prefers-reduced-motion:reduce){#s6-v2 *{transition:none!important}}
/* ---- Concept-fidelity skin (2026-11-18): plaques, rows, fullscreen results, feature pages ---- */
#s6-v2 .ico{width:1.15em;height:1.15em;fill:currentColor;flex-shrink:0;vertical-align:-.18em}
#s6-v2 .ico.mirror,#s6-v2 .laurel.mirror{transform:scaleX(-1)}
#s6-v2 .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
#s6-v2 .v2-button{color:#5d3216}
#s6-v2 .v2-button.peach{border-image:var(--peach-art) 46 90 fill / 8px 18px stretch!important;color:#6b2f12}
#s6-v2 .wide{min-width:56%!important}
#s6-v2 .wallet{gap:2.4cqw}
#s6-v2 .page>.wallet .resource{height:7.4cqw;font-size:3.9cqw;padding:0 3cqw 0 .3cqw}
#s6-v2 .page>.wallet .resource img{height:8.4cqw;width:8.4cqw}
#s6-v2 .main-tabs button{font-size:4.4cqw;min-height:9.6cqw}
#s6-v2 .filter-row button{font-size:3.6cqw;min-height:8cqw;padding:1cqw 3.6cqw;gap:1.2cqw}
#s6-v2 .filter-row .ico{width:4.4cqw;height:4.4cqw}
#s6-v2 .exp-track{width:100%;height:2.4cqw;background:#c9b495;border-radius:2cqw;overflow:hidden;box-shadow:inset 0 1px 2px #0003}
#s6-v2 .exp-track i{display:block;height:100%;background:linear-gradient(#a8ef5a,#4fae1d);border-radius:2cqw}
/* plaque */
#s6-v2 .plaque{position:relative;display:inline-flex;align-items:center;padding:0 2.8cqw!important;background:none!important;border:0!important;box-shadow:none!important;filter:drop-shadow(0 2px 1.5px #9b5f1c55)}
#s6-v2 .plaque:before,#s6-v2 .plaque:after{content:'';position:absolute;top:50%;width:6.4cqw;height:6.4cqw;background:linear-gradient(135deg,#fffaf0,#ffdba0);border:2px solid #d9a24c;transform:translateY(-50%) rotate(45deg);border-radius:.9cqw}
#s6-v2 .plaque:before{left:.4cqw}
#s6-v2 .plaque:after{right:.4cqw}
#s6-v2 .plate{position:relative;z-index:1;display:flex;align-items:center;gap:2.4cqw;padding:1.5cqw 4.6cqw;background:linear-gradient(#fffbf2,#ffe3ab);border-top:2px solid #d9a24c;border-bottom:2px solid #d9a24c;box-shadow:inset 0 2px #fff,inset 0 -2px #fff0d0;font-size:5cqw;color:#5d3216;line-height:1.25;white-space:nowrap}
#s6-v2 .plate>i{font-style:normal;color:#d8962d;font-size:3cqw}
#s6-v2 .dialog-head .plate>i:first-child:before,#s6-v2 .dialog-head .plate>i:last-child:before{content:'';position:absolute;top:-4cqw;width:8.5cqw;height:5.4cqw;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 24'%3E%3Cpath d='M21 23C15 14 7 12 2 14c5-9 14-8 19 9z' fill='%2387c540' stroke='%23507d22' stroke-width='1.4'/%3E%3Cpath d='M21 23c1-10 8-17 17-16-3 9-9 13-17 16z' fill='%23a3d856' stroke='%23507d22' stroke-width='1.4'/%3E%3C/svg%3E") center/contain no-repeat}
#s6-v2 .dialog-head .plate>i:first-child:before{left:-7cqw}
#s6-v2 .dialog-head .plate>i:last-child:before{right:-7cqw;transform:scaleX(-1)}
/* dialogs */
#s6-v2 .v2-scrim{flex-direction:column;gap:2.6cqw;padding:5cqw 4cqw;background:#2a2116b8;backdrop-filter:blur(1.5px)}
#s6-v2 .v2-scrim.dark{background:radial-gradient(ellipse at 50% 38%,#26304fe6,#0c1020f2 75%)}
#s6-v2 .v2-dialog.small{width:78cqw;max-width:none}
#s6-v2 .v2-dialog.medium{width:82cqw}
#s6-v2 .v2-dialog.large{width:90cqw}
#s6-v2 .v2-dialog:not(.fullscreen){border-width:14px;border-image:var(--panel-art) 75 fill / 26px stretch;padding:0 2.4cqw 2.6cqw;max-height:86%;gap:1.6cqw}
#s6-v2 .dialog-head:not(.celebrate){margin:-8.6cqw 0 0;min-height:10cqw}
#s6-v2 .dialog-head .close{right:-6.4cqw;top:-6.2cqw;width:10cqw;height:10cqw}
#s6-v2 .outside-hint{position:static;display:flex;gap:1.6cqw;align-items:center;color:#fff3d6;font-size:3.3cqw;cursor:pointer;pointer-events:auto;text-shadow:0 1px 2px #0008}
#s6-v2 .outside-hint .ico{color:#e8d7a0;width:3.6cqw;height:3.6cqw}
#s6-v2 .dialog-body{gap:1.3cqw;padding:0 .6cqw}
#s6-v2 .dialog-actions{gap:3.6cqw;padding-top:1.4cqw}
#s6-v2 .dialog-actions button{min-width:39%;min-height:11.5cqw;font-size:4.8cqw}
#s6-v2 .dialog-actions button small{font-size:3.1cqw;display:flex;align-items:center;gap:.4cqw}
#s6-v2 .dialog-actions:has(.warn),#s6-v2 .dialog-actions:has(.challenge-cost){flex-direction:column;align-items:center;gap:1cqw}
#s6-v2 .warn{display:flex;align-items:center;gap:1cqw;color:#8c5a35;font-size:3cqw}
#s6-v2 .warn .ico{color:#e0702b}
#s6-v2 .info-pad{background:#f3e2c8;border:0;border-radius:2.6cqw;text-align:center;font-size:3.7cqw;line-height:1.9;white-space:normal}
#s6-v2 .info-pad small{display:block;font-size:3.1cqw;color:#86664a}
#s6-v2 .info-pad b{font-size:4.2cqw}
#s6-v2 .inline-icon{width:6cqw;height:6cqw;vertical-align:middle}
#s6-v2 .section-title{display:flex!important;align-items:center;gap:1.6cqw;width:100%;background:none!important;padding:0!important;margin:.8cqw 0 .2cqw!important;font-size:3.8cqw!important}
#s6-v2 .section-title>span{display:inline-flex;align-items:center;gap:1cqw;background:linear-gradient(90deg,#ffd38a,#ffe6bb 75%,#ffe6bb00);border-radius:4cqw;padding:.5cqw 5cqw .5cqw 1.6cqw;color:#5d3216}
#s6-v2 .section-title>span .ico{color:#a8661f;width:4cqw;height:4cqw}
#s6-v2 .section-title:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#e9c689,transparent)}
#s6-v2 .section-title.effect>span .ico{color:#9a4fd0}
#s6-v2 .ornament-line{display:flex;align-items:center;gap:2cqw;color:#e0ad55;font-size:2.4cqw;margin:.4cqw 0}
#s6-v2 .ornament-line:before,#s6-v2 .ornament-line:after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,#e5c287,transparent)}
#s6-v2 .ornament-line i{font-style:normal}
#s6-v2 .stat-row{background:linear-gradient(90deg,#f9d9b0,#fde8cd);border-radius:4cqw;padding:.9cqw 3.2cqw;margin:.45cqw 0;font-size:3.6cqw;min-height:6.4cqw}
#s6-v2 .stat-row>span{display:inline-flex;align-items:center;gap:2.2cqw}
#s6-v2 .stat-row .ico{color:#8b5530;width:4.2cqw;height:4.2cqw}
#s6-v2 .stat-row.rate .ico{color:inherit;width:5.4cqw;height:5.4cqw}
#s6-v2 .stat-row.rate i{display:inline-flex}
#s6-v2 .change{display:inline-flex;align-items:center;gap:3cqw}
#s6-v2 .change i{font-style:normal;color:#8b5530;font-size:.85em}
#s6-v2 em.blue{color:#2e7fd8}
#s6-v2 em.short{color:#d9412b!important}
#s6-v2 .pill{display:inline-block;align-self:flex-start;background:#fbdfb8;border-radius:3cqw;padding:.3cqw 2.6cqw;font-size:3.2cqw;color:#7a4a26}
#s6-v2 .quality-pill{display:inline-block;align-self:flex-start;background:color-mix(in srgb,var(--tone) 16%,#fff);color:var(--tone);border-radius:2cqw;padding:.2cqw 2.4cqw;font-size:3.2cqw}
#s6-v2 .item-heading{gap:3.4cqw}
#s6-v2 .item-heading h3{font-size:5cqw}
#s6-v2 .item-heading>.gear-tile{width:25%;border:2px solid #fff3cf;box-shadow:0 2px 3px #6d462633}
#s6-v2 .lock-button{position:absolute;right:1cqw;top:1.4cqw;width:8.5cqw}
#s6-v2 .lock-button img{width:100%}
#s6-v2 .effect-line{display:flex;align-items:center;gap:2cqw;padding:.6cqw 2cqw;font-size:3.5cqw}
#s6-v2 .effect-line .ico{color:#46a530;width:6.4cqw;height:6.4cqw;background:#e7f6d6;border-radius:50%;padding:.6cqw}
#s6-v2 .equip-owner{color:#86664a}
#s6-v2 .gear-tile>img.gear-lock{position:absolute;right:3%;top:3%;width:27%;height:auto;padding:0}
#s6-v2 .skill-preview img{width:20cqw;height:20cqw}
#s6-v2 .portrait-tile{position:relative;aspect-ratio:1;border-radius:2.4cqw;background:linear-gradient(135deg,#ffffff66,transparent 60%),var(--quality);border:2px solid #fff3cf;box-shadow:0 2px 3px #6d462633;overflow:hidden;width:25%;flex-shrink:0}
#s6-v2 .portrait-tile .face{width:100%;height:100%;object-fit:cover;object-position:50% 0;transform:scale(1.5);transform-origin:50% 14%}
#s6-v2 .portrait-tile.small{width:17cqw}
#s6-v2 .portrait-tile>b{position:absolute;right:5%;bottom:2%;color:#fff;font-size:3.8cqw;text-shadow:1px 1px #5f3b21,-1px -1px #5f3b21,1px -1px #5f3b21,-1px 1px #5f3b21}
#s6-v2 .portrait-tile>small{position:absolute;left:0;right:0;bottom:0;background:#3d24127a;color:#fff;font-size:2.7cqw;text-align:center}
#s6-v2 .up-mark{position:absolute;right:0;top:0;background:#ff5a3c;color:#fff;font:italic 800 2.7cqw sans-serif;padding:.2cqw 1.3cqw;border-radius:0 0 0 1.6cqw}
#s6-v2 .star-change{display:flex;align-items:center;gap:2cqw;color:#f6b400;font-size:6.4cqw;text-shadow:0 1px #9f540f;letter-spacing:-.4cqw}
#s6-v2 .star-change i{font-style:normal;color:#c9762c;font-size:4.4cqw;letter-spacing:0}
#s6-v2 .cost-card{display:flex;align-items:center;gap:3.4cqw;background:#fbe5c6;border-radius:3cqw;padding:2.4cqw 3.4cqw}
#s6-v2 .cost-card>div:last-child{border-left:1px solid #e3c08d;padding-left:3.4cqw;display:flex;flex-direction:column;gap:1cqw}
#s6-v2 .cost-card h3{font-size:4.2cqw}
#s6-v2 .cost-card p{font-size:3.4cqw}
/* hero cards */
#s6-v2 .hero-card{background:#fff6e6;border:2px solid #efd3a8;border-radius:2.8cqw;padding:1cqw 1cqw 1.2cqw;gap:.4cqw;align-items:center;color:#5d3216;overflow:visible}
#s6-v2 .hero-card.locked{filter:none;opacity:1}
#s6-v2 .hero-card .portrait{position:relative;width:100%;aspect-ratio:1.05;border-radius:2cqw;background:linear-gradient(135deg,#ffffff66,transparent 60%),var(--quality);overflow:hidden}
#s6-v2 .hero-card .portrait .face{width:100%;height:100%;object-fit:contain;object-position:50% 100%;transform:scale(1.18);transform-origin:50% 0}
#s6-v2 .hero-card.locked .portrait{background:#8f8578}
#s6-v2 .hero-card.locked .portrait .face{filter:grayscale(1) brightness(.6)}
#s6-v2 .hero-card>b{font-size:3.4cqw;line-height:1.2}
#s6-v2 .role-badge{position:absolute;left:-.6cqw;top:-.6cqw;z-index:2;width:6.4cqw;height:6.4cqw;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 2px #0005;color:#fff}
#s6-v2 .role-badge .ico{width:3.8cqw;height:3.8cqw}
#s6-v2 .r0{background:#e2463c}#s6-v2 .r1{background:#3d7fe0}#s6-v2 .r2{background:#e8a51c}#s6-v2 .r3{background:#55a735}
#s6-v2 .star-row{display:inline-flex;gap:0;font-size:3.2cqw;line-height:1}
#s6-v2 .star-row i{font-style:normal;color:#cfc8ba;text-shadow:0 1px #8b7b62}
#s6-v2 .star-row i.on{color:#ffc21a;text-shadow:0 1px #a65d0b}
#s6-v2 .deployed{position:absolute;left:7%;right:7%;bottom:5%;top:auto;height:auto;background:linear-gradient(#86d652,#3f9f26);color:#fff;font-size:2.8cqw;padding:.2cqw 0;text-align:center;clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%)}
#s6-v2 .card-tag{position:absolute;right:-.6cqw;top:-.6cqw;z-index:3;font:italic 900 2.8cqw sans-serif;padding:.4cqw 1.6cqw;border-radius:0 2cqw 0 2cqw;color:#fff;background:none}
#s6-v2 .card-tag.new{background:linear-gradient(#ff7b4b,#ea3a2a);box-shadow:0 1px 2px #0004}
#s6-v2 .card-tag.dup{background:#5d4a3acc;font:700 2.5cqw sans-serif}
#s6-v2 .card-lock{position:absolute;right:5%;top:5%;width:26%}
/* fullscreen results */
#s6-v2 .fullscreen{width:100%!important;max-width:none!important;color:#fff5dc}
#s6-v2 .dialog-head.celebrate{margin:0;gap:1cqw;align-items:center;min-height:0}
#s6-v2 .celebrate h2{font-size:10.5cqw;color:#ffeaa4;-webkit-text-stroke:.55cqw #7a3d0c;paint-order:stroke fill;text-shadow:0 .9cqw 0 #6a320b,0 0 7cqw #ffcf4d;background:none!important;padding:0 1cqw!important;letter-spacing:.6cqw;border:0;box-shadow:none}
#s6-v2 .laurel{width:9cqw;height:14cqw;fill:#f3b72c;stroke:#a8620f;stroke-width:.8;flex-shrink:0}
#s6-v2 .rewards-fullscreen .dialog-head{background:radial-gradient(ellipse at 50% 62%,#ffc94f99,#ffc94f22 40%,transparent 66%);padding:9cqw 0 4cqw}
#s6-v2 .rewards-fullscreen .reward-scroll{background:linear-gradient(90deg,#20140a55,#3a240fbb 12%,#3a240fbb 88%,#20140a55);border:0;border-top:1.5px solid #e9b24c;border-bottom:1.5px solid #e9b24c;height:56cqw;max-height:none;border-radius:0;padding:4cqw 6cqw}
#s6-v2 .results-screen .dialog-body{gap:3cqw;align-items:center}
#s6-v2 .result-sub{background:linear-gradient(90deg,transparent,#00000077,transparent);padding:1cqw 12cqw;font-size:4.2cqw;color:#fff4dc}
#s6-v2 .result-sub em{color:#ffd54a;font-size:5.4cqw;margin:0 .6cqw}
#s6-v2 .result-cards.five-grid{gap:2.2cqw;padding:0 1.4cqw;width:100%}
#s6-v2 .result-cards.single{width:36cqw}
#s6-v2 .result-cards.single .hero-card>b{font-size:4.4cqw}
#s6-v2 .ticket-left{display:inline-flex;align-items:center;gap:1cqw;background:#0000007a;border:1px solid #ffffff3a;border-radius:5cqw;padding:.6cqw 3.4cqw;font-size:3.5cqw;margin-top:10cqw}
#s6-v2 .ticket-left img{width:6.4cqw;height:6.4cqw}
#s6-v2 .ticket-left b{color:#ffd54a;font-size:4.2cqw}
#s6-v2 .results-screen .dialog-actions{padding-top:2cqw}
#s6-v2 .ticket-chip{display:inline-flex;align-items:center;gap:.5cqw;background:#7a40161a;border-radius:3cqw;padding:0 2.2cqw;font-size:3.1cqw}
#s6-v2 .ticket-chip img{width:4.8cqw;height:4.8cqw}
/* hero page */
#s6-v2 .hero-stage .stars{gap:1.4cqw}
#s6-v2 .hero-stage .star-row{font-size:6.6cqw}
#s6-v2 .v2-button.star-button{width:8cqw;height:8cqw;min-height:0;padding:.6cqw;border-radius:50%;border-image:none!important;background:radial-gradient(#fff6c4,#f7c443)!important;border:2px solid #d49326!important;margin-left:1.5cqw}
#s6-v2 .star-button img{width:100%;height:100%}
#s6-v2 .roles{display:flex;justify-content:center;align-items:center;gap:1cqw;font-size:3.4cqw}
#s6-v2 .roles .ico{color:#c98b22}
#s6-v2 .roles span{margin-left:2.4cqw;color:#86664a;font-size:3cqw}
#s6-v2 .formation-link .ico{width:4cqw;height:4cqw}
#s6-v2 .experience .exp-track{flex:1;height:2.8cqw}
#s6-v2 .experience .exp-track i{background:linear-gradient(#ffe56f,#f0ad1a)}
#s6-v2 .experience small{font-size:3.2cqw}
#s6-v2 .page-actions button{min-height:10.5cqw;font-size:4.6cqw;min-width:38%}
#s6-v2 .card-title{font-size:4.8cqw!important;margin:0 0 1.2cqw .6cqw!important}
#s6-v2 .hero-skills{grid-template-columns:repeat(4,1fr) 1px 1fr;align-items:start;gap:1.2cqw}
#s6-v2 .hero-skills .kind{background:#fbdcb0;border-radius:2cqw;padding:0 2cqw;font-size:2.7cqw}
#s6-v2 .hero-skills img{width:14cqw;height:14cqw}
#s6-v2 .hero-skills b{font-size:3.1cqw;white-space:nowrap}
#s6-v2 .skill-divider{align-self:stretch;background:#e6c79c;margin:2cqw 0}
#s6-v2 .tree-button img{width:15cqw!important;height:15cqw!important;margin-top:2.4cqw}
#s6-v2 .attributes .stat-row{font-size:3.3cqw;min-height:6cqw;margin:.35cqw 0}
#s6-v2 .party-tags{display:flex;gap:.8cqw;align-items:center}
#s6-v2 .party-tags i{font-style:normal;background:#f6dfbd!important;border-radius:1.6cqw;padding:0 1.3cqw;font-size:2.5cqw;display:inline-flex;align-items:center;gap:.4cqw;color:#5d3216}
#s6-v2 .party-tags .ico{width:3cqw;height:3cqw;color:#d18d1f}
#s6-v2 .turn-arrow{color:#5d3216;font-size:3cqw}
/* bag */
#s6-v2 .part-tabs .ico{width:6.4cqw;height:6.4cqw;color:#6b4423}
#s6-v2 .bag-footer{padding:1.4cqw 1.6cqw;font-size:3.9cqw}
#s6-v2 .bag-footer>b{font-size:3.9cqw;white-space:nowrap}
#s6-v2 .bag-footer .expand-button{font-size:3.7cqw;min-height:9cqw;padding:1cqw 3.4cqw;gap:1cqw;border-radius:6cqw}
#s6-v2 .expand-button img{width:5.6cqw;height:5.6cqw}
#s6-v2 .expand-button .ico{width:5.2cqw;height:5.2cqw;color:#7a4a26}
#s6-v2 .bag-footer .salvage-button{font-size:4.8cqw;min-height:11cqw;min-width:35%;border-radius:6cqw}
#s6-v2 .part-tabs.labeled{border-top:1px solid #ecd2a6;padding-top:1.6cqw;gap:.4cqw}
#s6-v2 .part-tabs.labeled button{flex-direction:column;height:auto;min-height:13.5cqw;padding:.6cqw 0;border-radius:2.6cqw;gap:.2cqw}
#s6-v2 .part-tabs.labeled img{width:7.4cqw;height:7.4cqw}
#s6-v2 .part-tabs.labeled small{font-size:2.9cqw}
/* rewards */
#s6-v2 .reward{background:linear-gradient(135deg,#ffffff4d,transparent 55%),var(--quality,#48b7e5);border-radius:2cqw}
#s6-v2 .reward>b{font-size:3.1cqw}
#s6-v2 .reward-scroll{height:auto;min-height:19cqw;max-height:40cqw;background:#f6e5cc;border:1px solid #efd6b0;border-radius:2.6cqw;padding:2cqw}
/* recruit */
#s6-v2 .recruit-page{padding-top:2cqw}
#s6-v2 .recruit-page>.wallet .resource{height:7.4cqw;font-size:3.9cqw;padding:0 3cqw 0 .3cqw}
#s6-v2 .recruit-page>.wallet .resource img{height:8.4cqw;width:8.4cqw}
#s6-v2 .recruit-page .menu{position:static;width:9.4cqw;height:9.4cqw;font-size:6cqw;padding:0}
#s6-v2 .ticket-resource img{transform:rotate(-12deg)}
#s6-v2 .recruit-page>.main-tabs{padding:0 5cqw}
#s6-v2 .recruit-banner{align-self:flex-start;display:flex;flex-direction:column;align-items:center;margin:1.5cqw 0 0 1cqw;z-index:3}
#s6-v2 .recruit-banner h1{display:flex;align-items:center;gap:.4cqw;font-size:9.4cqw;color:#fff8e2;-webkit-text-stroke:.5cqw #5b2c0e;paint-order:stroke fill;text-shadow:0 .8cqw #5b2c0e;letter-spacing:.3cqw}
#s6-v2 .recruit-banner .laurel{width:7cqw;height:11cqw}
#s6-v2 .ribbon{background:linear-gradient(#ad6d33,#7c4520);color:#ffe8b0;font-size:3.5cqw;padding:.6cqw 6cqw;clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,5% 50%);letter-spacing:.2cqw;margin:0}
#s6-v2 .recruit-cast{position:relative;flex:1;min-height:30cqw;margin-top:-6cqw}
#s6-v2 .recruit-cast .cast{position:absolute;object-fit:contain;filter:drop-shadow(0 1.5cqw 1.5cqw #0006)}
#s6-v2 .c-front{width:58%;height:66%;left:21%;bottom:0;z-index:4}
#s6-v2 .c-left{width:40%;height:46%;left:0;top:28%;z-index:2}
#s6-v2 .c-right{width:40%;height:46%;right:0;top:24%;z-index:2}
#s6-v2 .c-back{width:38%;height:42%;left:31%;top:8%;z-index:1}
#s6-v2 .up-badge{position:absolute;right:13%;bottom:14%;z-index:5;background:linear-gradient(#a874ea,#6a39bf);color:#fff;border:2px solid #ffe08a;border-radius:3cqw;padding:.5cqw 2.6cqw;font-size:3.9cqw;display:flex;flex-direction:column;align-items:center;line-height:1.15;transform:rotate(-6deg);box-shadow:0 2px 4px #0005}
#s6-v2 .up-badge b{background:#ffd23f;color:#6a39bf;border-radius:2cqw;padding:0 2.4cqw;font-size:3.4cqw}
#s6-v2 .recruit-bottom{gap:2.2cqw;padding:1cqw 3cqw 1.4cqw}
#s6-v2 .pity-panel{align-self:center;width:74%;display:flex;align-items:center;gap:2.6cqw;background:linear-gradient(#fff8ea,#ffe8c6);border:2px solid #e6c088;border-radius:6cqw;padding:1.4cqw 5cqw 1.4cqw 2cqw;color:#5d3216;box-shadow:0 2px 5px #0004}
#s6-v2 .pity-panel .crown{width:11cqw;height:11cqw;flex-shrink:0;border-radius:50%;background:radial-gradient(#fff1b8,#f6c64f);display:flex;align-items:center;justify-content:center;color:#d6870a}
#s6-v2 .pity-panel .crown .ico{width:7cqw;height:7cqw}
#s6-v2 .pity-panel>div{flex:1;display:flex;flex-direction:column;align-items:center;gap:.6cqw;font-size:3.6cqw}
#s6-v2 .pity-panel em{color:#d9412b;font-size:1.1em}
#s6-v2 .pity-panel small{font-size:3.1cqw}
#s6-v2 .pool-links{justify-content:space-between;padding:0 5cqw}
#s6-v2 .pool-links button{font-size:3.5cqw;min-height:7.6cqw;gap:1.2cqw;padding:1cqw 3.4cqw}
#s6-v2 .pool-links .ico{width:4.6cqw;height:4.6cqw}
#s6-v2 .recruit-bottom .page-actions{gap:3cqw}
#s6-v2 .recruit-bottom .page-actions button{min-width:45%;min-height:16cqw;flex-direction:column;gap:.2cqw}
#s6-v2 .recruit-bottom .page-actions b,#s6-v2 .results-screen .dialog-actions b{font-size:5cqw}
/* dungeon */
#s6-v2 .dungeon-list{gap:2.4cqw}
#s6-v2 .dungeon-card{grid-template-columns:44% 56%;border:1.5px solid #f3dab4;padding:1.5cqw;max-height:none;flex:1;min-height:0}
#s6-v2 .dungeon-card>div{padding:.4cqw .6cqw .4cqw 3cqw;gap:1.2cqw}
#s6-v2 .dungeon-card h2{text-align:left;font-size:5.2cqw}
#s6-v2 .drop-icons{justify-content:flex-start;align-items:flex-start;flex:none;gap:1.4cqw}
#s6-v2 .drop-icons>.reward{width:13cqw;max-height:none}
#s6-v2 .dungeon-card footer{margin-top:auto}
#s6-v2 .dungeon-card footer small{font-size:3.1cqw;display:inline-flex;align-items:center;gap:.4cqw}
#s6-v2 .dungeon-card footer .ico,#s6-v2 .feature-row>b .ico,#s6-v2 .challenge-cost .ico{color:#4fb22a}
#s6-v2 .dungeon-card footer button{font-size:4.8cqw;min-height:9.6cqw;padding:.5cqw 7cqw}
#s6-v2 .resume-button{font-size:4cqw;min-height:9cqw}
#s6-v2 .feature-card{flex:1;min-height:0;display:flex;flex-direction:column;background:#fff4e2;border:1.5px solid #f1d6ad;border-radius:3.6cqw;overflow:hidden;box-shadow:0 2px 3px #a86a3522}
#s6-v2 .feature-art{position:relative;flex:1;min-height:36cqw;background-size:cover;background-position:center bottom}
#s6-v2 .feature-title{position:absolute;top:2.4cqw;left:0;right:0;display:flex;flex-direction:column;align-items:center}
#s6-v2 .title-row{display:flex;align-items:center;gap:.6cqw}
#s6-v2 .feature-title h2{font-size:9.4cqw;color:#fff4cf;-webkit-text-stroke:.5cqw #6b3510;paint-order:stroke fill;text-shadow:0 .8cqw #6b3510;letter-spacing:.4cqw}
#s6-v2 .feature-title .laurel{width:7cqw;height:11cqw}
#s6-v2 .feature-title .ribbon{background:linear-gradient(#fff6de,#f3d9a4);color:#5d3216;font-size:3.8cqw;padding:.6cqw 7cqw;margin-top:-1cqw}
#s6-v2 .help-button{position:absolute;right:2.4cqw;top:2.4cqw;width:8.4cqw;height:8.4cqw;background:#fff4dc!important;border-radius:50%;color:#6b3d1c;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px #0004!important}
#s6-v2 .help-button .ico{width:7cqw;height:7cqw}
#s6-v2 .feature-panel{display:flex;flex-direction:column;padding:.6cqw 3cqw 1.2cqw;background:#fff6e7}
#s6-v2 .feature-row{display:flex;align-items:center;gap:2.4cqw;padding:1.6cqw 0;border-bottom:1px solid #efd7b2;font-size:3.9cqw;min-height:12cqw}
#s6-v2 .feature-row:last-child{border-bottom:0}
#s6-v2 .feature-row>b{white-space:nowrap;display:inline-flex;align-items:center;gap:.6cqw}
#s6-v2 .feature-row>i{width:1px;align-self:stretch;background:#e5c697;margin:1cqw 0}
#s6-v2 .feature-row small{font-size:3.1cqw;color:#7a5a3c}
#s6-v2 .feature-row.record>.ico{width:10cqw;height:10cqw;color:#f0b323}
#s6-v2 .feature-row.record strong{font-size:4.8cqw}
#s6-v2 .feature-rewards{display:flex;gap:4.4cqw;flex:1;justify-content:center;align-items:flex-start}
#s6-v2 .feature-rewards .reward{width:14.5cqw}
#s6-v2 .feature-rewards>span{display:flex;flex-direction:column;align-items:center;gap:.3cqw}
#s6-v2 .feature-rewards>span>small{font-size:2.7cqw}
#s6-v2 .lineup{display:flex;align-items:center;gap:2.4cqw;flex:1;justify-content:flex-end}
#s6-v2 .round-face{position:relative;display:block;width:14.5cqw;height:14.5cqw}
#s6-v2 .round-face .disc{display:block;width:100%;height:100%;border-radius:50%;overflow:hidden;background:radial-gradient(#fff6db,#f6cf8a);border:2px solid #e2a84a}
#s6-v2 .round-face .face{width:100%;height:100%;object-fit:cover;object-position:50% 0;transform:scale(1.55);transform-origin:50% 12%}
#s6-v2 .round-face b{position:absolute;left:50%;bottom:-1.4cqw;transform:translateX(-50%);background:#6b3d1c;color:#fff;font-size:2.5cqw;border-radius:2cqw;padding:0 1.6cqw;white-space:nowrap}
#s6-v2 .lineup>i{width:1px;align-self:stretch;background:#e5c697}
#s6-v2 .lineup-button{flex-direction:column;min-height:13cqw;padding:1cqw 2.4cqw;gap:0}
#s6-v2 .lineup-button .ico{width:6.4cqw;height:6.4cqw;color:#e3a21a}
#s6-v2 .lineup-button small{font-size:3.2cqw}
#s6-v2 .go-button{margin-left:auto;font-size:5.2cqw;min-height:11cqw;min-width:36%}
#s6-v2 .daily-card header{display:flex;align-items:center;justify-content:center;gap:3cqw;padding:2.4cqw}
#s6-v2 .daily-card header h2{font-size:6.6cqw}
#s6-v2 .daily-card header>i{width:1px;height:7cqw;background:#e2c393}
#s6-v2 .today{display:inline-flex;align-items:center;gap:1cqw;background:#ffe5b6;border-radius:4cqw;padding:.6cqw 2.6cqw;font-size:3.4cqw}
#s6-v2 .today .ico{color:#e2492f;width:5cqw;height:5cqw}
#s6-v2 .daily-card .feature-art{margin:0 2.4cqw;border-radius:3cqw;background-position:center}
#s6-v2 .daily-card .feature-panel{margin:2cqw 2.4cqw 2.4cqw;border:1px solid #efd5ac;border-radius:3cqw}
#s6-v2 .challenge-heading>img{width:38%;border:2px solid #f2d7ae}
#s6-v2 .challenge-heading h3{font-size:5.2cqw}
#s6-v2 .challenge-heading small{display:block;font-size:3.3cqw;margin-top:.8cqw}
#s6-v2 .challenge-dialog .main-tabs button{min-height:9cqw;font-size:4.2cqw}
#s6-v2 .challenge-cost{display:flex;align-items:center;gap:1cqw;font-size:3.3cqw;margin:0}
#s6-v2 .challenge-dialog .dialog-actions button{min-height:9.5cqw;font-size:4.4cqw;min-width:40%}
#s6-v2 .pool-name{display:block;text-align:center;align-self:center;background:#fbe1bb;border-radius:3cqw;padding:.6cqw 5cqw;font-size:4cqw}
#s6-v2 .pool-name.lined{display:flex;align-items:center;gap:2cqw;background:none;font-size:4.1cqw}
#s6-v2 .pool-name.lined:before,#s6-v2 .pool-name.lined:after{content:'';width:10cqw;height:1px;background:#e1bc80}
#s6-v2 .result-line{text-align:center;font-size:3.6cqw}
#s6-v2 .offline-rates{gap:3cqw}
#s6-v2 .offline-rates .resource{font-size:3.9cqw;height:8.4cqw;padding:0 3.4cqw 0 .6cqw;background:#fbe1bc;border:0;box-shadow:none}
#s6-v2 .offline-rates .resource img{width:8.4cqw;height:8.4cqw}
#s6-v2 .idle-time{display:flex;align-items:center;justify-content:center;gap:2.6cqw;font-size:3.7cqw}
#s6-v2 .idle-time span{display:inline-flex;align-items:center;gap:1.2cqw;background:linear-gradient(#ebf6cc,#d5ebaa);border-radius:4cqw;padding:.6cqw 3.4cqw;color:#3a5719}
#s6-v2 .idle-time .ico{color:#5b3a1c;width:4.6cqw;height:4.6cqw}
#s6-v2 .idle-time small{border-left:1px solid #d9b98b;padding-left:2.6cqw;font-size:3.3cqw;color:#86664a}
/* salvage */
#s6-v2 .label-line{font-size:3.9cqw;margin:.4cqw 1cqw 0}
#s6-v2 .quality-checks{display:flex;flex-wrap:nowrap;justify-content:space-between;background:#f7e5cb;border-radius:2.6cqw;padding:1.6cqw 2.4cqw}
#s6-v2 .check-option{display:inline-flex!important;align-items:center;gap:1cqw;font-size:3.7cqw}
#s6-v2 .box{width:5.4cqw;height:5.4cqw;border:2px solid #9a6a3e;border-radius:1.2cqw;background:#fff;display:flex;align-items:center;justify-content:center;font-style:normal}
#s6-v2 .box.on{background:#fff4cc;border-color:#c98622}
#s6-v2 .box .ico{width:4.6cqw;height:4.6cqw;color:#7a4316}
#s6-v2 .lock-note{display:flex;align-items:center;justify-content:center;gap:1.4cqw;background:#fbdfbf;border-radius:2.2cqw;padding:1.2cqw;font-size:3.3cqw}
#s6-v2 .lock-note .ico{color:#d29a2b;width:4.4cqw;height:4.4cqw}
#s6-v2 .list-heading{font-size:3.9cqw;padding:0 1cqw}
#s6-v2 .list-heading em{color:#3d9a1f}
#s6-v2 .checked{left:auto;right:2%;top:2%;bottom:auto;background:none;padding:0;line-height:0}
#s6-v2 .checked .ico{width:6.4cqw;height:6.4cqw;color:#ffe04a;filter:drop-shadow(0 0 1px #7a4a0f) drop-shadow(0 1px 0 #7a4a0f)}
#s6-v2 .salvage-scroll{height:60cqw;background:#fff8ee;border:1px solid #efd7b2;border-radius:2.6cqw;padding:1.6cqw}
#s6-v2 .material-line{justify-content:space-between;padding:1cqw 2cqw;font-size:3.9cqw}
#s6-v2 .material-line span{display:inline-flex;align-items:center;gap:1cqw;font-size:4.1cqw}
#s6-v2 .material-line img{width:7.4cqw;height:7.4cqw}
/* pools */
#s6-v2 .pool-heroes{grid-template-columns:repeat(4,1fr);gap:2.6cqw;padding:0 1.6cqw}
#s6-v2 .pool-heroes .portrait-tile{width:100%}
#s6-v2 .rules{margin:0;padding:1.8cqw 2cqw 1.8cqw 7cqw;background:#fff8ec;border:1px solid #ecd2aa;border-radius:2.6cqw;font-size:3.4cqw;line-height:1.85}
/* talents */
#s6-v2 .talent-wallet{display:flex;align-items:center;justify-content:center;gap:2cqw;font-size:4.1cqw}
#s6-v2 .talent-wallet .face{width:9.4cqw;height:9.4cqw;border-radius:50%;object-fit:cover;object-position:50% 0;background:#fde4bd}
#s6-v2 .talent-wallet>i{width:1px;height:5.4cqw;background:#d9b98b}
#s6-v2 .talent-wallet em{font-size:5.2cqw}
#s6-v2 .talent-tree{height:90cqw;min-height:0;flex-shrink:0;background:radial-gradient(ellipse at 50% 55%,#fff7df,transparent 72%)}
#s6-v2 .talent-tree .trunk{stroke:#a8692f;stroke-width:9px;fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
#s6-v2 .talent-tree .branch{stroke:#b57a3d;stroke-width:5px;fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
#s6-v2 .talent-tree .leaves ellipse{fill:#86c443;stroke:#4f7e22;stroke-width:1px;vector-effect:non-scaling-stroke}
#s6-v2 .v2-button.talent-node{width:12.5cqw;height:12.5cqw;border-radius:50%;border-image:none!important;background:radial-gradient(circle at 50% 32%,#ffffff,#dcd7ce 55%,#aaa397)!important;border:3px solid #f4e7d0!important;box-shadow:0 0 0 2px #bba585,0 2px 3px #0003!important;color:#8f8a82;font-size:inherit}
#s6-v2 .talent-tree>button:nth-of-type(-n+5){width:14.5cqw;height:14.5cqw}
#s6-v2 .talent-node .ico{width:55%;height:55%}
#s6-v2 .talent-node.ready{color:#6f5b45}
#s6-v2 .talent-node.learned{background:radial-gradient(circle at 50% 32%,#fff8bd,#ffc72d 55%,#e2890b)!important;color:#fff;box-shadow:0 0 0 2px #c9831a,0 0 9px #ffd34a!important}
#s6-v2 .talent-node.learned .ico{filter:drop-shadow(0 1px 0 #a35a06)}
#s6-v2 .talent-node.current{box-shadow:0 0 0 3px #62d036,0 0 12px 4px #8cf05a!important}
#s6-v2 .talent-node b{position:absolute;bottom:-2.2cqw;left:50%;transform:translateX(-50%);background:#6b3d1c;color:#fff;font-size:2.5cqw;border-radius:2cqw;padding:0 1.4cqw;line-height:1.5}
#s6-v2 .talent-info{display:flex;align-items:center;gap:3cqw;background:#fff8ec;border:1px solid #edd3ab;border-radius:3cqw;padding:2.2cqw 3.4cqw}
#s6-v2 .talent-info>div{flex:1;display:flex;flex-direction:column;gap:.6cqw}
#s6-v2 .talent-info h3{font-size:4.6cqw}
#s6-v2 .talent-info p{font-size:3.3cqw;color:#7a5a3c}
#s6-v2 .talent-info>i{width:1px;align-self:stretch;background:#e2c393}
#s6-v2 .talent-info>b{font-size:3.9cqw;white-space:nowrap}
#s6-v2 .talent-info em{font-size:5cqw}
/* formation */
#s6-v2 .formation-scene{height:42%;flex-shrink:0}
#s6-v2 .title-plaque.plaque{display:flex;width:max-content;margin:2.6cqw auto 0!important;font-size:inherit}
#s6-v2 .title-plaque .plate{font-size:5.6cqw;padding:1.6cqw 7cqw;letter-spacing:.6cqw}
#s6-v2 .standing-heroes{position:absolute;inset:15cqw 2% 3cqw;display:block}
#s6-v2 .standing-heroes .v2-button.standing{position:absolute;transform:translate(-50%,-50%);width:30%;display:flex;flex-direction:column;align-items:center;gap:0;border-image:none!important;background:none!important;border:0;padding:0;min-height:0;isolation:isolate}
#s6-v2 .standing .face{width:100%;height:17cqw;object-fit:contain;filter:drop-shadow(0 1cqw 0 #00000022)}
#s6-v2 .standing.front .face{height:21cqw}
#s6-v2 .standing:before{content:'';position:absolute;bottom:3.6cqw;width:78%;height:5cqw;border-radius:50%;background:radial-gradient(#fff4b8ee,#ffd76a77 55%,transparent 72%);z-index:-1}
#s6-v2 .role-tag{display:inline-flex;align-items:center;gap:.8cqw;background:#fff6e4ee;border-radius:3cqw;padding:.3cqw 2cqw .3cqw .4cqw;font-size:2.8cqw;white-space:nowrap;box-shadow:0 1px 2px #0002;margin-bottom:.4cqw}
#s6-v2 .role-tag .role-badge{position:static;width:4.8cqw;height:4.8cqw;border-width:1px}
#s6-v2 .role-tag .role-badge .ico{width:3cqw;height:3cqw}
#s6-v2 .row-plaque{margin-top:-1.6cqw;background:linear-gradient(#fff5dc,#ffd98e);border:1.5px solid #d9a24c;border-radius:1.6cqw;padding:0 3.4cqw;font-size:3cqw;line-height:1.5}
#s6-v2 .standing small{background:none;font-size:3.2cqw;color:#4d2a12;text-shadow:0 0 2px #fff,0 0 3px #fff;padding:0;margin-top:.3cqw}
#s6-v2 .standing-heroes .empty-position{position:absolute;transform:translate(-50%,-50%);width:15cqw;height:15cqw;min-height:0;border-radius:50%}
#s6-v2 .formation-sheet{flex:1;min-height:0;display:flex;flex-direction:column;background:#fff4e2;border-radius:4.6cqw 4.6cqw 0 0;margin-top:-4cqw;position:relative;box-shadow:0 -2px 5px #a8692f2a}
#s6-v2 .formation-toolbar{padding:2.6cqw 3cqw;gap:1.6cqw;font-size:3.7cqw;border-bottom:1px solid #efd7b2;justify-content:flex-start}
#s6-v2 .formation-toolbar>i{width:1px;height:6.4cqw;background:#e2c393}
#s6-v2 .preset-buttons{display:flex;gap:1.4cqw}
#s6-v2 .preset-buttons .v2-button{width:8.4cqw;height:8.4cqw;min-height:0;padding:0;border-radius:50%;font-size:4.2cqw;border-image:none!important;background:linear-gradient(#fff7e8,#ffe2bb)!important;border:1.5px solid #e2b77a!important}
#s6-v2 .preset-buttons .v2-button.selected{background:linear-gradient(#ffe86a,#ffbe14)!important;border-color:#d99a1c!important}
#s6-v2 .formation-name{margin-left:auto;font-size:3.5cqw}
#s6-v2 .formation-toolbar>button{font-size:3.7cqw;min-height:8.6cqw;padding:1cqw 3.4cqw;gap:1cqw}
#s6-v2 .formation-toolbar>button .ico{width:4.6cqw;height:4.6cqw}
#s6-v2 .roster-grid{gap:2.6cqw;padding:3cqw}
#s6-v2 .secondary-close{min-height:12cqw;font-size:5.4cqw;width:48%}
#s6-v2 .formation-types{gap:2.6cqw}
#s6-v2 .v2-button.formation-option{display:flex;flex-direction:column;align-items:stretch;background:#fff8ec;border:2px solid #efd5ab;border-radius:3cqw;padding:1.6cqw;gap:.6cqw;text-align:left}
#s6-v2 .v2-button.formation-option.picked{border-color:#f0b323;box-shadow:0 0 0 1px #f8cf5c,inset 0 0 14px #ffe39a;background:#fffbea}
#s6-v2 .formation-option header{display:flex;align-items:center;gap:1cqw}
#s6-v2 .formation-option header>.ico{width:6cqw;height:6cqw;background:#a56a2f;color:#fff;border-radius:50%;padding:.9cqw}
#s6-v2 .formation-option h3{font-size:3.9cqw}
#s6-v2 .formation-option header small{margin-left:auto;font-size:2.5cqw;color:#7a5a3c;white-space:nowrap}
#s6-v2 .radio{width:5.2cqw;height:5.2cqw;border-radius:50%;border:1.5px solid #b08a5c;background:#fff;display:flex;align-items:center;justify-content:center;font-style:normal;flex-shrink:0}
#s6-v2 .radio.on{background:#f5b621;border-color:#d58d14}
#s6-v2 .radio .ico{width:3.8cqw;height:3.8cqw;color:#fff}
#s6-v2 .formation-mini{position:relative;height:38cqw;display:block}
#s6-v2 .formation-mini>div{position:absolute;transform:translate(-50%,-50%);width:auto;display:flex;flex-direction:column;align-items:center}
#s6-v2 .formation-mini .face{width:13.5cqw;height:13.5cqw;object-fit:contain}
#s6-v2 .formation-mini b{font-size:2.6cqw;white-space:nowrap;background:radial-gradient(#ffe7a0,#ffe7a000 72%);padding:0 1.4cqw;margin-top:-1cqw}
#s6-v2 .formation-note{display:flex;justify-content:center;align-items:center;gap:1.6cqw;background:#fbe5c6;border-radius:3cqw;padding:1.2cqw;font-size:3.3cqw}
#s6-v2 .formation-note .ico{color:#b98a4a}
/* upgrade page */
#s6-v2 .forge-scene{height:44%}
#s6-v2 .forge-scene>.title-plaque{position:absolute;left:50%;top:0;transform:translateX(-50%);margin:2.6cqw 0 0!important}
#s6-v2 .forge-item{top:20cqw;left:3cqw;gap:2cqw}
#s6-v2 .forge-item>.gear-tile{width:18cqw;border:2px solid #fff3cf;box-shadow:0 2px 3px #0003}
#s6-v2 .forge-item>div{display:flex;flex-direction:column;gap:.8cqw}
#s6-v2 .forge-item h2{font-size:4.6cqw;color:#fff;-webkit-text-stroke:.35cqw #5d3216;paint-order:stroke fill}
#s6-v2 .upgrade-body{background:#fff4e2;border-radius:5cqw 5cqw 0 0;margin-top:-4cqw;position:relative;padding:2cqw 5cqw 1cqw;z-index:1;box-shadow:0 -2px 5px #6b3d1c26}
#s6-v2 .level-preview{font-size:7.6cqw;padding:1cqw 0 1.4cqw;display:flex;justify-content:center;align-items:center;gap:3cqw}
#s6-v2 .level-preview i{font-style:normal;font-size:6cqw}
#s6-v2 .upgrade-body .stat-row{font-size:4.1cqw;min-height:7.6cqw;padding:1cqw 4cqw;margin:.5cqw 0}
#s6-v2 .upgrade-body .stat-row .ico{width:5.2cqw;height:5.2cqw}
#s6-v2 .upgrade-costs{justify-content:space-between;padding:2.4cqw 2cqw 0;gap:3cqw}
#s6-v2 .upgrade-costs>div{gap:.8cqw}
#s6-v2 .cost-icon{width:13.5cqw;height:13.5cqw;background:linear-gradient(#fffaf0,#f5e0c0);border:1.5px solid #d9b385;border-radius:2.6cqw;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 2px #0002}
#s6-v2 .cost-icon img{width:82%;height:82%}
#s6-v2 .upgrade-costs b{font-size:3.8cqw}
#s6-v2 .upgrade-costs em{color:#3d9a1f}
#s6-v2 .upgrade-costs button{min-width:40%;min-height:12.5cqw;font-size:5.6cqw}
#s6-v2 .breakthrough-note{font-size:3.3cqw;margin-top:1.4cqw}
@media(max-height:700px){#s6-v2 .talent-tree{height:72cqw}#s6-v2 .recruit-bottom .page-actions button{min-height:13cqw}#s6-v2 .feature-row{min-height:10cqw;padding:1cqw 0}}
#s6-v2 .talent-node .ico{position:static;inset:auto;width:55%;height:55%;overflow:visible}
#s6-v2 .talent-node .ico path{fill:currentColor;stroke:none}
#s6-v2 .v2-button.talent-node{background:radial-gradient(circle at 50% 30%,#f8f6f2,#d3cdc3 58%,#a2998b)!important;padding:0}
#s6-v2 .talent-node.ready{color:#6b5a48}
#s6-v2 .formation-option h3{white-space:nowrap}
#s6-v2 .formation-mini .face{width:15.5cqw;height:15.5cqw}
#s6-v2 .formation-mini b{font-size:2.8cqw}
#s6-v2 .v2-scrim.warm{background:radial-gradient(ellipse at 50% 40%,#3b2a14d9,#120b05f2 75%)}
#s6-v2 .rewards-fullscreen .celebrate h2{font-size:12.5cqw}
#s6-v2 .rewards-fullscreen .laurel{width:11cqw;height:17cqw}
#s6-v2 .hero-card .portrait .face{object-fit:cover;object-position:50% 18%;transform:scale(1.12);transform-origin:50% 30%}
#s6-v2 .standing .face{height:21cqw}
#s6-v2 .standing.front .face{height:26cqw}
#s6-v2 .standing-heroes{inset:13cqw 2% 2cqw}
#s6-v2 .formation-toolbar{gap:1.2cqw;font-size:3.4cqw;padding:2.4cqw 2.4cqw}
#s6-v2 .formation-toolbar>b,#s6-v2 .formation-name{white-space:nowrap}
#s6-v2 .formation-toolbar>button{font-size:3.4cqw;padding:1cqw 2.6cqw}
#s6-v2 .preset-buttons .v2-button{width:7.6cqw;height:7.6cqw}
#s6-v2 .feature-row small{white-space:nowrap}
#s6-v2 .feature-row{gap:2cqw}
#s6-v2 .ico path{fill-rule:evenodd}
#s6-v2 .rules{text-align:left}
#s6-v2 .card-title{text-align:left;align-self:flex-start}
#s6-v2 .roles span{white-space:nowrap}
#s6-v2 .party-tags i{white-space:nowrap;padding:0 1cqw}
#s6-v2 .party-tags{gap:.5cqw}

#s6-v2 .locked-skill-icon{display:flex;width:13.2cqw;height:13.2cqw;align-items:center;justify-content:center;border-radius:2cqw;background:linear-gradient(#d7cfc2,#bbb0a0);color:#897864}
#s6-v2 .locked-skill-icon .ico{width:7cqw;height:7cqw;stroke:none}
/* Hero-page spacing and safe-area pass (2026-11-19). */
#s6-v2 .hero-page{padding: max(18px,env(safe-area-inset-top,0px)) 2.4cqw 0;gap:2.4cqw;background-size:100% 100%,100% auto;background-attachment:local,local}
#s6-v2 .hero-page>.wallet{min-height:8cqw;flex-shrink:0;margin:0 1cqw}
#s6-v2 .resource{align-items:center;line-height:1;padding:.4cqw 2cqw!important;gap:1cqw}
#s6-v2 .resource img,#s6-v2 .page>.wallet .resource img{display:block;object-fit:contain;object-position:center;width:6.5cqw;height:6.5cqw;flex:none;align-self:center;margin:0;transform:none}
#s6-v2 .hero-page .v2-button:not(.flat):not(.equipment-slot){border-image:none!important;border:1px solid #ce9437!important;background:linear-gradient(#ffdf54,#ffc120)!important;box-shadow:0 2px 2px #a76a2338!important;text-shadow:none}
#s6-v2 .hero-page .v2-button.quiet:not(.flat){background:linear-gradient(#fff1dd,#ffe2bb)!important;border-color:#dfbd8d!important}
#s6-v2 .hero-tabs{gap:1.4cqw}
#s6-v2 .hero-tabs button{height:10.5cqw;padding:.4cqw 1cqw;gap:.5cqw;justify-content:center;font-size:3.2cqw;overflow:hidden}
#s6-v2 .hero-tabs .face{display:block;width:8.2cqw;height:8.2cqw;margin:0;flex:none;object-fit:contain}
#s6-v2 .hero-stage{height:90cqw;min-height:90cqw;max-height:90cqw;flex:none;padding-top:0}
#s6-v2 .hero-stage h1{line-height:1.3;font-size:4.8cqw}
#s6-v2 .hero-stage .stars{height:9cqw;line-height:1;margin:.6cqw 0}
#s6-v2 .hero-stage .star-row{font-size:5.8cqw}
#s6-v2 .hero-stage .roles{height:5.4cqw;margin:0;gap:1cqw;font-size:3.1cqw}
#s6-v2 .hero-role-icon{display:flex;align-items:center;justify-content:center;width:5cqw;height:5cqw;border:1px solid #c58f35;border-radius:50%;background:#ffe3a7;color:#82551d}
#s6-v2 .hero-role-icon .ico{width:3.4cqw;height:3.4cqw;color:inherit}
#s6-v2 .hero-figure{left:50%;transform:translateX(-50%);bottom:9cqw;width:49cqw;height:55cqw;object-fit:contain;object-position:center}
#s6-v2 .equipment-left,#s6-v2 .equipment-right{top:21cqw;bottom:0;width:18cqw;justify-content:space-between;padding-bottom:.4cqw}
#s6-v2 .equipment-left{left:1.8cqw}#s6-v2 .equipment-right{right:1.8cqw}
#s6-v2 .equipment-slot{gap:.8cqw;align-items:center;height:22cqw;flex-shrink:0}
#s6-v2 .equipment-slot .gear-tile{height:18cqw;width:18cqw;flex-shrink:0}
#s6-v2 .equipment-slot small{display:block;height:3.4cqw;line-height:3.4cqw;margin:0;font-size:2.8cqw}
#s6-v2 .gear-tile>img:not(.gear-lock){position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:100%;height:100%;padding:0;display:block;object-fit:contain;object-position:center}
#s6-v2 .formation-link{left:50%;transform:translateX(-50%);bottom:1cqw;width:16cqw;min-height:6.2cqw;font-size:2.7cqw;white-space:nowrap;margin:0}
#s6-v2 .experience{padding:1cqw 1.8cqw;gap:1.4cqw;min-height:7cqw;flex-shrink:0}
#s6-v2 .experience small{font-size:2.9cqw;line-height:1.2}
#s6-v2 .experience .exp-track{height:2.5cqw;min-width:8cqw}
#s6-v2 .experience-reset{width:6cqw;height:6cqw;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%;color:#8e5826}
#s6-v2 .experience-reset .ico{width:4.6cqw;height:4.6cqw}
#s6-v2 .hero-page>.page-actions{gap:3cqw;margin:0;padding:0 3cqw}
#s6-v2 .hero-page>.page-actions button{width:44%;min-height:8.4cqw;font-size:3.8cqw}
#s6-v2 .hero-page>.cream-card{padding:2.4cqw;margin:0;border-radius:3cqw}
#s6-v2 .hero-page .card-title{font-size:4.2cqw!important;line-height:1.3;margin:0 0 2cqw!important}
#s6-v2 .hero-skills button{padding:0;gap:1cqw;border:0!important;border-image:none!important;background:none!important;box-shadow:none!important;outline-offset:3px;line-height:1.25}
#s6-v2 .hero-skills img{display:block;object-fit:contain;border:0;box-shadow:none;background:none;width:13.2cqw;height:13.2cqw}
#s6-v2 .hero-skills .unavailable img{clip-path:inset(1px round 2cqw)}
#s6-v2 .hero-skills b{font-size:2.75cqw}#s6-v2 .hero-skills small{font-size:2.5cqw}
#s6-v2 .hero-attribute-grid{display:grid;grid-template-columns:1fr 1fr;gap:1cqw 2cqw}
#s6-v2 .attributes .stat-row{font-size:2.9cqw;min-height:5.3cqw;padding:.6cqw 1.5cqw;margin:0;gap:.5cqw}
#s6-v2 .attributes .stat-row>span{display:flex;align-items:center;gap:1cqw;white-space:nowrap}
#s6-v2 .attributes .ico{color:#a46e36;width:3.5cqw;height:3.5cqw;stroke:#785024;stroke-width:.5;stroke-linejoin:round}
#s6-v2 .attributes .stat-row>b{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
#s6-v2 .attribute-note{display:block;text-align:right;font-size:2.3cqw;color:#987653;margin-top:1.5cqw}
#s6-v2 .hero-page>.v2-nav{margin-top:0;flex-shrink:0;padding-top:1.5cqw;bottom:0;padding-bottom:max(1.5cqw,env(safe-area-inset-bottom,0px))}

/* One-screen hero composition: fixed controls, flexible illustrated stage. */
#s6-v2 .hero-page{display:grid;--hero-room:max(0px,calc(100dvh - 185cqw - env(safe-area-inset-top,0px)));grid-template-rows:8cqw 9.2cqw minmax(0,1fr) 7cqw 10cqw calc(29cqw + var(--hero-room)*.18) calc(44cqw + var(--hero-room)*.32) 13.5cqw;gap:1.5cqw;overflow:hidden;padding:max(12px,env(safe-area-inset-top,0px)) 2cqw max(0px,env(safe-area-inset-bottom,0px));background-image:linear-gradient(transparent,#fce7ce 24cqw),var(--scene);background-size:100% 100%,100% auto}
#s6-v2 .hero-page>.wallet{min-height:0;margin:0 1cqw;align-self:center}
#s6-v2 .hero-page .hero-tabs button{height:9.2cqw;font-size:3.2cqw}
#s6-v2 .hero-page .hero-stage{height:auto;min-height:0;max-height:none;margin:0 -2cqw;container-type:size;background-size:cover;background-position:center bottom;overflow:hidden}
#s6-v2 .hero-stage h1{position:absolute;top:0;left:0;width:100%;font-size:4.6cqw;line-height:1.2}
#s6-v2 .hero-stage .stars{position:absolute;left:25%;top:7cqw;height:7cqw;margin:0;justify-content:flex-start;gap:1cqw}
#s6-v2 .hero-stage .star-row{font-size:min(5cqw,7cqh);line-height:1}
#s6-v2 .hero-stage .star-button{width:6cqw;height:6cqw;margin-left:1cqw;padding:.4cqw}
#s6-v2 .hero-stage .roles{position:absolute;left:25%;top:15cqw;height:5cqw;justify-content:flex-start;font-size:3.1cqw;gap:.8cqw}
#s6-v2 .hero-stage .hero-role-icon{width:4cqw;height:4cqw}
#s6-v2 .hero-stage .hero-role-icon .ico{width:2.8cqw;height:2.8cqw}
#s6-v2 .hero-stage .hero-figure{width:48%;height:65%;bottom:11cqw;left:50%;object-fit:contain}
#s6-v2 .hero-stage .equipment-left,#s6-v2 .hero-stage .equipment-right{top:24%;bottom:3cqw;width:18%;padding:0;display:grid;grid-template-rows:repeat(3,minmax(0,1fr));gap:1cqh}
#s6-v2 .hero-stage .equipment-left{left:3%}#s6-v2 .hero-stage .equipment-right{right:3%}
#s6-v2 .hero-stage .equipment-slot{height:100%;gap:.3cqw;justify-content:center;align-items:center}
#s6-v2 .hero-stage .equipment-slot .gear-tile{width:min(16cqw,18cqh);height:min(16cqw,18cqh)}
#s6-v2 .hero-stage .equipment-slot small{height:3cqw;line-height:3cqw;font-size:2.8cqw}
#s6-v2 .hero-stage .gear-level{font-size:2.8cqw}
#s6-v2 .hero-stage .formation-link{height:5.2cqw;min-height:0;width:16%;font-size:2.5cqw;bottom:3cqw;padding:0 .5cqw}
#s6-v2 .hero-stage .formation-link .ico{width:3cqw;height:3cqw}
#s6-v2 .hero-page>.experience{padding:0 2cqw;min-height:0}
#s6-v2 .hero-page .experience-reset{width:4.4cqw;height:4.4cqw;min-height:0}
#s6-v2 .hero-page>.page-actions{padding:0 5cqw;margin:0;align-items:center}
#s6-v2 .hero-page>.page-actions button{height:7cqw;min-height:0;font-size:3.6cqw;width:44%}
#s6-v2 .hero-page>.cream-card{padding:2cqw;border-radius:3cqw;min-height:0}
#s6-v2 .hero-page .card-title{font-size:3.8cqw!important;line-height:1.1;margin:0 0 1.4cqw!important}
#s6-v2 .hero-page .hero-skills{gap:.6cqw;grid-template-columns:repeat(4,1fr) 1px 1fr}
#s6-v2 .hero-page .hero-skills button{gap:.5cqw}
#s6-v2 .hero-page .hero-skills .kind{font-size:2.4cqw;line-height:1.1;padding:.2cqw 1.4cqw}
#s6-v2 .hero-page .hero-skills img,#s6-v2 .hero-page .locked-skill-icon{width:11.5cqw;height:11.5cqw}
#s6-v2 .hero-page .hero-skills b,#s6-v2 .hero-page .hero-skills small{font-size:2.9cqw;line-height:1.15}
#s6-v2 .hero-page .tree-button img{width:12cqw!important;height:12cqw!important;margin-top:0}
#s6-v2 .hero-page .hero-attribute-grid{gap:.5cqw 2cqw}
#s6-v2 .hero-page .attributes .stat-row{font-size:3cqw;min-height:4.35cqw;height:4.35cqw;padding:.2cqw 1.4cqw;line-height:1.1}
#s6-v2 .hero-page .attributes .ico{width:3cqw;height:3cqw}
#s6-v2 .hero-page>.v2-nav{position:static;margin:0;padding:.5cqw 0;min-height:0;height:13.5cqw}
#s6-v2 .hero-page>.v2-nav button{min-height:0;padding:0 .5cqw;font-size:3.2cqw}
#s6-v2 .hero-page>.v2-nav img{width:7cqw;height:7cqw}
/* One continuous illustration behind resources, tabs, hero and equipment. */
#s6-v2 .hero-page{position:relative;background:#fce7ce!important}
#s6-v2 .hero-page::before{content:'';position:absolute;inset:0 0 auto;height:calc(100% - 111.5cqw - var(--hero-room)*.5 - env(safe-area-inset-bottom,0px));background-image:var(--scene);background-size:cover;background-position:center bottom;pointer-events:none}
#s6-v2 .hero-page>*{z-index:1}
#s6-v2 .hero-page .hero-stage{background-image:none!important}
#s6-v2 .hero-page>.skills-card,#s6-v2 .hero-page>.attributes{display:flex;flex-direction:column;padding:2.5cqw}
#s6-v2 .hero-page .hero-skills{flex:1;align-items:center}
#s6-v2 .hero-page .hero-attribute-grid{flex:1;grid-template-rows:repeat(7,minmax(0,1fr));gap:1cqw 2cqw}
#s6-v2 .hero-page .hero-attribute-grid>div{min-height:0}
#s6-v2 .hero-page .attributes .stat-row{height:100%;min-height:0;font-size:3.1cqw}
#s6-v2 .hero-page>.experience{align-items:center}
#s6-v2 .hero-page>.page-actions{align-items:flex-start}
#s6-v2 .hero-page>.page-actions button{height:8cqw}
@media(max-height:700px){
 #s6-v2 .hero-page .hero-attribute-grid{gap:.5cqw 2cqw}
 #s6-v2 .hero-stage .hero-figure{height:48%;bottom:7cqw}
}


`;
