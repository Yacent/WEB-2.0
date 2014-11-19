'''Python and tornado'''
import os
import re

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

class MovieHandler(tornado.web.RequestHandler):
    '''music handlers'''
    def get(self):
        pageok = 0
        moviepath = os.path.join(os.path.dirname(__file__), "static/moviefiles")
        name = self.get_argument('film', 'princessbride')
        movie = {}
        gen_review = {}
        comments = []
        for movfile in os.listdir(moviepath):
            if movfile == name:
                movie_detail_path = os.path.join(moviepath, name)
                pageok = 0
                break
            else:
                pageok = 1

        if pageok == 0:
            movie['image'] = os.path.join(movie_detail_path,\
                'generaloverview.png')
            info = open(os.path.join(movie_detail_path, 'info.txt'))
            line_list = info.readlines()
            for i in range(4):
                str = line_list[i].rstrip()
                if i == 0:
                    movie['name'] = str
                elif i == 1:
                    movie['year'] = str
                elif i == 2:
                    movie['score'] = int(str)
                else:
                    movie['review_account'] = str

            gen = open(os.path.join(movie_detail_path, 'generaloverview.txt'))
            for line in gen.readlines():
                line = line.rstrip()
                temp = line.split(':')
                gen_review[temp[0]] = temp[1]
            review_a = 0
            for fil in os.listdir(movie_detail_path):
                res = re.match(r'^review(\d*)\.txt$', fil)
                if res:
                    comment = {}
                    re_file = open(os.path.join(movie_detail_path, fil))
                    line_list = re_file.readlines()
                    for i in range(4):
                        str = line_list[i].rstrip()
                        if i == 0:
                            comment['content'] = str
                        elif i == 1:
                            comment['good'] = str
                        elif i == 2:
                            comment['author'] = str
                        else:
                            comment['info'] = str
                    comments.append(comment)
                    review_a += 1
            self.render('skeleton.html', comments=comments, \
                comments_acc=review_a, movie=movie, gen_review=gen_review)
        else:
            self.render('404.html')

    def data_received(self, chunk):
        pass

def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers=[(r"/movie", MovieHandler)],
        template_path=os.path.join(pth, "templates"),
        static_path=os.path.join(pth, "static"),
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

