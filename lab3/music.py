'''Python and tornado'''
import os
import random

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

class Application(tornado.web.Application):
    '''__init__'''
    def __init__(self):
        handlers = [
            (r"/music", MusicHandler)
        ]
        pth = os.path.dirname(__file__)
        settings = dict(
            template_path = os.path.join(pth, "templates"),
            static_path = os.path.join(pth, "static")
        )
        tornado.web.Application.__init__(self, handlers, **settings)

class MusicHandler(tornado.web.RequestHandler):
    '''music handlers'''
    def get(self):

        songspath = os.path.join(os.path.dirname(__file__), "static/songs")
        lists = []
        playlists = []

        for fil in os.listdir(songspath):
            src = os.path.join(songspath, fil)
            siz = os.path.getsize(os.path.join(songspath, fil))
            if fil.endswith(".mp3"):
                lists.append({"name": fil, "src": src,"size" : siz})
            if fil.endswith(".txt"):
                playlists.append({"name": fil, "src": src, "size" : siz})

        listname = self.get_argument('playlist', 'hello')
        shuffle = self.get_argument('shuffle', 'off')
        bysize = self.get_argument('bysize', 'off')
        listss = []
        
        if listname == 'hello':
            self.render('music.html', l = handlerlist(lists, bysize, shuffle),
            pl = playlists)
        else:
            listname = self.get_argument('playlist')
            txt = open(os.path.join(songspath, listname))   
            for line in txt:
                line = line.rstrip()
                for i in lists:
                    if i["name"] == line:
                        listss.append(i)
            self.render('music.html', l = handlerlist(listss, bysize, shuffle),
                pl = [])          

def transform(size):
    '''transform format of size'''
    if size < 1023:
        return str(size)+' b'
    elif size < 1048575:
        size = float(size)
        size = round(size/1024, 2)
        return str(size)+' kb'
    else:
        size = float(size)
        size = round(size/1024/1024, 2)
        return str(size)+' mb'

def handlerlist(lists, bysize = 'off', shuffle = 'off'):
    '''to sort'''
    if bysize == 'on':
        lists.sort(key = lambda x:x['size'], reverse=True)
    if shuffle == 'on':
        random.shuffle(lists)
    for i in lists:
        i['size'] = transform(i['size'])
    return lists

def main():
    '''main'''
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

