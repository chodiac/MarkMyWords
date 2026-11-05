# Ubacuje inline SVG masku logotipa u index.html (python build.py)
import re
svg=open('../images/web/logo-black.svg',encoding='utf-8').read()
inner=re.search(r'<svg[^>]*>(.*)</svg>',svg,re.S).group(1)
t=open('index.template.html',encoding='utf-8').read()
open('index.html','w',encoding='utf-8').write(t.replace('<!--LOGO_MASK-->',inner))
print('ok',len(inner))
