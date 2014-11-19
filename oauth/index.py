'''Python and tornado'''
import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import re
import QQOAuth

from tornado import gen

class LoginHandler(tornado.web.RequestHandler, QQOAuth.QQMixin):
    @tornado.web.asynchronous
    @gen.coroutine
    def get(self):
        if self.get_argument('code', None):
            print 'loginhandler get'
            user = yield self.get_authenticated_user(
                redirect_uri='http://www.oapp.me/login',
                client_id=self.settings['qq_api_key'],
                client_secret=self.settings['qq_secret'],
                code=self.get_argument('code')
            )
            self.render('qq.html', user=user)
        else:
            print 'else'
            print self.settings['qq_secret']
            self.authorize_redirect(
                redirect_uri='http://www.oapp.me/login',
                client_id=self.settings['qq_api_key'],
                client_secret=self.settings['qq_secret']
            )
            print 'end else'

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('admin.html')


#pth = os.path.dirname(__file__)
#
#app = tornado.wsgi.WSGIApplication(
#    handlers = [
#        (r"/", IndexHandler),
#        (r"/admin", MainHandler),
#        (r"/testagent", LoginHandler)
#    ],
#    template_path = os.path.join(pth, "templates"),
#    static_path = os.path.join(pth, "static"),
#    qq_api_key = '101169125',
#    qq_secret = 'a23e2361a4f2f7d299f715fd6d2304a6'
#)
#
#application = sae.create_wsgi_app(app)
#
def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers = [
            (r"/admin", IndexHandler),
            (r"/login", LoginHandler)
        ],
        template_path = os.path.join(pth, "templates"),
        static_path = os.path.join(pth, "static"),
        qq_api_key = '101169125',
        qq_secret = 'a23e2361a4f2f7d299f715fd6d2304a6',
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
