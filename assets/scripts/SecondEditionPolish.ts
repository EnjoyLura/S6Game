/** Reference pass at 941×1672. Values use the game frame, never the browser width.
 * Keep this final layer grouped by component so the reference geometry has one owner.
 */
export const SECOND_EDITION_POLISH = `
/* Shared spacing, warm paper and typography. */
#s6-v2{font-variant-numeric:tabular-nums}
#s6-v2 .page,#s6-v2 .secondary{background-color:#ffecd7}
#s6-v2 .bag-page,#s6-v2 .dungeon-page{gap:1.5cqw}
#s6-v2 .bag-page>.wallet,#s6-v2 .dungeon-page>.wallet{height:7cqw}
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
#s6-v2 .formation-link>img,#s6-v2 .lineup-button>img{width:4.5cqw;height:4.5cqw}
#s6-v2 .ticket-art{display:inline-block;position:relative;vertical-align:middle;width:5.5cqw;height:4.8cqw}
#s6-v2 .ticket-art>img{display:block;width:100%;height:100%}
#s6-v2 .ticket-art>b{position:absolute!important;left:21%;top:35%;font:900 1.9cqw/1 Arial,sans-serif!important;color:#fff!important;text-shadow:.12cqw .12cqw #5d287c,-.12cqw -.12cqw #5d287c;transform:rotate(-17deg)}
#s6-v2 .ticket-resource .ticket-art{width:7cqw;height:6cqw}
#s6-v2 .ticket-resource .ticket-art>b{font-size:2.4cqw!important}

/* Adventure tray keeps the reference share of the screen, including tall phones. */
#s6-v2 .battle-hud{--battle-room:max(0px,100dvh - 178cqw)}
#s6-v2 .battle-hud .stage-heading{margin:0;height:20cqw}
#s6-v2 .battle-hud .stage-heading h1{font-size:6.5cqw;text-shadow:none}
#s6-v2 .battle-hud .stage-heading h1>span{paint-order:stroke fill;-webkit-text-stroke:.6cqw #fff9e9;filter:drop-shadow(0 .25cqw 0 #b58c59)}
#s6-v2 .battle-hud .stage-heading>b,#s6-v2 .battle-hud .stage-heading small{-webkit-text-stroke:.3cqw #fff9e9;paint-order:stroke fill}
#s6-v2 .turn-portrait{overflow:hidden;border-radius:50%}
#s6-v2 .turn-portrait .face{width:100%;height:100%;object-fit:cover;transform:scale(1.65);transform-origin:center 12%}
#s6-v2 .skill-bar{height:calc(42cqw + var(--battle-room)*.34);padding:3cqw 1.8cqw 2cqw;gap:1.5cqw}
#s6-v2 .party-card{justify-content:space-between;padding-right:1.3cqw;gap:1cqw}
#s6-v2 .party-card>header{height:calc(18cqw + var(--battle-room)*.18);gap:.8cqw}
#s6-v2 .party-card b{font-size:3.2cqw}
#s6-v2 .party-card>header>div{gap:.8cqw}
#s6-v2 .party-card>header>div>b{font-size:3.5cqw;line-height:1.3}
#s6-v2 .party-card .party-portrait{width:11.5cqw;height:12cqw;border:.4cqw solid #ffe1a6}
#s6-v2 .party-card .party-tags{font-size:2.5cqw;gap:.3cqw}
#s6-v2 .party-card .party-tags i{font-size:2.4cqw;padding:0 .3cqw}
#s6-v2 .party-card small[data-hp-label],#s6-v2 .party-card small[data-shield]{display:flex;align-items:center;gap:.3cqw;font-size:2.7cqw;line-height:1.15;min-height:3.4cqw}
#s6-v2 .party-card .resource-art{width:3cqw;height:3cqw}
#s6-v2 .party-card .health-track{height:2cqw;margin-top:1cqw}
#s6-v2 .skill-button>img,#s6-v2 .skill-button>.locked-skill-icon{width:13.3cqw;height:13.3cqw}
#s6-v2 .skill-button small{font-size:3cqw;line-height:1.3}
#s6-v2 .active-skills{gap:1.2cqw}

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
#s6-v2 .hero-page .tree-button{padding-top:0}
#s6-v2 .hero-page .hero-skills .tree-button img{width:11.5cqw!important;height:11.5cqw!important}

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
#s6-v2 .up-badge{width:23cqw;height:13cqw;right:5%;bottom:10%;background:var(--up-badge) center/100% 100% no-repeat;border:0;border-radius:0;box-shadow:none;padding:0;transform:none;display:block}
#s6-v2 .up-badge strong{position:absolute;left:13%;top:25%;font-size:4.3cqw;transform:rotate(-5deg);text-shadow:.2cqw .2cqw #50256e}
#s6-v2 .up-badge b{position:absolute;left:34%;top:66%;padding:0;background:none;font:900 3.7cqw/1 Arial,sans-serif;transform:rotate(-5deg)}
#s6-v2 .pity-panel .crown{width:10cqw;height:10cqw;background:none;border:0}
#s6-v2 .pity-panel .crown img{width:100%;height:100%}
#s6-v2 .pity-panel .exp-track{background:#c6a17f;border:1px solid #785232}
#s6-v2 .pity-panel .exp-track i{background:linear-gradient(#adff52,#64e71a 60%,#3ab815)}
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
#s6-v2 .dialog-head .plate{font-size:3.9cqw;padding:1.4cqw 4.2cqw;gap:1.6cqw}
#s6-v2.has-decoration .plate{background:var(--title-plaque) center/100% 100% no-repeat!important;border:0!important;border-radius:0;box-shadow:none!important;clip-path:none;min-width:40cqw;height:8.4cqw;padding:.7cqw 8cqw 0;justify-content:center;gap:0}
#s6-v2.has-decoration .plate>i{display:none}
#s6-v2.has-decoration .plate:before,#s6-v2.has-decoration .plate:after{display:none}
#s6-v2.has-decoration .dialog-head:not(.celebrate){margin-top:-5.4cqw;min-height:6cqw}
#s6-v2.has-decoration .dialog-head .v2-button.close{top:-.1cqw}
#s6-v2 .dialog-head .plate>i{font-size:2.2cqw}
#s6-v2 .dialog-head .plate>i:first-child:before,#s6-v2 .dialog-head .plate>i:last-child:before{width:5.8cqw;height:4cqw;top:.2cqw}
#s6-v2 .dialog-head .plate>i:first-child:before{left:-4.5cqw}
#s6-v2 .dialog-head .plate>i:last-child:before{right:-4.5cqw}
#s6-v2 .dialog-head .v2-button.close{width:7cqw;height:7cqw;right:-3.4cqw;top:-3.5cqw;font-size:5.4cqw;border-width:2px!important}
#s6-v2 .dialog-body{gap:.4cqw;padding:.4cqw .5cqw;flex-shrink:1;overflow-x:hidden}
#s6-v2 .outside-hint{font-size:2.7cqw;gap:1.7cqw;flex-shrink:0}
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
#s6-v2 .small .info-pad{font-size:2.9cqw;padding:2.8cqw 2cqw;line-height:1.7;background:#f5e7d5}
#s6-v2 .small .info-pad b{font-size:3.2cqw}
#s6-v2 .small .info-pad small{font-size:2.5cqw}
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
#s6-v2 .pool-dialog .rules{font-size:2.9cqw;line-height:1.8;padding:1.7cqw 1.5cqw 1.7cqw 5cqw}

/* Celebrations use a clean scene, with a true two-line action area. */
#s6-v2 .v2-scrim.dark{background:linear-gradient(#0e1839b3,#0b122de8),var(--result-scene) center/100% 100% no-repeat}
#s6-v2 .v2-scrim.warm{background:radial-gradient(ellipse at 50% 40%,#2b210acc,#100c08eb 75%)}
#s6-v2 .fullscreen.results-screen{height:140cqw;max-height:88%;gap:3cqw;justify-content:flex-start}
#s6-v2 .results-screen .dialog-head{margin-top:8cqw}
#s6-v2 .results-screen .dialog-body{flex:1;overflow:visible;gap:4cqw}
#s6-v2 .celebrate{position:relative;isolation:isolate;flex:none;width:66cqw;height:20.5cqw;align-self:center;justify-content:center;align-items:flex-end!important;padding:6cqw 5cqw 2.5cqw!important;background:var(--celebration) center/100% 100% no-repeat!important}
#s6-v2 .celebrate:before{display:none}
#s6-v2 .fullscreen .celebrate h2{font-size:8.8cqw;letter-spacing:.1cqw;color:#fff2c2;-webkit-text-stroke:.4cqw #a45814;paint-order:stroke fill;text-shadow:0 .4cqw #7a3d0d,0 0 2cqw #f9be3c;white-space:nowrap}
#s6-v2 .celebrate .laurel{display:none}
#s6-v2 .result-sub{font-size:3.4cqw;padding:.6cqw 5cqw;border-top:1px solid #d5ac5366;border-bottom:1px solid #d5ac5366}
#s6-v2 .result-sub em{font-size:3.8cqw}
#s6-v2 .result-cards.five-grid{padding:2cqw 0;gap:3cqw 2cqw}
#s6-v2 .result-cards.single{width:29cqw;margin:7cqw auto 0}
#s6-v2 .result-cards .hero-card{padding:.6cqw .6cqw 1cqw;border-width:1px;border-radius:2cqw;gap:.4cqw}
#s6-v2 .result-cards .hero-card .portrait{aspect-ratio:.9;border-radius:1.5cqw}
#s6-v2 .result-cards .hero-card>b{font-size:2.9cqw}
#s6-v2 .result-cards .hero-card .star-row{font-size:2.5cqw}
#s6-v2 .result-cards .role-badge{width:6cqw;height:6cqw;border-width:1px}
#s6-v2 .result-cards .role-glyph{width:4cqw;height:4cqw}
#s6-v2 .result-cards .card-tag{font-size:2.5cqw;padding:.35cqw .9cqw}
#s6-v2 .result-cards.single .hero-card>b{font-size:4cqw}
#s6-v2 .result-cards.single .star-row{font-size:3.9cqw}
#s6-v2 .ticket-left{margin-top:auto;font-size:2.8cqw;padding:.3cqw 2.4cqw;gap:1cqw}
#s6-v2 .ticket-left b{font-size:3.2cqw}
#s6-v2 .ticket-left .ticket-art{width:3.8cqw;height:3.8cqw}
#s6-v2.has-frame .results-screen .dialog-actions button:not(.flat){height:13.5cqw;min-height:13.5cqw;min-width:31%;padding:.8cqw 2cqw;gap:.6cqw;line-height:1.15;border-image-width:6.5cqw 5cqw!important}
#s6-v2 .results-screen .dialog-actions b{font-size:4cqw;line-height:1.1}
#s6-v2 .results-screen .dialog-actions .ticket-chip{font-size:3.2cqw;background:none;line-height:1.15}
#s6-v2 .results-screen .ticket-chip .ticket-art{width:4cqw;height:4cqw}
#s6-v2 .rewards-fullscreen{gap:3cqw;padding:0}
#s6-v2 .rewards-fullscreen .dialog-head{padding:3cqw 0 1cqw}
#s6-v2 .rewards-fullscreen .celebrate{width:72cqw;height:24cqw;padding-bottom:3cqw!important}
#s6-v2 .rewards-fullscreen .celebrate h2{font-size:10.3cqw}
#s6-v2 .rewards-fullscreen .reward-scroll{--tile:16.2cqw;height:calc(var(--tile)*2.5 + 6.2cqw);padding:1.6cqw 2cqw;border-color:#e0b762;border-radius:0}

/* Formation: compact presets and readable, bounded miniature positions. */
#s6-v2 .formation-scene{height:38%;min-height:63cqw;background-size:100% 100%}
#s6-v2 .title-plaque .plate{font-size:5.3cqw;padding:1.6cqw 6cqw}
#s6-v2 .standing-heroes{inset:17cqw 3% 6cqw}
#s6-v2 .standing .face{height:23cqw}
#s6-v2 .standing.front .face{height:27cqw}
#s6-v2 .role-tag{font-size:2.9cqw}
#s6-v2 .formation-sheet{background:#ffecd7;box-shadow:none;border-radius:4cqw 4cqw 0 0}
#s6-v2 .formation-toolbar{padding:2cqw;gap:1.1cqw;font-size:3.3cqw;border:0}
#s6-v2 .formation-toolbar .preset-buttons{gap:1cqw}
#s6-v2 .preset-buttons .v2-button{width:6.3cqw;height:6.3cqw;font-size:3.6cqw}
#s6-v2 .formation-toolbar>button{font-size:3.3cqw;padding:.6cqw 2cqw;min-height:7cqw}
#s6-v2 .formation-name{font-size:3cqw}
#s6-v2 .roster-grid{margin:0 1cqw;padding:3cqw 2.8cqw;gap:2.5cqw;background:#fff4e3;border:1px solid #e6c39e;border-radius:4cqw;scrollbar-width:thin;scrollbar-color:#f5b72d #f3d5b3}
#s6-v2 .hero-card .portrait{aspect-ratio:1.02}
#s6-v2 .hero-card{background:linear-gradient(140deg,#ffffff66,transparent 45%),linear-gradient(var(--quality) 30%,#fff3df 86%);border-color:#fff3dd;box-shadow:0 .2cqw .4cqw #53320a33}
#s6-v2 .hero-card .portrait{background:none}
#s6-v2 .hero-card .portrait .face{width:100%;height:100%;object-fit:contain;object-position:center 100%;transform:scale(.98);transform-origin:center bottom}
#s6-v2 .formation-page>.secondary-close{margin:3cqw auto max(3cqw,env(safe-area-inset-bottom,0px));width:42%;height:10cqw;min-height:10cqw;font-size:5cqw}
#s6-v2 .formation-types{gap:2cqw}
#s6-v2 .v2-button.formation-option{padding:1.2cqw;border-width:1px;overflow:hidden}
#s6-v2 .formation-option header{gap:.5cqw;flex-wrap:wrap}
#s6-v2 .formation-option header>.ico{width:4cqw;height:4cqw;padding:.6cqw}
#s6-v2 .formation-option h3{font-size:3cqw}
#s6-v2 .formation-option header small{font-size:1.9cqw}
#s6-v2 .formation-option .radio{width:3.5cqw;height:3.5cqw;margin-left:auto}
#s6-v2 .formation-mini{height:36cqw}
#s6-v2 .formation-mini .face{width:13cqw;height:13cqw}
#s6-v2 .formation-mini b{font-size:2.1cqw;padding:0 .2cqw;line-height:1.3}
#s6-v2 .formation-note{font-size:2.4cqw;padding:.8cqw;gap:1cqw}
#s6-v2 .talent-tree{height:76cqw;margin-top:-2cqw}
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
#s6-v2 .forge-scene .title-plaque .plate{font-size:4.6cqw;padding:1.5cqw 4cqw;gap:1.4cqw}
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
 #s6-v2 .hero-page{grid-template-rows:6.5cqw 9cqw minmax(0,1fr) 5.5cqw 8cqw 25.5cqw 30.7cqw 15.5cqw}
 #s6-v2 .hero-page::before{height:calc(100% - 83.2cqw - env(safe-area-inset-bottom,0px))}
 #s6-v2 .hero-page .card-title{line-height:1.1}
 #s6-v2 .hero-page>.skills-card{padding:.7cqw 2.5cqw}
 #s6-v2 .hero-stage .hero-figure{height:calc(100% - 27cqw);max-height:58cqw;bottom:9.3cqw}
 #s6-v2 .hero-page .hero-skills .kind{font-size:2.3cqw}
 #s6-v2 .hero-page .hero-skill-art,#s6-v2 .hero-page .locked-skill-icon,#s6-v2 .hero-page .hero-skills .tree-button img{width:10.6cqw!important;height:10.6cqw!important}
 #s6-v2 .formation-scene{min-height:64cqw}
 #s6-v2 .v2-dialog .talent-tree{height:70cqw}
}
`;
