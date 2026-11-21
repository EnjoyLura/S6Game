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
    '更新四英雄与底部导航美术，统一图标可见面积；保留实时战斗站位与血量。',
    '校准人物、装备、技能与属性的比例，立绘输出提高到640像素；短屏完整显示十四项真实属性。',
    '重绘星门场景、四英雄、导航；校准英雄构图、描边标题、丝带和底部控件间距。',
    'UP池复用新场景与四英雄，保留法师前置构图及独立券数、概率和保底。',
    '统一五列正方形格、分类栏和底部容量操作区，调整奶油底色、间距与圆角。',
    '调整四张副本卡的插画、名称、奖励和挑战按钮对齐；奖励来自真实配置。',
    '校准插画标题、奖励和阵容各行的间距，更新英雄头像与导航。',
    '校准插画位置、奖励和阵容基线，保留实际每日次数。',
    '压缩标题与资源行，按实际列宽计算两行半奖励视口，校准领取按钮。',
    '收紧底板、字号、品质标签、属性行、分区胶囊与按钮，数值和效果取实际装备。',
    '校准窄弹窗宽度、提示文字行高和两按钮尺寸，保留实际扩容价格与容量。',
    '校准五列四行格、筛选栏和部位栏，保持方格与横向边界。',
    '统一头像、星星、分区标题、变化箭头和两列数值，消耗卡依实际数量显示。',
    '收紧技能图标、等级标签与描述卡，属性行字号和高度与装备弹窗一致。',
    '校准树区高度、点数、节点说明与底部操作；徽章明暗按真实学习状态显示。',
    '统一卡池弹窗宽度、头像间距、三条概率行与规则行距；仅展示已实现四英雄。',
    '复用常驻池弹窗尺度，保留真实UP角色与独立规则。',
    '更新三人站位美术，收紧预设工具行，统一卡片与关闭按钮；仅展示四位实际英雄。',
    '独立星门背景避免底层控件透出，标题与五列双排卡重新对齐，修复双行按钮的九切片中缝。',
    '单卡居中、标题与十连共用基线，两招募按钮完整显示券数。',
    '校准四个阵型卡、三人缩略站位、受击率字号和底部按钮，防止缩略人物溢出。',
    '校准金色大标题、分隔线和五列两行半奖励带，数量与图标来自实际领取。',
    '校准插画、难度、属性和按钮，奖励预览保持五列两行半，奖励种类按实际副本。',
    '校准品质勾选、三行半装备视口、材料预览和分解按钮；排除锁定/穿戴装备。',
    '重绘铁匠场景，校准装备悬浮位置、等级箭头、属性胶囊、材料与两组按钮。',
    '与普通升级共用版式，保留实际突破前后数值与材料需求。',
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
</style></head><body><header><div class="badges"><span>26项参考对照</span><span>145组尺寸检查</span><span>真实浏览器截图</span></div><h1>第二版界面 · 逐项精校</h1><p>按参考图逐项校准布局，并接入重新生成的招募场景、锻造场景、四英雄及导航图标。此页保留可核查的差异，不以自动检查通过代替视觉一致。</p><p>实装保留四位英雄、真实数值与动态战斗；独立生成的插画与参考图仍有细节差异。<a href="第二版界面效果图合集.html" target="_blank">打开原始效果图合集</a> · <a href="第二版实装验收.html" target="_blank">长屏与交互验收</a></p></header>
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
