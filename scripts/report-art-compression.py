"""Publish measured PNG/WebP comparisons; leaves the game's original art untouched."""
from pathlib import Path
from shutil import copyfile
from PIL import Image, ImageDraw, ImageFont
import json

ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'temp/art-compression/results.json').read_text(encoding='utf-8'))
OUT=ROOT/'docs/美术参考/第二版/压缩对比'
OUT.mkdir(parents=True,exist_ok=True)
backgrounds={'forest.png','training-yard.png','v2-backgrounds.png','v2-feature-scenes.png','v2-battle-forest.png','v2-summon-scene.png','v2-forge-scene.png','v2-formation-yard-v4.png','v2-up-scene-v3.png'}
characters={prefix+name+'.png' for prefix in ['hero-','v2-hero-'] for name in ['knight','mage','priest','archer']}|{'actors.png','monsters-4.png'}
total=sum(r['original'] for r in rows)
mixed=sum(r['q92'] if r['name'] in backgrounds|characters else r['lossless'] for r in rows)
totals={k:sum(r[k] for r in rows) for k in ['original','lossless','q92','75pct_q92']}
totals['mixed']=mixed
report={'files':len(rows),'totals':totals,'rgbaBytes':sum(r['width']*r['height']*4 for r in rows),'backgrounds':sorted(backgrounds),'characters':sorted(characters),'rows':rows}
(OUT/'实测数据.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
samples=['v2-battle-forest.png','v2-hero-knight.png','v2-result-title-v6.png','v2-navigation-polished.png']
sample_html=''
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',22)
for name in samples:
    stem=Path(name).stem
    original=ROOT/'assets/resources/art'/name
    variants=[original, ROOT/'temp/art-compression/q92'/f'{stem}.webp', ROOT/'temp/art-compression/75pct_q92'/f'{stem}.webp']
    canvas=Image.new('RGB',(1200,465),'#fff0d8');draw=ImageDraw.Draw(canvas)
    for i,(label,p) in enumerate(zip(['原 PNG · 100%尺寸','WebP Q92 · 100%尺寸','WebP Q92 · 75%尺寸'],variants)):
        im=Image.open(p).convert('RGBA');im.thumbnail((380,400),Image.Resampling.LANCZOS)
        canvas.paste(im,(i*400+(400-im.width)//2,50+(400-im.height)//2),im)
        draw.text((i*400+14,12),label,font=font,fill='#603719')
        if i:copyfile(p,OUT/f'{stem}-{i}.webp')
    canvas.save(OUT/f'{stem}-对比.png')
    sample_html+=f'<h3>{name}</h3><img class="comparison" src="美术参考/第二版/压缩对比/{stem}-对比.png"><p><a href="../assets/resources/art/{name}">原图</a> · <a href="美术参考/第二版/压缩对比/{stem}-1.webp">原尺寸 Q92</a> · <a href="美术参考/第二版/压缩对比/{stem}-2.webp">75%尺寸 Q92</a></p>'
table=''
for r in rows:
    table+=f'<tr><td>{r["name"]}</td><td>{r["width"]}×{r["height"]}</td><td>{r["original"]/1024:.1f}</td>'+''.join(f'<td>{r[k]/1024:.1f}<small>原文件的 {r[k]/r["original"]:.1%}</small></td>' for k in ['lossless','q92','75pct_q92'])+'</tr>'
summary=''
for label,key,dimension,pixels in [('原 PNG','original','100% × 100%','100%'),('全量无损 WebP','lossless','100% × 100%','100%'),('分类型建议方案','mixed','100% × 100%','100%'),('全量 WebP Q92（已采用）','q92','100% × 100%','100%'),('全量缩至75% + Q92（激进比较）','75pct_q92','75% × 75%','56.25%')]:
    size=totals[key];summary+=f'<tr><td>{label}</td><td>{dimension}</td><td>{pixels}</td><td>{size/1048576:.2f} MiB</td><td>{size/total:.1%}</td><td>{1-size/total:.1%}</td></tr>'
html=f'''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>美术资源压缩策略与实测</title><style>body{{max-width:1250px;margin:30px auto;padding:0 20px;background:#fff9ef;color:#50361f;font:16px/1.75 'Microsoft YaHei',sans-serif}}table{{border-collapse:collapse;width:100%;font-size:14px}}th,td{{text-align:left;border-bottom:1px solid #ddc7a3;padding:10px}}th{{background:#f7e5c4}}small{{display:block;color:#8b735d}}.comparison{{max-width:100%;height:auto}}a{{color:#916015}}.scroll{{overflow:auto}}</style><h1>美术资源压缩策略与实测</h1><p>2026-11-22 · 49 张实际运行包 PNG · Pillow WebP method=6。浏览器运行包已采用原尺寸 WebP Q92，含艺术字、图标与按钮。项目源 PNG 保留，加载页4张轻量图已为 Q92。MiB=1,048,576字节，KiB=1,024字节。</p><h2>整体比例</h2><div class="scroll"><table><tr><th>方案</th><th>宽、高保留</th><th>像素总量保留</th><th>存储</th><th>体积保留</th><th>体积减少</th></tr>{summary}</table></div><h2>原尺寸方案对照</h2><p>同尺寸无损 WebP 保留100%像素尺寸，可见画面无损，体积减少约27%。此前对比的分类型方案将9张背景和10张人物/怪物使用原尺寸 Q92，其他30张UI、艺术字、图标及带文字图集保持无损，合计 {mixed/1048576:.2f} MiB（减少 {1-mixed/total:.1%}）。Q92是编码质量参数，不代表保留92%的画质。</p><p>不建议整包宽高统一缩至75%。这会令总像素量变成56.25%；小字、细边框和小图标最先损失清晰度，部分图集裁切坐标也需同步修改。若以后降低背景分辨率，应按最大屏幕显示面积×设备像素比逐张确定；人物透明边缘、标题与九切片保持原尺寸。</p><p>仅转换文件格式不会降低同尺寸解码后的像素内存。49张按RGBA8粗算约 {report['rgbaBytes']/1048576:.2f} MiB，尚未计GPU副本、纹理mipmap和派生图标。真正降低像素内存需要减分辨率、移除不再引用的旧图，或后续按页面释放；与本次全部美术就绪再进入的要求分开评估。</p><h2>可视对比（点击原文件检查100%）</h2>{sample_html}<h2>49张逐项实测，单位KiB</h2><div class="scroll"><table><tr><th>素材</th><th>原像素尺寸</th><th>PNG</th><th>同尺寸无损</th><th>同尺寸Q92</th><th>75%尺寸Q92</th></tr>{table}</table></div><p>预载缓存按内容哈希检查：未变化图片重复进入无需下载；新版仅下载改变的文件；浏览器清理缓存后按首次加载处理。缓存只覆盖美术，不承诺整站断网启动。</p></html>'''
(ROOT/'docs/美术资源压缩策略.html').write_text(html,encoding='utf-8')
print(json.dumps(totals));print('Mixed saving:',1-mixed/total)
