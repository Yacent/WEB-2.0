import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import re
class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers = [
            (r"/", IndexHandler)
        ],
        template_path = os.path.join(pth, "templates"),
        static_path = os.path.join(pth, "static"),
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()