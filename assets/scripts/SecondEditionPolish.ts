/** Reference pass at 941×1672. Values use the game frame, never the browser width.
 * Keep this final layer grouped by component so the reference geometry has one owner.
 */
export const SECOND_EDITION_POLISH = `
/* Shared spacing, warm paper and typography. */
#s6-v2{font-variant-numeric:tabular-nums}
#s6-v2 .page,#s6-v2 .secondary{background-color:#ffecd7}
#s6-v2 .bag-page,#s6-v2 .dungeon-page{--catalog-top:max(12px,env(safe-area-inset-top,0px));--catalog-scenery:27cqw;gap:1.5cqw;background-image:linear-gradient(transparent 0 calc(var(--catalog-top) + var(--catalog-scenery)),#ffecd7 calc(var(--catalog-top) + var(--catalog-scenery))),var(--scene)}
#s6-v2 .bag-page>.wallet,#s6-v2 .dungeon-page>.wallet{height:calc(var(--catalog-scenery) + 1cqw);align-items:flex-start}
#s6-v2 .bag-page>.main-tabs,#s6-v2 .dungeon-page>.main-tabs{height:9cqw;margin:0}
#s6-v2 .page>.v2-nav button,#s6-v2 .battle-hud>.v2-nav button{border-radius:4.4cqw;font-size:4.1cqw}
#s6-v2 .page>.v2-nav img,#s6-v2 .battle-hud>.v2-nav img{width:9.4cqw;height:9.4cqw}
#s6-v2 .gear-tile,#s6-v2 .reward{border-radius:1.9cqw;box-shadow:0 .25cqw .4cqw #643b1918}
#s6-v2 .gear-tile:not(.empty),#s6-v2 .reward{background:linear-gradient(135deg,#ffffff60,transparent 42%),var(--quality)}
#s6-v2 .gear-level{right:4%;bottom:2%;line-height:1.15}
#s6-v2 .reward>b{bottom:3%;line-height:1.15}
/* One semantic resource image everywhere: wallet, costs, rewards and previews. */
#s6-v2 .resource-art{width:4cqw;height:4cqw;display:inline-block;vertical-align:middle;flex:none;object-fit:contain}
#s6-v2 .resource-stamina{filter:hue-rotate(40deg) saturate(1.35)}
#s6-v2 .wallet .resource-art{width:6cqw;height:6cqw}
#s6-v2 .reward>.resource-art{width:90%;height:90%}
#s6-v2 .dungeon-card footer .resource-art{width:3.5cqw;height:3.5cqw}
#s6-v2 .feature-row .resource-art{width:4cqw;height:4cqw}
#s6-v2 .feature-rewards .reward>.resource-art{width:90%;height:90%}
#s6-v2 .dialog-actions small .resource-art{width:3.2cqw;height:3.2cqw}
#s6-v2 .formation-glyph{width:3.6cqw;height:3.6cqw;display:block;flex:none;color:#79502c}
#s6-v2 .lineup-button .formation-glyph{width:4.2cqw;height:4.2cqw}
#s6-v2 .menu,#s6-v2 .recruit-page .menu,#s6-v2 .battle-hud>.menu{width:6.8cqw;height:6.8cqw;min-height:0;border-radius:2.2cqw;padding:0;display:flex;align-items:center;justify-content:center}
#s6-v2 .menu-glyph{width:3.8cqw;height:3.8cqw;stroke:#704124;stroke-width:2.6;stroke-linecap:round;fill:none}
#s6-v2 .ticket-art{display:inline-block;position:relative;vertical-align:middle;width:5.5cqw;height:4.8cqw}
#s6-v2 .ticket-art>img{display:block;width:100%;height:100%;object-fit:contain}
#s6-v2 .ticket-lettering{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
#s6-v2 .ticket-lettering text{fill:#fff9e8;stroke:#77399b;stroke-width:3;paint-order:stroke fill;font:900 23px Arial,sans-serif;text-anchor:middle}
#s6-v2 .ticket-resource .ticket-art{width:7cqw;height:6cqw}

/* Adventure information follows its content; tall phones do not stretch the gap. */
#s6-v2 .battle-hud{padding-bottom:0}
#s6-v2 .battle-hud>.v2-nav{height:calc(17.5cqw + env(safe-area-inset-bottom,0px));padding-bottom:max(1.5cqw,env(safe-area-inset-bottom,0px));flex:none}
#s6-v2 .battle-hud .stage-heading{margin:0;height:20cqw}
#s6-v2 .battle-hud .stage-heading h1{font-size:6.5cqw;text-shadow:none}
#s6-v2 .battle-hud .stage-heading h1>span{paint-order:stroke fill;-webkit-text-stroke:.6cqw #fff9e9;filter:drop-shadow(0 .25cqw 0 #b58c59)}
#s6-v2 .battle-hud .stage-heading>b,#s6-v2 .battle-hud .stage-heading small{-webkit-text-stroke:.3cqw #fff9e9;paint-order:stroke fill}
#s6-v2 .checkpoint{position:relative;width:45cqw;height:3.2cqw;border:0;margin:.8cqw 0 .6cqw;padding-right:5cqw;flex:none;isolation:isolate}
#s6-v2 .checkpoint:before,#s6-v2 .checkpoint:after{content:'';position:absolute;left:0;right:4cqw;top:50%;height:.9cqw;transform:translateY(-50%);border:.25cqw solid #fff6dc;border-radius:1cqw;background:#cba474;z-index:-1}
#s6-v2 .checkpoint:after{right:auto;width:calc(41cqw * var(--progress,0));background:#6ac91f}
#s6-v2 .checkpoint i{width:2.7cqw;height:2.7cqw;margin:0;border:.3cqw solid #fff8dc;background:#cba474;box-shadow:0 0 0 .15cqw #ac8050;flex:none}
#s6-v2 .checkpoint i.passed{background:#6ac91f}
#s6-v2 .checkpoint-flag{position:absolute;right:-.3cqw;top:-.7cqw;width:4.2cqw;height:4.2cqw;fill:#c69a6a;stroke:#fff7dd;stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}
#s6-v2 .turn-order>b,#s6-v2 .turn-arrow{color:#63391e;-webkit-text-stroke:.4cqw #fff7df;paint-order:stroke fill;filter:drop-shadow(0 .15cqw .1cqw #6f4c35)}
#s6-v2 .battle-tools button{height:8.8cqw;gap:.25cqw}
#s6-v2 .battle-tools .tool-glyph{display:block;width:4.5cqw;height:4.5cqw;color:#79502c;fill:currentColor;flex:none}
#s6-v2 .battle-tools small{font-size:2cqw;line-height:1.1;font-weight:800}
#s6-v2 .turn-portrait{overflow:hidden;border-radius:50%}
#s6-v2 .turn-portrait .face{width:100%;height:100%;object-fit:cover;transform:scale(1.65);transform-origin:center 12%}
#s6-v2 .battle-hud .skill-bar{height:auto;min-height:0;padding:2.5cqw 1.8cqw 1.8cqw;gap:1.5cqw}
#s6-v2 .party-card{justify-content:flex-start;padding-right:1.3cqw;gap:2cqw;min-height:0}
#s6-v2 .party-card>header{height:auto;flex:none;gap:.8cqw}
#s6-v2 .party-card b{font-size:3.2cqw}
#s6-v2 .party-card>header>div{gap:.8cqw}
#s6-v2 .party-card>header>div>b{font-size:3.5cqw;line-height:1.3}
#s6-v2 .party-card .party-portrait{width:11.5cqw;height:12cqw;border:.4cqw solid #ffe1a6}
#s6-v2 .party-card .party-tags{font-size:2.9cqw;gap:.35cqw}
#s6-v2 .party-card .party-tags i{font-size:2.9cqw;line-height:1.25;padding:0 .2cqw;gap:.2cqw}
#s6-v2 .party-card .role-pill .role-glyph{width:2.9cqw;height:2.9cqw}
#s6-v2 .party-card small[data-hp-label],#s6-v2 .party-card small[data-shield]{display:flex;align-items:center;gap:.3cqw;font-size:2.7cqw;line-height:1.15;min-height:3.4cqw}
#s6-v2 .party-card .resource-art{width:3cqw;height:3cqw}
#s6-v2 .party-card .health-track{height:2cqw;margin-top:1cqw}
#s6-v2 .skill-button>img,#s6-v2 .skill-button>.locked-skill-icon{width:13.3cqw;height:13.3cqw}
#s6-v2 .skill-button small{font-size:3cqw;line-height:1.3}
#s6-v2 .active-skills{gap:1.2cqw}
#s6-v2 .skill-button>span[data-cooldown]{left:50%;top:0;transform:translateX(-50%);width:13.3cqw;height:13.3cqw;display:grid;place-items:center;line-height:1;font-size:4.2cqw;font-weight:800;text-shadow:0 .2cqw .4cqw #34210a;-webkit-text-stroke:.08cqw #704124;paint-order:stroke fill;pointer-events:none}
#s6-v2 .skill-button>.locked-skill-icon{display:grid;place-items:center;padding:0}
#s6-v2 .skill-button>.locked-skill-icon .ico{width:6cqw;height:6cqw;display:block;margin:0}

/* Hero: reserve identity and action rails, give the sprite all space between them. */
#s6-v2 .hero-page{grid-template-rows:7cqw 10cqw minmax(0,1fr) calc(6cqw + var(--hero-room)*.06) 8.5cqw calc(27cqw + var(--hero-room)*.16) calc(35cqw + var(--hero-room)*.2) 15.5cqw;gap:1.5cqw}
#s6-v2 .hero-page::before{height:calc(100% - 91.5cqw - var(--hero-room)*.36 - env(safe-area-inset-bottom,0px));background-size:100% 100%}
#s6-v2 .hero-stage{--fig-bottom:9.3cqw}
#s6-v2 .hero-stage h1{font-size:5.2cqw}
#s6-v2 .hero-stage .hero-identity{top:6.8cqw}
#s6-v2 .hero-stage .hero-figure{width:51cqw;height:calc(100% - 27cqw);max-height:58cqw;bottom:var(--fig-bottom);object-position:center bottom}
#s6-v2 .hero-shadow{width:34cqw;height:5cqw;bottom:calc(var(--fig-bottom) - .3cqw);background:#7b4b3040}
#s6-v2 .hero-stage .equipment-left,#s6-v2 .hero-stage .equipment-right{top:7cqw;bottom:1.3cqw}
#s6-v2 .hero-stage .equipment-slot .gear-tile{width:min(17cqw,calc((100cqh - 21cqw)/3));height:min(17cqw,calc((100cqh - 21cqw)/3))}
#s6-v2 .hero-page .attributes .stat-row{font-size:2.9cqw}
#s6-v2 .hero-page .hero-skill-art,#s6-v2 .hero-page .locked-skill-icon{width:11.5cqw!important;height:11.5cqw!important}
#s6-v2 .hero-page>.skills-card{padding:1.2cqw 2.5cqw}
#s6-v2 .hero-page .card-title{font-size:4.1cqw!important;margin-bottom:.8cqw!important}
#s6-v2 .hero-page>.wallet .resource{height:6.5cqw;font-size:3.8cqw}
#s6-v2 .hero-page .hero-skills{min-height:0}
#s6-v2 .hero-page .hero-tabs .tab-portrait{width:8.8cqw;height:9.8cqw;margin-top:-1cqw;margin-left:.5cqw}
#s6-v2 .hero-page .tree-button{padding:0;gap:.5cqw;align-self:center}
#s6-v2 .hero-page .hero-skills .tree-button img{width:14.2cqw!important;height:14.2cqw!important;flex:none;margin:0}
#s6-v2 .hero-page .hero-skills .tree-button>b{font-size:2.9cqw;line-height:1.15;font-weight:800;color:#643b20}
#s6-v2 .hero-page .hero-skills .tree-button>small{font-size:2.5cqw;line-height:1.15;font-weight:600;color:#8b6c51}

/* Main pages: artwork composition and bottom controls stay on distinct rails. */
#s6-v2 .bag-page>.part-tabs,#s6-v2 .bag-page .part-tabs button{height:10cqw}
#s6-v2 .bag-page>.bag-scroll{padding:2cqw;border:0;background:#fff4e2b8;scrollbar-gutter:auto}
#s6-v2 .bag-page .five-grid{gap:1.6cqw}
#s6-v2 .bag-page>.bag-footer{height:12cqw}
#s6-v2 .recruit-page{background-size:100% 100%}
#s6-v2 .recruit-banner{position:relative;width:51cqw;height:23cqw;margin:1cqw 0 0;display:block;background:var(--recruit-title) center/100% 100% no-repeat}
#s6-v2 .recruit-banner h1{position:absolute;left:9%;top:5%;width:82%;height:61%;justify-content:center;font-size:8.6cqw;font-style:italic;color:#54270d;-webkit-text-stroke:0;text-shadow:none}
#s6-v2 .recruit-banner h1>span{paint-order:stroke fill;-webkit-text-stroke:.85cqw #fff9e9;filter:drop-shadow(0 .25cqw 0 #9c642e)}
#s6-v2 .recruit-banner .laurel{display:none}
#s6-v2 .recruit-banner .ribbon{position:absolute;left:11%;right:11%;bottom:6%;height:25%;display:flex;align-items:center;justify-content:center;font-size:3.3cqw;padding:0;background:none;clip-path:none;margin:0;color:#fff9e6;text-shadow:0 .15cqw #a16b24}
#s6-v2 .recruit-banner .ribbon:before,#s6-v2 .recruit-banner .ribbon:after{display:none}
#s6-v2 .up-badge{width:23cqw;height:auto;aspect-ratio:503/283;right:5%;bottom:10%;background:var(--up-badge) center/contain no-repeat;border:0;border-radius:0;box-shadow:none;padding:0;transform:none;display:block}
#s6-v2 .up-badge strong{position:absolute;left:9%;top:31%;width:52%;height:31%;display:flex;align-items:center;justify-content:center;font-size:3.7cqw;line-height:1;transform:rotate(-5deg);text-shadow:.15cqw .15cqw #50256e;white-space:nowrap}
#s6-v2 .up-badge b{position:absolute;left:28%;top:71%;width:38%;height:21%;display:flex;align-items:center;justify-content:center;padding:0;background:none;font:900 3.1cqw/1 Arial,sans-serif;transform:rotate(-5deg)}
#s6-v2 .pity-panel .crown{width:10cqw;height:10cqw;background:none;border:0}
#s6-v2 .pity-panel .crown img{width:100%;height:100%}
#s6-v2 .pity-panel .exp-track{background:#c6a17f;border:1px solid #785232}
#s6-v2 .pity-panel .exp-track i{background:linear-gradient(#adff52,#64e71a 60%,#3ab815)}
#s6-v2 .pity-panel{height:auto;min-height:0;padding:.9cqw 2cqw;align-items:center}
#s6-v2 .pity-panel>div{gap:.9cqw}
#s6-v2 .pity-panel p,#s6-v2 .pity-panel small{display:block;margin:0;line-height:1.15}
#s6-v2 .pity-panel p{font-size:3.2cqw}
#s6-v2 .pity-panel small{font-size:2.6cqw}
#s6-v2 .pool-links button>img{width:4.5cqw;height:4.5cqw}
#s6-v2 .recruit-cast .cast{filter:drop-shadow(0 .8cqw .5cqw #321d3455)}
#s6-v2 .recruit-cast .c-front{width:63%;height:73%;left:18.5%;bottom:0}
#s6-v2 .recruit-cast .c-left{width:44%;height:54%;left:0;top:31%}
#s6-v2 .recruit-cast .c-right{width:44%;height:54%;right:0;top:21%}
#s6-v2 .recruit-cast .c-back{width:46%;height:54%;left:20%;top:2%}
#s6-v2 .recruit-bottom .pity-panel{width:65cqw}
#s6-v2 .recruit-bottom .page-actions button{font-size:4.6cqw}
#s6-v2 .dungeon-card{border-radius:2.7cqw;background:#fff2df}
#s6-v2 .dungeon-card>img{border-radius:2.1cqw}
#s6-v2 .feature-title h2{font-size:7.3cqw;letter-spacing:.2cqw}
#s6-v2 .feature-title .laurel{width:5cqw;height:8cqw}
#s6-v2 .feature-title .ribbon{font-size:3cqw}
#s6-v2 .feature-title{width:59cqw;height:22cqw;left:50%;right:auto;transform:translateX(-50%);background:var(--recruit-title) center/100% 100% no-repeat}
#s6-v2 .feature-title .title-row{position:absolute;inset:7% 9% 30%;justify-content:center}
#s6-v2 .feature-title .laurel{display:none}
#s6-v2 .feature-title h2{font-size:7.3cqw;text-shadow:0 .25cqw #6b3510}
#s6-v2 .feature-title .ribbon{position:absolute;left:8%;right:8%;bottom:6%;height:25%;padding:0;margin:0;display:flex;align-items:center;justify-content:center;background:none;clip-path:none;font-size:2.6cqw;color:#fff9e6;text-shadow:0 .15cqw #92601f}
#s6-v2 .feature-row{border-bottom-color:#ecd5b440}
#s6-v2 .daily-card .feature-art{background-size:cover;background-position:center 46%}

/* Dialog geometry. The frame is nine-sliced; its content never stretches with it. */
#s6-v2 .v2-scrim{gap:3cqw;background:#201d16b3;backdrop-filter:none}
#s6-v2 .v2-scrim:not(.dark){padding-top:19cqw;padding-bottom:5cqw}
#s6-v2 .v2-scrim:has(.pool-dialog){padding-top:12cqw}
#s6-v2 .v2-scrim:has(.formation-types),#s6-v2 .v2-scrim:has(.challenge-dialog){padding-top:27cqw}
#s6-v2.has-frame .v2-dialog:not(.fullscreen){padding:0 2.5cqw 2.6cqw;border-width:1.8cqw!important;border-image-width:6cqw!important;gap:1.2cqw;max-height:86%}
#s6-v2 .v2-dialog.medium{width:70cqw}
#s6-v2 .v2-dialog.small{width:70cqw}
#s6-v2 .v2-dialog.large{width:88cqw}
#s6-v2 .dialog-head:not(.celebrate){min-height:6.5cqw;margin:-4.4cqw 0 0;flex-shrink:0}
#s6-v2 .dialog-head .plate{font-size:4.2cqw}
#s6-v2.has-decoration .plate{background:var(--title-plaque) center/contain no-repeat!important;border:0!important;border-radius:0;box-shadow:none!important;clip-path:none;width:46cqw;min-width:0;height:auto;aspect-ratio:var(--title-aspect);padding:0;justify-content:center;gap:0}
#s6-v2.has-decoration .plate>span{position:absolute;left:15%;right:15%;top:57%;transform:translateY(-50%);text-align:center;line-height:1}
#s6-v2.has-decoration .plate>i{display:none}
#s6-v2.has-decoration .plate:before,#s6-v2.has-decoration .plate:after{display:none}
#s6-v2.has-decoration .plaque:before,#s6-v2.has-decoration .plaque:after{display:none}
#s6-v2.has-decoration .dialog-head:not(.celebrate){position:static;height:2.5cqw;min-height:2.5cqw;margin:0}
#s6-v2.has-decoration .dialog-head .plaque{position:absolute;left:50%;top:-.9cqw;transform:translate(-50%,-60%);filter:none}
#s6-v2 .dialog-head .plate>i{font-size:2.2cqw}
#s6-v2 .dialog-head .plate>i:first-child:before,#s6-v2 .dialog-head .plate>i:last-child:before{width:5.8cqw;height:4cqw;top:.2cqw}
#s6-v2 .dialog-head .plate>i:first-child:before{left:-4.5cqw}
#s6-v2 .dialog-head .plate>i:last-child:before{right:-4.5cqw}
#s6-v2.has-decoration .dialog-head .v2-button.close{width:8.2cqw;height:8.2cqw;right:.4cqw;top:-3.4cqw;border:0!important;background:var(--close-art) center/contain no-repeat!important;box-shadow:none!important;color:transparent!important;font-size:0;overflow:visible}
#s6-v2 .dialog-body{gap:.4cqw;padding:.4cqw .5cqw;flex-shrink:1;overflow-x:hidden}
#s6-v2 .outside-hint{font-size:3cqw;gap:1.7cqw;flex-shrink:0;font-weight:600}
#s6-v2 .outside-hint .ico{width:2.8cqw;height:2.8cqw}
#s6-v2 .v2-dialog .item-heading{gap:2.4cqw;padding:.5cqw 0}
#s6-v2 .v2-dialog .item-heading>.gear-tile{width:17cqw;border:0}
#s6-v2 .v2-dialog .item-heading h3{font-size:4.3cqw}
#s6-v2 .v2-dialog .item-heading>div:not(.gear-tile):not(.skill-preview){gap:.8cqw;padding-top:.4cqw}
#s6-v2 .v2-dialog .item-heading .pill,#s6-v2 .v2-dialog .item-heading .quality-pill{font-size:2.8cqw;padding:.35cqw 1.6cqw;border-radius:1.1cqw}
#s6-v2 .v2-dialog .lock-button{width:6cqw;height:6cqw;right:0;top:.5cqw}
#s6-v2 .v2-dialog .section-title{margin:.6cqw 0 .2cqw!important}
#s6-v2 .v2-dialog .section-title>span{font-size:3.2cqw;padding:.35cqw 2cqw .35cqw 1.3cqw;gap:1cqw}
#s6-v2 .section-mark{width:3.3cqw;height:3.3cqw}
#s6-v2 .v2-dialog .stat-row{font-size:3.2cqw;min-height:4.7cqw;padding:.4cqw 2.5cqw;margin:.2cqw 0;gap:.6cqw;flex-shrink:0}
#s6-v2 .v2-dialog .stat-row>span{gap:1.6cqw;min-width:0}
#s6-v2 .v2-dialog .stat-row .stat-glyph,#s6-v2 .v2-dialog .stat-row>span>.ico{width:3.4cqw;height:3.4cqw}
#s6-v2 .v2-dialog .stat-row>b{flex-shrink:0}
#s6-v2 .v2-dialog .change{grid-template-columns:9cqw 5cqw 9cqw;font-size:3.1cqw}
#s6-v2 .v2-dialog .change-arrow{width:3.4cqw;height:3.4cqw}
#s6-v2 .v2-dialog .ornament-line{margin:.35cqw 0;height:2.2cqw;flex-shrink:0}
#s6-v2 .ornament-mark{width:2.2cqw;height:2.2cqw}
#s6-v2 .v2-dialog .effect-line{font-size:2.7cqw;padding:.4cqw 1cqw;gap:1.3cqw}
#s6-v2 .v2-dialog .effect-line.empty{font-size:2.7cqw}
#s6-v2 .effect-mark{width:4.7cqw;height:4.7cqw}
#s6-v2 .v2-dialog .equip-owner{font-size:2.2cqw;margin:0}
#s6-v2 .v2-dialog .skill-preview img{width:17cqw;height:17cqw}
#s6-v2 .v2-dialog .skill-description{padding:1.8cqw 2cqw;font-size:2.7cqw;line-height:1.6;text-align:left}
#s6-v2 .v2-dialog .dialog-actions{gap:3cqw;padding-top:1cqw;flex-shrink:0}
/* Each source button is 288×112: retain an 8px centre strip for tall buttons. */
#s6-v2.has-frame .v2-dialog .dialog-actions button:not(.flat){border-image-slice:52 60 fill!important}
#s6-v2.has-frame .v2-dialog:not(.fullscreen) .dialog-actions button:not(.flat){height:9cqw;min-height:9cqw;font-size:3.8cqw;line-height:1.1;padding:0 3cqw;min-width:36%;border-image-width:4.4cqw 4.6cqw!important}
#s6-v2 .v2-dialog .dialog-actions button small{font-size:2.5cqw;line-height:1.15}
#s6-v2 .small .info-pad{font-size:3.2cqw;padding:3cqw 2cqw;line-height:1.7;background:#f5e7d5}
#s6-v2 .small .info-pad b{font-size:3.4cqw}
#s6-v2 .small .info-pad small{font-size:2.7cqw}
#s6-v2 .small .inline-icon{width:4cqw;height:4cqw}
#s6-v2 .star-heading>.portrait-tile.small{width:16cqw}
#s6-v2 .star-mark{width:4.5cqw;height:4.5cqw}
#s6-v2 .star-change{gap:1.7cqw}
#s6-v2 .v2-dialog .cost-card{padding:1.7cqw 2cqw;gap:2.4cqw}
#s6-v2 .v2-dialog .cost-card>.portrait-tile.small{width:12cqw}
#s6-v2 .v2-dialog .cost-card>div:last-child{padding-left:2cqw;gap:.7cqw}
#s6-v2 .v2-dialog .cost-card h3{font-size:2.9cqw}
#s6-v2 .v2-dialog .cost-card p{font-size:2.6cqw}

/* Five-column scrollers expose the promised half row at every width. */
#s6-v2 .reward-scroll{--tile:calc((100cqw - 25.6cqw)/5);height:calc(var(--tile)*2.5 + 6.2cqw);min-height:0;max-height:none;flex-shrink:0;padding:1.6cqw;background:#f7e7d0;border:1px solid #ecd4b3;scrollbar-color:#f4b832 #f5d8b1}
#s6-v2 .reward-scroll .five-grid,#s6-v2 .equipment-scroll .five-grid{gap:1.6cqw}
#s6-v2 .reward-scroll .five-grid>*{aspect-ratio:1;min-width:0}
#s6-v2 .equipment-scroll{height:66cqw;flex-shrink:0;padding:1.4cqw;background:#f8ead7;border:1px solid #ecd4b3;border-radius:2.5cqw;scrollbar-color:#f4b832 #f5d8b1}
#s6-v2 .salvage-scroll{--tile:calc((100cqw - 25.2cqw)/5);height:calc(var(--tile)*3.5 + 7.6cqw)}
#s6-v2 .v2-dialog .filter-row{padding:.4cqw 0 1cqw}
#s6-v2 .v2-dialog .filter-row button{min-height:6.5cqw;height:6.5cqw;padding:0 2.4cqw;font-size:3.2cqw}
#s6-v2 .part-tabs.labeled{border:0;padding-top:1cqw}
#s6-v2 .part-tabs.labeled button{min-height:12cqw}
#s6-v2 .part-tabs.labeled img{width:7cqw;height:7cqw}
#s6-v2 .part-tabs.labeled small{font-size:2.5cqw}
#s6-v2 .label-line{font-size:3cqw;text-align:left}
#s6-v2 .quality-checks{padding:1cqw .5cqw;background:none;gap:.8cqw}
#s6-v2 .quality-checks .check-option{font-size:2.9cqw;padding:.4cqw 0;gap:.7cqw;min-height:4cqw}
#s6-v2 .quality-checks .box{width:3.5cqw;height:3.5cqw;border-width:1px;border-radius:.7cqw}
#s6-v2 .quality-checks .box .ico{width:3cqw;height:3cqw}
#s6-v2 .lock-note{font-size:2.5cqw;padding:.7cqw;background:#f9e7ce}
#s6-v2 .lock-note .ico{width:3cqw;height:3cqw}
#s6-v2 .list-heading{font-size:2.9cqw;padding:.4cqw .5cqw}
#s6-v2 .material-line{font-size:3cqw;padding:.6cqw 1cqw}
#s6-v2 .material-line span{font-size:3cqw}
#s6-v2 .material-line img{width:6cqw;height:6cqw}
#s6-v2 .warn{font-size:2.5cqw}
#s6-v2 .offline-dialog .pool-name{font-size:3.2cqw;padding:.4cqw 0}
#s6-v2 .offline-rates{gap:2cqw}
#s6-v2 .offline-rates .resource{font-size:3.1cqw;height:6.5cqw;background:none;padding:0!important}
#s6-v2 .offline-rates .resource img{width:5.6cqw;height:5.6cqw}
#s6-v2 .idle-time{font-size:2.8cqw;gap:1.4cqw;margin-top:.6cqw}
#s6-v2 .idle-time span{gap:.8cqw;padding:.5cqw 1.7cqw}
#s6-v2 .idle-time .ico{width:3.3cqw;height:3.3cqw}
#s6-v2 .idle-time small{font-size:2.5cqw;padding-left:1.4cqw}
#s6-v2 .challenge-dialog{width:74cqw!important}
#s6-v2 .challenge-heading>img{width:31%;border:0}
#s6-v2 .challenge-heading h3{font-size:3.9cqw}
#s6-v2 .challenge-heading small{font-size:2.7cqw}
#s6-v2 .challenge-dialog .main-tabs button{min-height:6cqw;font-size:3.1cqw}
#s6-v2 .challenge-dialog .reward-scroll{--tile:calc((100cqw - 39.6cqw)/5)}
#s6-v2 .challenge-cost{font-size:2.7cqw}
#s6-v2 .pool-dialog{width:78cqw!important}
#s6-v2 .pool-dialog .pool-name{font-size:3.1cqw;padding:.5cqw 3cqw}
#s6-v2 .pool-heroes{gap:2.5cqw;padding:1.2cqw 1cqw}
#s6-v2 .pool-featured{display:flex;align-items:center;gap:4cqw;padding:1.2cqw 1cqw 2cqw}
#s6-v2 .pool-featured>.portrait-tile{width:19cqw;flex:none;overflow:visible}
#s6-v2 .pool-featured .portrait-crop{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
#s6-v2 .pool-featured .ticket-art{position:absolute;left:-2cqw;top:-2cqw;width:7cqw;height:6cqw}
#s6-v2 .pool-featured>div:last-child{display:flex;flex-direction:column;align-items:flex-start;gap:1.5cqw;font-size:3.7cqw}
#s6-v2 .pool-featured .pill{font-size:3.2cqw;padding:.5cqw 2cqw;color:#713b17;background:#ffe3aa}
#s6-v2 .pool-heroes.other-heroes{grid-template-columns:repeat(3,19cqw);justify-content:space-between}
#s6-v2 .pool-dialog .rules{font-size:2.9cqw;line-height:1.8;padding:1.7cqw 1.5cqw 1.7cqw 5cqw}

/* Celebrations use a clean scene, with a true two-line action area. */
#s6-v2 .v2-scrim.dark{background:linear-gradient(#0e1839b3,#0b122de8),var(--result-scene) center/100% 100% no-repeat}
#s6-v2 .v2-scrim.warm{background:radial-gradient(ellipse at 50% 40%,#2b210acc,#100c08eb 75%)}
#s6-v2 .v2-scrim:has(>.results-screen){padding:12dvh 2.8cqw 6dvh;gap:4cqw;justify-content:flex-start;background:linear-gradient(#0e1839b3,#0b122ddd),var(--result-scene) center/100% 100% no-repeat}
#s6-v2 .fullscreen.results-screen{height:auto;flex:none;min-height:0;max-height:none;gap:1cqw;justify-content:flex-start}
#s6-v2 .results-screen .dialog-head{margin:0}
#s6-v2 .results-screen .dialog-body{flex:none;overflow:visible;gap:0;padding:0;display:flex;align-items:center}
#s6-v2 .celebrate{position:relative;isolation:isolate;flex:none;width:66cqw;height:20.5cqw;align-self:center;justify-content:center;align-items:flex-end!important;padding:6cqw 5cqw 2.5cqw!important;background:var(--celebration) center/100% 100% no-repeat!important}
#s6-v2 .celebrate:before{display:none}
#s6-v2 .fullscreen .celebrate h2{font-size:8.8cqw;letter-spacing:.1cqw;color:#fff2c2;-webkit-text-stroke:.4cqw #a45814;paint-order:stroke fill;text-shadow:0 .4cqw #7a3d0d,0 0 2cqw #f9be3c;white-space:nowrap}
#s6-v2 .celebrate .laurel{display:none}
#s6-v2 .results-screen .celebrate{width:58cqw;height:22cqw;background-size:contain!important;padding:6.5cqw 8cqw 2.7cqw!important}
#s6-v2 .results-screen .celebrate h2{font-size:8.5cqw;letter-spacing:.4cqw;-webkit-text-stroke:.65cqw #a34b10;text-shadow:0 .35cqw #72340f,0 0 1cqw #ffc75b}
#s6-v2 .results-screen .celebrate:has(.result-title-art){background:none!important;padding:0!important;align-items:center!important}
#s6-v2 .results-screen .celebrate:has(.result-title-art) h2{width:100%;height:100%;padding:0!important;line-height:0;text-shadow:none;-webkit-text-stroke:0}
#s6-v2 .result-title-art{display:block;width:100%;height:100%;object-fit:contain}
#s6-v2 .result-sub{width:74cqw;max-width:100%;margin:0;padding:.7cqw 0;font-size:4cqw;line-height:1.35;background:linear-gradient(90deg,transparent,#a56a2280 24%,#a56a2280 76%,transparent);border:0;position:relative;white-space:nowrap;text-shadow:0 .2cqw .3cqw #321b0e}
#s6-v2 .result-sub:before,#s6-v2 .result-sub:after{content:'';position:absolute;left:0;right:0;height:.2cqw;background:linear-gradient(90deg,transparent,#f2c765,transparent)}
#s6-v2 .result-sub:before{top:0}#s6-v2 .result-sub:after{bottom:0}
#s6-v2 .result-sub em{font-size:4.8cqw}
#s6-v2 .result-cards.five-grid{padding:2cqw 0;gap:3cqw 1.4cqw;align-self:start;margin-top:clamp(7cqw,6dvh,14cqw)}
#s6-v2 .result-cards.single{width:29cqw;margin:12cqw auto 0;position:relative;isolation:isolate}
#s6-v2 .result-cards.single:before{content:'';position:absolute;inset:-10cqw -14cqw;z-index:-1;pointer-events:none;background:radial-gradient(ellipse,#ffc84e66,transparent 65%),repeating-conic-gradient(from 12deg,#ffdd7c00 0deg 22deg,#ffdd7c50 23deg 31deg,#ffdd7c00 32deg 45deg);mask-image:radial-gradient(ellipse,#000 15%,transparent 69%)}
#s6-v2 .result-cards.single:after{content:'✦';position:absolute;left:-8cqw;top:24%;font-size:5cqw;color:#fff5cd;text-shadow:0 0 1cqw #ffd06b,38cqw 14cqw 0 #fff5cd,38cqw 14cqw 1cqw #ffc54d;pointer-events:none}
#s6-v2 .hero-card{padding:.65cqw .65cqw 1.05cqw;border:.3cqw solid #fff8e8;border-radius:2.8cqw;gap:.45cqw;background:linear-gradient(135deg,#fff4e2,#ffdfbd);box-shadow:0 .25cqw .1cqw #d89560,0 0 .5cqw #fff0c4,0 .5cqw 1cqw #1a142b55;overflow:visible}
#s6-v2 .hero-card .portrait{aspect-ratio:.92;border-radius:1.8cqw;background:linear-gradient(130deg,#ffffff40,transparent 55%),var(--quality)}
#s6-v2 .hero-card>b{font-size:3.2cqw}
#s6-v2 .hero-card .star-row{font-size:2.7cqw}
#s6-v2 .hero-card>.role-badge{width:5.4cqw;height:5.4cqw;border:.3cqw solid #fff9e7;left:-.65cqw;top:-.65cqw;box-shadow:0 .2cqw .3cqw #52311f55;background-image:linear-gradient(135deg,#ffffff66,transparent 65%)}
#s6-v2 .hero-card>.role-badge .role-glyph{width:3.7cqw;height:3.7cqw}
#s6-v2 .result-cards .card-tag{font-size:2.5cqw;padding:.35cqw .9cqw}
#s6-v2 .result-cards .card-tag.new{top:-.9cqw;right:-.4cqw;transform:rotate(-7deg);font-style:normal;border:.2cqw solid #ffbe5d;border-radius:.4cqw 1.8cqw .4cqw 1.2cqw;background:linear-gradient(#ff9250,#ff442c 65%,#e92e20);text-shadow:0 .2cqw #b62715;box-shadow:0 .25cqw .4cqw #71371a55}
#s6-v2 .result-cards .card-tag.dup{top:1cqw;right:.8cqw;border-radius:1.8cqw;background:#443d4f8c;font-size:2.1cqw}
#s6-v2 .result-cards.single .role-badge{width:8cqw;height:8cqw;left:-.7cqw;top:-.7cqw;border-width:.5cqw}
#s6-v2 .result-cards.single .role-glyph{width:5.5cqw;height:5.5cqw}
#s6-v2 .result-cards.single .card-tag.new{font-size:4cqw;padding:.4cqw 1.5cqw;border-width:.25cqw}
#s6-v2 .result-cards.single .card-tag.dup{font-size:3cqw}
#s6-v2 .result-cards.single .hero-card>b{font-size:4cqw}
#s6-v2 .result-cards.single .star-row{font-size:3.9cqw}
#s6-v2 .ticket-left{margin:3cqw 0 1cqw;font-size:3.3cqw;padding:.35cqw 1.7cqw;gap:.8cqw;border:.2cqw solid #dac29b99;background:#171419a6;line-height:1.2}
#s6-v2 .ticket-left b{font-size:4cqw}
#s6-v2 .ticket-left .ticket-art{width:5.7cqw;height:4.5cqw}
#s6-v2 .results-screen .dialog-actions{padding:0;gap:3cqw;flex:none}
#s6-v2.has-frame .results-screen .dialog-actions button:not(.flat){height:13cqw;min-height:13cqw;min-width:0;width:29.5cqw;padding:.8cqw 2cqw;gap:.6cqw;line-height:1.15;border-image-width:6cqw 5cqw!important;filter:drop-shadow(0 0 .5cqw #ffc35588)}
#s6-v2 .results-screen .dialog-actions b{font-size:4.3cqw;line-height:1.1}
#s6-v2 .results-screen .dialog-actions .ticket-chip{font-size:3.5cqw;background:#a859171f;line-height:1.15;min-width:18cqw;justify-content:center}
#s6-v2 .results-screen .ticket-chip .ticket-art{width:5.2cqw;height:4cqw}
#s6-v2 .results-screen+.outside-hint{color:#b1afbd;text-shadow:0 .2cqw #162035;font-size:3cqw;letter-spacing:.3cqw;margin:0}
#s6-v2 .results-screen+.outside-hint .ico{display:none}
/* Reveal saved recruitment results; particles never intercept controls or use game RNG. */
#s6-v2 .recruit-fx{position:absolute;inset:0;z-index:-1;pointer-events:none}
#s6-v2 .recruit-rays{position:absolute;left:50%;bottom:1cqw;width:0;height:0;animation:s6-rays-breathe 3.8s ease-in-out infinite}
#s6-v2 .recruit-rays>i{position:absolute;left:-3cqw;bottom:0;width:6cqw;height:30cqw;transform:rotate(var(--angle));transform-origin:50% 100%;clip-path:polygon(0 0,100% 0,53% 100%,47% 100%);background:linear-gradient(0deg,#ffd36570,#fbbd3645 60%,transparent);opacity:.65}
#s6-v2 .recruit-confetti{position:absolute;inset:-4cqw -12cqw 0}
#s6-v2 .recruit-confetti>i{position:absolute;left:var(--x);top:var(--y);width:1.5cqw;height:2cqw;background:var(--color);opacity:0;animation:s6-confetti-fall 1.8s cubic-bezier(.12,.55,.35,1) var(--delay) both}
#s6-v2 .recruit-confetti>i:nth-child(3n){width:1cqw;height:2.6cqw}
#s6-v2 .recruit-glint{position:absolute;width:2cqw;height:2cqw;background:#fff3b8;clip-path:polygon(50% 0,60% 40%,100% 50%,60% 60%,50% 100%,40% 60%,0 50%,40% 40%);animation:s6-glint 2.6s ease-in-out infinite}
#s6-v2 .glint-left{left:9%;top:12%}#s6-v2 .glint-right{right:8%;top:24%;animation-delay:.8s}
#s6-v2 .recruit-reveal .result-title-art{animation:s6-title-arrive .42s cubic-bezier(.2,.8,.2,1.15) both}
#s6-v2 .recruit-reveal .result-sub{animation:s6-result-arrive .3s ease-out .15s both}
#s6-v2 .recruit-reveal .hero-card{animation:s6-card-reveal .45s cubic-bezier(.2,.85,.25,1.15) calc(.24s + var(--reveal-index)*.075s) both;backface-visibility:hidden}
#s6-v2 .recruit-reveal .ticket-left,#s6-v2 .recruit-reveal .dialog-actions{animation:s6-result-arrive .3s ease-out .65s both}
#s6-v2 .recruit-reveal:has(.five-grid) .ticket-left,#s6-v2 .recruit-reveal:has(.five-grid) .dialog-actions{animation-delay:1.05s}
@keyframes s6-title-arrive{from{opacity:0;transform:translateY(-1.8cqw) scale(.88)}to{opacity:1;transform:none}}
@keyframes s6-result-arrive{from{opacity:0;transform:translateY(1.2cqw)}to{opacity:1;transform:none}}
@keyframes s6-card-reveal{from{opacity:0;transform:perspective(70cqw) translateY(3cqw) rotateY(-55deg) scale(.84)}to{opacity:1;transform:perspective(70cqw) translateY(0) rotateY(0) scale(1)}}
@keyframes s6-confetti-fall{0%{opacity:0;transform:translateY(-4cqw) rotate(0)}12%,72%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--fall)) rotate(var(--spin))}}
@keyframes s6-rays-breathe{0%,100%{opacity:.4;transform:rotate(-3deg)}50%{opacity:.8;transform:rotate(3deg)}}
@keyframes s6-glint{0%,100%{opacity:.35;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}
@media(prefers-reduced-motion:reduce){
 #s6-v2 .recruit-reveal *,#s6-v2 .recruit-reveal *:before,#s6-v2 .recruit-reveal *:after{animation:none!important}
 #s6-v2 .recruit-confetti>i{display:none}
 #s6-v2 .recruit-rays{opacity:.45}
}
#s6-v2 .rewards-fullscreen{gap:3cqw;padding:0}
#s6-v2 .rewards-fullscreen .dialog-head{padding:3cqw 0 1cqw}
#s6-v2 .rewards-fullscreen .celebrate{width:72cqw;height:24cqw;padding-bottom:3cqw!important}
#s6-v2 .rewards-fullscreen .celebrate h2{font-size:10.3cqw}
#s6-v2 .rewards-fullscreen .reward-scroll{--tile:16.2cqw;height:calc(var(--tile)*2.5 + 6.2cqw);padding:1.6cqw 2cqw;border-color:#e0b762;border-radius:0}

/* Formation: compact presets and readable, bounded miniature positions. */
#s6-v2 .formation-scene{height:66cqw;min-height:66cqw;background-size:100% 100%}
#s6-v2 .formation-scene[data-formation="1"]{height:70cqw;min-height:70cqw}
#s6-v2 .title-plaque .plate{font-size:5.3cqw;padding:0;letter-spacing:.15cqw}
#s6-v2 .standing-heroes{inset:0 3%}
#s6-v2 .standing-heroes .v2-button.standing{width:24%}
#s6-v2 .standing-heroes .v2-button.standing.front{width:30%}
#s6-v2 .formation-actor{position:relative;display:block;isolation:isolate;width:100%;height:20cqw}
#s6-v2 .standing.front .formation-actor{height:24cqw}
#s6-v2 .formation-scene[data-formation="1"] .standing.front .formation-actor{height:14.8cqw}
#s6-v2 .formation-scene[data-formation="2"] .standing .formation-actor{height:20cqw}
#s6-v2 .standing .formation-actor .face{width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:none;position:relative;z-index:1}
#s6-v2 .standing:before{display:none}
#s6-v2 .formation-actor:before{content:'';position:absolute;left:10%;right:10%;bottom:-2cqw;height:5.2cqw;border:.35cqw solid #fff7c7;border-radius:50%;background:#ffd97555;box-shadow:0 0 0 .3cqw #ffcb67,0 0 1cqw #ffdb7166;z-index:-2}
#s6-v2 .formation-actor:after{content:'';position:absolute;left:24%;right:24%;bottom:0;height:1.8cqw;border-radius:50%;background:#7b4a3347;z-index:-1}
#s6-v2 .standing .role-tag{font-size:2.6cqw;line-height:1.15;padding:.2cqw 1cqw .2cqw .3cqw;margin-bottom:.3cqw}
#s6-v2 .standing .role-tag .role-badge{width:3.2cqw;height:3.2cqw}
#s6-v2 .standing .role-tag .role-glyph{width:2.4cqw;height:2.4cqw}
#s6-v2 .standing .row-plaque{font-size:2.5cqw;line-height:1.25;border-width:1px;margin-top:.25cqw;padding:.1cqw 2.2cqw;z-index:1}
#s6-v2 .standing small{font-size:2.6cqw;line-height:1.15;margin-top:.2cqw}
#s6-v2 .role-tag{font-size:2.9cqw}
#s6-v2 .formation-sheet{background:#ffecd7;box-shadow:none;border-radius:4cqw 4cqw 0 0;margin-top:0}
#s6-v2 .formation-toolbar{padding:2cqw;gap:1.1cqw;font-size:3.3cqw;border:0}
#s6-v2 .formation-toolbar .preset-buttons{gap:1cqw}
#s6-v2 .preset-buttons .v2-button{width:6.3cqw;height:6.3cqw;font-size:3.6cqw}
#s6-v2 .formation-toolbar>button{font-size:3.3cqw;padding:.6cqw 2cqw;min-height:7cqw}
#s6-v2 .formation-layout-icon{width:4.8cqw;height:4.3cqw;flex:none;display:block}
#s6-v2 .formation-name{font-size:3cqw}
#s6-v2 .roster-grid{margin:0 1cqw;padding:3cqw 2.8cqw;gap:2.5cqw;background:#fff4e3;border:1px solid #e6c39e;border-radius:4cqw;scrollbar-width:thin;scrollbar-color:#f5b72d #f3d5b3}
#s6-v2 .roster-grid .hero-card .portrait{aspect-ratio:1.02;overflow:visible}
#s6-v2 .roster-grid .hero-card>b{font-size:3.4cqw;margin-top:.8cqw}
#s6-v2 .roster-grid .hero-card .star-row{font-size:3.1cqw}
#s6-v2 .roster-grid .hero-card.locked .portrait{background:linear-gradient(135deg,#aaa0ae,#756b7c)}
#s6-v2 .roster-grid .hero-card.locked .role-badge{filter:grayscale(.7);opacity:.7}
#s6-v2 .roster-grid .hero-card.locked .portrait .face{filter:grayscale(.55) brightness(.65)}
#s6-v2 .roster-grid .hero-card.locked>b,#s6-v2 .roster-grid .hero-card.locked>.star-row{display:none}
#s6-v2 .roster-grid .hero-card.locked .portrait{aspect-ratio:.78}
#s6-v2 .roster-grid .portrait .face{box-sizing:border-box;padding-bottom:1.2cqw}
#s6-v2 .roster-grid .deployed{left:12%;right:12%;top:auto;bottom:-.25cqw;height:3.5cqw;display:grid;place-items:center;isolation:isolate;font-size:2.7cqw;line-height:1;font-weight:800;padding:0 .6cqw;background:#dcff93;clip-path:polygon(6% 0,94% 0,100% 50%,94% 100%,6% 100%,0 50%);text-shadow:0 .15cqw #3a7b15;z-index:2}
#s6-v2 .roster-grid .deployed:before{content:'';position:absolute;inset:.22cqw;clip-path:inherit;background:linear-gradient(#9ee342,#4da41e);z-index:-1}
#s6-v2 .roster-grid .card-lock{width:5cqw;height:5.5cqw;right:.4cqw;top:.4cqw}
#s6-v2 .hero-card .portrait .face{width:100%;height:100%;object-fit:contain;object-position:center 100%;transform:scale(.98);transform-origin:center bottom}
#s6-v2 .formation-page>.secondary-close{margin:3cqw auto max(3cqw,env(safe-area-inset-bottom,0px));width:42%;height:10cqw;min-height:10cqw;font-size:5cqw}
#s6-v2.has-frame .formation-page>.secondary-close{height:11cqw;min-height:11cqw;font-size:5.8cqw;padding:0 3cqw;border:1px solid transparent!important;background:none!important;box-shadow:none!important;border-image:var(--btn-gold) 50 60 fill / 5cqw 5.4cqw stretch!important}
#s6-v2 .formation-types{gap:2cqw}
#s6-v2 .v2-button.formation-option{padding:1.2cqw;border-width:1px;overflow:hidden}
#s6-v2 .formation-option header{gap:.5cqw;flex-wrap:wrap}
#s6-v2 .formation-option header>.ico{width:4cqw;height:4cqw;padding:.6cqw}
#s6-v2 .formation-option h3{font-size:3.3cqw}
#s6-v2 .formation-option header small{font-size:2.2cqw}
#s6-v2 .formation-option .radio{width:3.5cqw;height:3.5cqw;margin-left:auto}
#s6-v2 .formation-mini{height:38cqw}
#s6-v2 .formation-mini .face{width:14.5cqw;height:14.5cqw}
#s6-v2 .formation-mini b{font-size:2.45cqw;padding:0 .2cqw;line-height:1.3}
#s6-v2 .formation-note{font-size:2.4cqw;padding:.8cqw;gap:1cqw}
#s6-v2 .talent-tree{height:76cqw;margin-top:-4.5cqw}
#s6-v2 .talent-tree .branch-outline,#s6-v2 .talent-tree .trunk-outline{fill:none;stroke:#8c582a;stroke-width:1.8;stroke-linecap:round;vector-effect:none}
#s6-v2 .talent-tree .trunk-outline{stroke-width:2.9}
#s6-v2 .talent-tree .branch,#s6-v2 .talent-tree .trunk{stroke:#bf8a48;stroke-width:1.2;vector-effect:none}
#s6-v2 .talent-tree .trunk{stroke-width:2.1}
#s6-v2 .talent-tree .branch-light,#s6-v2 .talent-tree .trunk-light{fill:none;stroke:#e5b875;stroke-width:.3;stroke-linecap:round;vector-effect:none;transform:translateY(-.22px)}
#s6-v2 .talent-tree .trunk-light{stroke-width:.5;transform:translateX(-.4px)}
#s6-v2 .talent-sprout{position:absolute;width:4.5cqw;height:auto;transform:translate(-50%,-100%);pointer-events:none;object-fit:contain}
#s6-v2 .talent-wallet{font-size:3.2cqw}
#s6-v2 .talent-wallet em{font-size:3.8cqw}
#s6-v2 .talent-info{padding:1.7cqw 2cqw;border:0;background:none}
#s6-v2 .talent-info h3{font-size:3.2cqw}
#s6-v2 .talent-info p,#s6-v2 .talent-info>b{font-size:2.6cqw}

/* Equipment upgrades: the preview shares detail rows and painted section capsules. */
#s6-v2 .forge-scene{height:46%;background-position:center 58%}
#s6-v2 .forge-scene .wallet{top:max(10px,env(safe-area-inset-top,0px));left:2cqw;z-index:2}
#s6-v2 .forge-scene .wallet .resource{height:5.5cqw;font-size:3.2cqw}
#s6-v2 .forge-scene>.title-plaque{top:max(2cqw,env(safe-area-inset-top,0px));margin:0!important;left:60%}
#s6-v2 .forge-scene .title-plaque .plate{font-size:4.6cqw;padding:0;gap:0}
#s6-v2 .forge-item{top:22cqw}
#s6-v2 .forge-item>.gear-tile{width:15cqw;border:0}
#s6-v2 .forge-item h2{font-size:4.1cqw}
#s6-v2 .forge-weapon{width:31%;height:40%;left:34.5%;bottom:17%;filter:drop-shadow(0 0 3cqw #ffdc66)}
#s6-v2 .upgrade-body{background:linear-gradient(#fff1e0,#ffecd7);padding:2.5cqw 5cqw 2cqw;gap:1cqw;border-radius:5cqw 5cqw 0 0;box-shadow:0 -.4cqw 0 #fff5e6;min-height:0;overflow:auto}
#s6-v2 .level-preview{font-size:6.3cqw;padding:1cqw 0 2cqw;flex-shrink:0;gap:3cqw}
#s6-v2 .level-preview .change-arrow{width:5.8cqw;height:5.8cqw;color:#925323}
#s6-v2 .upgrade-body .section-title:after{display:none}
#s6-v2 .upgrade-body .section-title>span{font-size:3.6cqw;background:#ffdda2;border-radius:4cqw;padding:.6cqw 2.5cqw .6cqw 1.5cqw;gap:1.5cqw}
#s6-v2 .upgrade-body .section-mark{width:4cqw;height:4cqw}
#s6-v2 .upgrade-body .stat-row{font-size:3.5cqw;min-height:5.6cqw;padding:.5cqw 3cqw;margin:.25cqw 0;flex-shrink:0}
#s6-v2 .upgrade-body .stat-glyph{width:4.2cqw;height:4.2cqw}
#s6-v2 .upgrade-body .change{font-size:3.5cqw}
#s6-v2 .upgrade-costs{padding:2.5cqw 3cqw 1.5cqw;gap:2cqw;flex-shrink:0}
#s6-v2 .cost-icon{width:11cqw;height:10cqw;background:#f6d9b5;border-color:#c89564;border-radius:2cqw}
#s6-v2 .upgrade-costs b{font-size:3.2cqw}
#s6-v2 .upgrade-costs button{height:9.5cqw;min-height:9.5cqw;font-size:5cqw;min-width:35%}
#s6-v2 .upgrade-body .secondary-close{height:10cqw;min-height:10cqw;width:44%;font-size:5cqw;margin:2cqw 0 max(2cqw,env(safe-area-inset-bottom,0px))}
#s6-v2 .breakthrough-note{font-size:2.5cqw;gap:1.5cqw;flex-shrink:0}

/* Use aspect ratio as well as height: 430×764 needs the same fit as 360×640. */
@media(max-height:700px),(min-aspect-ratio:9/17){
 #s6-v2 .hero-page{grid-template-rows:6.5cqw 9cqw minmax(0,1fr) 5.5cqw 8cqw 27cqw 30.7cqw 15.5cqw}
 #s6-v2 .hero-page::before{height:calc(100% - 84.7cqw - env(safe-area-inset-bottom,0px))}
 #s6-v2 .hero-page .card-title{line-height:1.1}
 #s6-v2 .hero-page>.skills-card{padding:.7cqw 2.5cqw}
 #s6-v2 .hero-stage .hero-figure{height:calc(100% - 27cqw);max-height:58cqw;bottom:9.3cqw}
 #s6-v2 .hero-page .hero-skills .kind{font-size:2.3cqw}
 #s6-v2 .hero-page .hero-skill-art,#s6-v2 .hero-page .locked-skill-icon,#s6-v2 .hero-page .hero-skills .tree-button img{width:10.6cqw!important;height:10.6cqw!important}
 #s6-v2 .hero-page .hero-skills .tree-button img{width:12.4cqw!important;height:12.4cqw!important}
 #s6-v2 .formation-scene{min-height:64cqw}
 #s6-v2 .v2-dialog .talent-tree{height:70cqw}
}
`;
