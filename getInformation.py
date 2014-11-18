import urllib
from HTMLParser import HTMLParser
from lxml import html

url="http://pd.wh.seed.net.tw/fetc/cpc/cpc0331.html"
content=urllib.urlopen(url).read()
result=html.document_fromstring(content)
def traverse(parent):
  if parent.tag=='tr':
    s = parent.text_content()
    if s.find(u"\u670d\u52d9\u64da\u9ede\u540d\u7a31")!=14:
      p=1
      l = s.split()
      for i in range(0,len(l),1):
        if len(l[i])==1:
          l[i]=""
      while l.count("")!=0:
        l.remove("")
      s = "\n".join(l)
      if s!="" and len(s)>2 :
        print s.encode("utf-8")
  for node in parent.getchildren():
    traverse(node)

traverse(result)
