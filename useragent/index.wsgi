import tornado.wsgi

import sae

import re

import os

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        ua_str = self.request.headers['User-Agent']
        ua_info = {
            'platform': 'Mobile',
            'brand': 'Unknown',
            'os': 'Unknown',
            'os_version': 'Unknown',
        }
        ismobile = re.search(r'Mobile', ua_str)
        isiphone = re.search(r'iPhone', ua_str)
        isandroid = re.search(r'Android', ua_str)
        issony = re.search(r'Sony', ua_str)
        isxiaomi = re.search(r'Xiaomi', ua_str)
        isnokia = re.search(r'NOKIA', ua_str)
        issamsung = re.search(r'SAMSUNG', ua_str)

        if ismobile:
            ua_info['platform'] = 'Mobile'
            if issony:
                ua_info['brand'] = 'Sony'
            if issamsung:
                ua_info['brand'] = 'Samsung'
            if isxiaomi:
                ua_info['brand'] = 'Xiaomi'
            if isnokia:
                ua_info['brand'] = 'Nokia'
            if isandroid:
                ua_info['os'] = 'Andoid'
                android_ver = re.search(r'Android( |/)(.*?)(;| ).*', ua_str)
                ua_info['os_version'] = android_ver.group(2)
            if isiphone:
                ua_info['brand'] = 'iPhone'
                ua_info['os'] = 'iOS'
                ios_ver = re.search(r'iPhone OS (.*?) .*', ua_str)
                ua_info['os_version'] = ios_ver.group(1)
        else:
            ua_info['platform'] = 'PC'
        self.render('index.html', ua = ua_info, us = ua_str)

#class TestHandler(tornado.web.RequestHandler):
#    def get(self):
#        ua_str = self.request.headers['User-Agent']
#        ua_info = []
#        system = {
#            'win' : False,
#            'mac' : False,
#            'iphone' : False,
#            'ipad' : False
#        }
#        engine = {
#            'gecko' : 0,
#            'webkit' : 0,
#            'ie' : 0
#        }
#        browser = {
#            'ie' : 0,
#            'firefox' : 0,
#            'chrome' : 0,
#            'safari' : 0
#        }
#        appwebkit = re.search(r'AppleWebKit\/(\S+)', ua_str)
#        if appwebkit:
#            engine['webKit'] = appwebKit.group(1)
#
#        gecko = re.search(r'rv:([^\)]+)\) Gecko\/\d{8}', ua_str)
#        if gecko:
#            engine['gecko'] = gecko.group(1)
#
#        chrome = re.search(r'Chrome\/(\S+)', ua_str)
#        firefox = re.search(r'Firefox\/(\S+)', ua_str)
#        safari = re.search(r'Safari\/(\S+)', ua_str)
#        if chrome:
#            browser['chrome'] = chrome.group(1)
#        elif firefox:
#            browser['firefox'] = firefox.group(1)
#        elif safari:
#            browser['safari'] = safari.group(1)
#
#        msie = (r'MSIE ([^;]+)', ua_str)
#        msie1 = (r'.NET([^;]+)', ua_str)
#        if msie or msie1:
#            engine['ie'] = msie1.group(1)
#        
#        ismobile = re.search(r'Mobile', ua_str)
#        if ismobile：

pth = os.path.dirname(__file__)

app = tornado.wsgi.WSGIApplication(
    handlers = [
        (r"/testagent", MainHandler),
        #(r"/testagent1", TestHandler)
        ]
    template_path = os.path.join(pth, "templates"),
    static_path = os.path.join(pth, "static")
)

application = sae.create_wsgi_app(app)