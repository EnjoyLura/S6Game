"""Build a portable visual review from the reference collection and actual captures.

python scripts/generate-fidelity-review.py --captures temp/ui-audit/after --before temp/ui-audit/before
Requires Pillow. References are review-only; never written into assets/resources.
Actual images use lossless WebP at their original capture resolution.
"""
import argparse
import base64
import html
import io
import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--captures', required=True, type=Path)
parser.add_argument('--before', type=Path)
args = parser.parse_args()
dest = ROOT / 'docs/美术参考/第二版/逐项精校'
dest.mkdir(parents=True, exist_ok=True)
ids = ['01-adventure', '02-hero', '03-recruit-normal', '04-recruit-up', '05-bag', '06-dungeons', '07-endless', '08-daily', '09-offline', '10-equipment', '11-confirm', '12-equipment-picker', '13-star', '14-skill', '15-talents', '16-pool-normal', '17-pool-up', '18-formation', '19-ten', '20-single', '21-formations', '22-rewards', '23-challenge', '24-salvage', '25-upgrade', '26-breakthrough']
notes = [
    "重绘低地平线战斗森林；按底部信息区与行动栏拟合站位，角色脚底阴影随移动/阵亡同步；放大底部信息区、头像与技能，共用体力图标。",
    "短屏回收技能/属性区多余高度给立绘；统一阵型入口美术，调整人物、装备、技能、属性的边距和字号。",
    "补齐金色月桂标题、丝带、常驻招募券、保底皇冠及详情/记录图标；标题文字独立渲染，避免描边压住笔画。",
    "补齐紫金UP角色名牌和UP票券；共用标题装饰、保底皇冠与绿色进度条，保持独立券数和实际概率。",
    "装备品质格增加轻微高光，统一金币/强化石来源，保持五列方格与底部容量操作基线。",
    "入场消耗全部复用资源栏体力图标；奖励使用真实金币/经验/强化石图，校准卡片内图标占比。",
    "统一金色标题装饰；修正奖励图标被行样式缩小的问题，调整阵容及体力消耗行。",
    "修复奖励图标占比，强化石更新为共用蓝色晶石；体力消耗与资源栏同源同色。",
    "使用带叶装饰标题牌，压缩顶部信息间距；扫荡体力与资源栏一致，五列两行半奖励视口与按钮对齐。",
    "调整标题牌高宽、品质标签字号、分区和属性行间距、效果区与按钮基线；保留实际装备效果及穿戴人。",
    "窄弹窗同步装饰标题牌，收紧内容留白，统一两按钮高度、文字粗细和提示行距。",
    "同步装饰标题牌、五列四行品质格高光，校准筛选、部位图标及标签基线。",
    "调整装饰标题牌、升星肖像与消耗卡，收紧属性预览行和数值列间距；可用份数不足显示真实禁用状态。",
    "调整技能标题、标签、属性行与描述卡的字号和留白，修正标题牌与关闭按钮比例。",
    "同步标题牌与按钮尺度，校准点数、节点说明及树区；徽章颜色依据学习状态，不能照抄示例的已学习进度。",
    "同步装饰标题牌，增大规则文字；保留四名实际英雄、概率及保底说明。",
    "UP卡池复用通用标题牌与字号，独立展示当期UP角色、实际概率和规则。",
    "编队标题与阵型图标统一；候选英雄卡改为完整立绘、品质渐变底，调整卡片、角色标签及工具栏对齐。",
    "新增金色星芒月桂标题美术；调整标题与卡片距离、全身立绘、职业角标和重复/NEW标签，保留五列双排。",
    "单卡居中并显示全身立绘；共用结果标题和票券，校准底部双行按钮及余券显示。",
    "调整装饰标题牌、预设小卡和受击率文字，保留缩略人物边界与底部操作分隔。",
    "接入独立金色庆祝标题，调整宽高和奖励带间距；经验、金币和强化石与其他页面同源。",
    "统一装饰标题、当前体力与消耗图标；调整难度、属性行和按钮，奖励列表保留真实副本奖励种类。",
    "调整品质勾选字号、选中标记、三行半视口和共用晶石；修复构建后Set展开错误引起的预览为0和分解失败。",
    "装备强化同步装饰标题牌和共用晶石；校准等级预览、属性行、费用列与底部两组按钮。",
    "突破与普通升级共享标题、材料和属性布局；保留真实前后数值、所需费用及升级行为。"
]
reference_html = (ROOT / 'docs/第二版界面效果图合集.html').read_text('utf-8')
articles = re.findall(r'<article.*?</article>', reference_html, re.S)
assert len(articles) == len(ids), 'Reference collection changed; review mapping before export'
checks = json.loads((args.captures / 'layout-audit.json').read_text('utf-8'))
assert len(checks) == 145 and {r['id'] for r in checks} >= set(ids)
rows = []
for index, (id, article, note) in enumerate(zip(ids, articles, notes)):
    title = html.unescape(re.search(r'<h2>(.*?)</h2>', article).group(1))
    source = html.unescape(re.search(r'<footer>(.*?) ·', article).group(1))
    png = base64.b64decode(re.search(r'src="data:image/[^;]+;base64,([^"]+)"', article).group(1))
    ref = Image.open(io.BytesIO(png)).convert('RGB')
    ref.thumbnail((470, 836), Image.Resampling.LANCZOS)
    ref.save(dest / f'{id}-ref.webp', quality=96, method=6)
    after = Image.open(args.captures / f'{id}.png').convert('RGB')
    assert after.size == (860, 1528), 'Capture at 430×764 @2x for proportional comparison'
    after.save(dest / f'{id}-after.webp', lossless=True, method=6)
    if args.before:
        before = Image.open(args.before / f'{id}.png').convert('RGB')
        assert before.size == after.size
        before.thumbnail((470, 836), Image.Resampling.LANCZOS)
        before.save(dest / f'{id}-before.webp', quality=96, method=6)
    rows.append(dict(id=id, title=title, source=source, note=note, before=(dest / f'{id}-before.webp').exists()))
    # Regression check for the previous horizontal hole through both result buttons.
    if id in ['19-ten', '20-single']:
        geometry = next(r for r in checks if r['id'] == id and r['viewport'] == {'width': 430, 'height': 764})
        for action in geometry['actions']:
            rect = action['box']
            x = round((rect['x'] + rect['w'] * .14) * 2)
            y = round((rect['y'] + rect['h'] * .5) * 2)
            for dy in range(-4, 5):
                r, g, b = after.getpixel((x, y + dy))
                assert r > 170 and g > 80, f'{id}: button skin has a dark or transparent centre seam'

