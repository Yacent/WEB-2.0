import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r"/music", MusicHandler)
        ]
        pp = os.path.dirname(__file__)
        settings = dict(
            template_path = os.path.join(pp, "templates"),
            static_path = os.path.join(pp, "static")
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class MusicHandler(tornado.web.RequestHandler):
    def get(self):

        kk = os.path.join(os.path.dirname(__file__), "static/songs")
        lists = []
        ll = []

        for fil in os.listdir(kk):
            sr = os.path.join(kk, fil)
            si = os.path.getsize(os.path.join(kk, fil))
            if fil.endswith(".mp3"):
                lists.append({"name": fil, "src": sr,"size" : si})
            if fil.endswith(".txt"):
                ll.append({"name": fil, "src": sr, "size" : si})

        t = self.get_argument('playlist', 'hello')
        listss = []
        if t == 'hello':
            self.render('music.html', l = lists, pl = ll)
        else:
            t = self.get_argument('playlist')
            txt = open(os.path.join(kk, t))   
            for line in txt:
                line = line.rstrip()
                for i in lists:
                    if i["name"] == line:
                        listss.append(i)
            self.render('music.html', l = listss, pl = [])          

def main():
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(8088)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

