#User-agent Dectect
#Tornado 实现
[Testagent on SAE](http://web20lab.sinaapp.com/testagent)
#JS 实现
[Testagent on static HTML](http://yickli.github.io/WEB-2.0/useragent/index.html)

> 貌似浏览器都会伪装，所以检测也不准确。难点在于如何找出各种各样平台的 UA 来写出正确的正则表达式。因为还是有不少浏览器不按照规范写 UA 字符串的。之所以注释掉其中一个 Handler 是因为最终发现这样检测也会有很多漏洞。另外 JS 实现是参考了 《JavaScript 高级教程》的代码的，不过代码直接压缩写进 HTML 了（这样习惯不好）。