manifest = {'viewport': '430×764 @2x', 'reference_previews': '470px, WebP quality 96; full references remain in original collection', 'actual_images': 'original screenshot resolution, lossless WebP', 'checks': len(checks), 'screens': rows}
(dest / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), 'utf-8')
(dest / 'layout-audit.json').write_text(json.dumps(checks, ensure_ascii=False, separators=(',', ':')), 'utf-8')
template = r'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>第二版界面 · 逐项精校对照</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4ecdc;color:#493322;font:14px/1.65 system-ui,"Microsoft YaHei",sans-serif}header{padding:22px 28px;background:#193f34;color:#ffefd0}h1{font-size:25px;margin:4px 0 7px}header p{margin:4px 0;max-width:1100px;color:#dae4d3}.badges{display:flex;gap:8px;flex-wrap:wrap}.badges span{background:#f6cc66;color:#4b341c;padding:3px 11px;border-radius:20px;font-weight:700}header a{color:#ffda83}main{display:grid;grid-template-columns:235px 1fr;min-height:calc(100vh - 184px)}aside{padding:12px;background:#e9dec8;border-right:1px solid #cdbd9e;max-height:calc(100vh - 184px);overflow:auto;position:sticky;top:0}aside button{display:block;text-align:left;width:100%;margin:3px 0;background:transparent;border:0;border-radius:7px;padding:7px 9px;color:#624933;font:inherit;cursor:pointer}aside button[aria-current=true]{background:#194b3b;color:#fff2d2;font-weight:700}.content{padding:18px 24px;min-width:0}h2{font-size:21px;margin:0}#note{margin:5px 0 13px;color:#745d43}button,select{font:inherit}.toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:16px}.toolbar button{padding:5px 12px;border-radius:6px;border:1px solid #cbb58d;background:#fff9ec;color:#493322;cursor:pointer}.toolbar button[aria-pressed=true]{background:#204e3d;color:#fff1ce;border-color:#204e3d}.toolbar label{display:flex;align-items:center;gap:6px}.toolbar input[type=range]{width:160px;accent-color:#204e3d}#slider{display:none}#view{display:flex;gap:18px;justify-content:center;align-items:flex-start}figure{margin:0;min-width:0;flex:1;max-width:430px}figcaption{text-align:center;font-weight:700;margin:0 0 8px}figure img{display:block;width:100%;height:auto;border:1px solid #baa17b;border-radius:4px}figure a{display:block}#beforeFigure{display:none}.overlay #refFigure{position:relative}.overlay #afterFigure{display:none}.overlay #overlayImage{display:block;position:absolute;inset:0;width:100%;height:100%;opacity:.5;border:0}.overlay .image-stack{position:relative}#overlayImage{display:none}.footnote{margin-top:17px;color:#765d43;font-size:12px}.footnote a{color:#295c48}.overview{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-top:22px}.overview button{padding:0;border:2px solid transparent;background:#e7d9be;color:#60452d;cursor:pointer}.overview button.selected{border-color:#285c48}.overview img{width:100%;aspect-ratio:430/764;object-fit:cover;display:block}.overview span{display:block;padding:4px;font-size:11px}@media(min-width:1500px){figure{max-width:470px}}@media(max-width:800px){header{padding:16px}h1{font-size:21px}main{display:block}aside{position:static;display:flex;overflow-x:auto;max-height:none;padding:7px;gap:3px}aside button{width:auto;white-space:nowrap;margin:0}.content{padding:14px}#view{gap:8px}.toolbar{gap:7px}#note{min-height:45px}.overview{grid-template-columns:repeat(4,1fr)}}
</style></head><body><header><div class="badges"><span>26项参考对照</span><span>145组尺寸检查</span><span>真实浏览器截图</span></div><h1>第二版界面 · 逐项精校</h1><p>第二轮逐项检查26个界面，重点修正战斗落地与信息区占比、共用资源图标、招募装饰和票券，并继续精调字号、间距和对齐。此页保留可核查的差异，不以自动检查通过代替视觉一致。</p><p>实装保留四位英雄、真实数值与动态战斗；独立生成的插画与参考图仍有细节差异。<a href="第二版界面效果图合集.html" target="_blank">打开原始效果图合集</a> · <a href="第二版实装验收.html" target="_blank">长屏与交互验收</a></p></header>
<main><aside id="index" aria-label="界面列表"></aside><section class="content"><h2 id="title"></h2><p id="note"></p><div class="toolbar"><button id="prev" aria-label="上一个界面">← 上一项</button><button id="next" aria-label="下一个界面">下一项 →</button><button id="side" aria-pressed="true">并排对照</button><button id="overlay" aria-pressed="false">叠加对照</button><label id="beforeControl"><input id="showBefore" type="checkbox">显示修改前</label><label id="slider">实装透明度<input id="opacity" type="range" min="0" max="100" value="50"><output id="percent">50%</output></label></div>
<div id="view"><figure id="refFigure"><figcaption>参考效果图</figcaption><div class="image-stack"><a id="refLink" target="_blank"><img id="reference" alt=""><img id="overlayImage" alt="实装叠加"></a></div></figure><figure id="beforeFigure"><figcaption>修改前</figcaption><a id="beforeLink" target="_blank"><img id="before" alt=""></a></figure><figure id="afterFigure"><figcaption>本次实装 · 无损截图</figcaption><a id="afterLink" target="_blank"><img id="after" alt=""></a></figure></div>
<p class="footnote">实装视口430×764，设备像素比2。修改后图片以原尺寸无损保存，点击可放大。参考图和修改前图使用缩略预览，原始参考见合集。叠加用于检查相对位置，不代表像素相似度评分。<a href="美术参考/第二版/逐项精校/layout-audit.json">查看145组几何记录</a> · <a href="美术参考/第二版/逐项精校/manifest.json">查看素材清单</a></p><div class="overview" id="overview" aria-label="全部实装缩略图"></div></section></main>
<script>
const rows=__ROWS__,base='美术参考/第二版/逐项精校/',get=id=>document.getElementById(id);let selected=0,overlay=false;
rows.forEach((r,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0')+' '+r.title;b.onclick=()=>select(i);get('index').append(b);const t=document.createElement('button'),im=new Image(),label=document.createElement('span');im.src=base+r.id+'-after.webp';im.alt=r.title;im.loading='lazy';label.textContent=r.title;t.append(im,label);t.onclick=()=>{select(i);get('title').scrollIntoView({behavior:'smooth',block:'start'})};get('overview').append(t)});
function mode(value){overlay=value;get('view').classList.toggle('overlay',value);get('side').setAttribute('aria-pressed',String(!value));get('overlay').setAttribute('aria-pressed',String(value));get('slider').style.display=value?'flex':'none';get('beforeControl').style.display=value?'none':'flex';get('beforeFigure').style.display=!value&&get('showBefore').checked&&rows[selected].before?'block':'none'}
function select(i){selected=(i+rows.length)%rows.length;const r=rows[selected];get('title').textContent=String(selected+1).padStart(2,'0')+' / 26　'+r.title;get('note').textContent=r.note;for(const [key,suffix] of [['reference','ref'],['before','before'],['after','after'],['overlayImage','after']]){get(key).src=base+r.id+'-'+suffix+'.webp';get(key).alt=r.title+' '+suffix;}get('refLink').href=base+r.id+'-ref.webp';get('beforeLink').href=base+r.id+'-before.webp';get('afterLink').href=base+r.id+'-after.webp';[...get('index').children].forEach((b,n)=>b.setAttribute('aria-current',String(n===selected)));[...get('overview').children].forEach((b,n)=>b.classList.toggle('selected',n===selected));history.replaceState(null,'','#'+r.id);mode(overlay)}
get('prev').onclick=()=>select(selected-1);get('next').onclick=()=>select(selected+1);get('side').onclick=()=>mode(false);get('overlay').onclick=()=>mode(true);get('showBefore').onchange=()=>mode(overlay);get('opacity').oninput=e=>{get('overlayImage').style.opacity=e.target.value/100;get('percent').value=e.target.value+'%'};document.addEventListener('keydown',e=>{if(e.target.matches('input'))return;if(e.key==='ArrowLeft')select(selected-1);if(e.key==='ArrowRight')select(selected+1)});select(Math.max(0,rows.findIndex(r=>r.id===location.hash.slice(1))));
</script></body></html>'''
(ROOT / 'docs/界面逐项精校验收.html').write_text(template.replace('__ROWS__', json.dumps(rows, ensure_ascii=False).replace('</', r'<\/')), 'utf-8')
print(f'Exported {len(rows)} reference/before/after comparisons, 145 geometry records; result button seams checked')
