import tornado.wsgi

import sae

import re

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

app = tornado.wsgi.WSGIApplication([
    (r"/", MainHandler),
])

application = sae.create_wsgi_app(app)