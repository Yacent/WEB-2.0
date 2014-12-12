'''Python and tornado'''
import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

import tornado.options
from tornado.options import define, options
define("port", default=8888, help="run on the given port", type=int)

class Person(object):
    '''define person'''
    def __init__(self, name, gender, age, ptype, pos, sex, age_start, age_end):
        self.__name = name
        self.__gender = gender
        self.__age = age
        self.__type = ptype
        self.__os = pos
        self.__age_start = age_start
        self.__age_end = age_end
        self.__rating = 0
        self.__image = None
        if len(sex) == 2:
            self.__sex = sex[0]+sex[1]
        else:
            self.__sex = sex[0]

    @property
    def name(self):
        """name"""
        return self.__name

    @property
    def gender(self):
        """name"""
        return self.__gender

    @property
    def age(self):
        """name"""
        return self.__age

    @property
    def age_start(self):
        """docstring"""
        return self.__age_start

    @property
    def age_end(self):
        """docstring"""
        return self.__age_end

    @property
    def type(self):
        """docstring"""
        return self.__type

    @property
    def fav_os(self):
        """docstring"""
        return self.__os

    @property
    def rating(self):
        """docstring"""
        return self.__rating

    def set_rating(self, rating):
        """docstring"""
        self.__rating = rating

    @property
    def image(self):
        """docstring"""
        return self.__image

    def set_image(self, image):
        """docstring"""
        self.__image = image

    def match(self, per):
        """docstring"""
        if self.sex.find(per.gender) != -1 and per.sex.find(self.gender) != -1:
            rating = 0
            if per.age <= self.age_end and per.age >= self.age_start and \
               self.age <= per.age_end and self.age >= per.age_start:
                rating += 1
            if per.fav_os == self.fav_os:
                rating += 2
            for cha in per.type:
                if self.type.find(cha) != -1:
                    rating += 1
            return rating
        else:
            return False

    @property
    def sex(self):
        """docstring"""
        return self.__sex

    @staticmethod
    def check_blank(name, gender, pos, age, sex, age_start, age_end, ptype):
        """docstring"""
        if not name or not gender or not pos or not age or \
        len(sex) == 0 or not age_start or not age_end or not ptype:
            return False
        else:
            return True
    @staticmethod
    def check_valid(age, age_start, age_end, ptype):
        """docstring"""
        if Person.isvalid_num(age) and Person.isvalid_num(age_start) and \
        Person.isvalid(ptype) and Person.isvalid_num(age_end) and \
        int(age_start) <= int(age_end):
            return True
        else:
            return False
    @staticmethod
    def isvalid_num(num):
        """docstring"""
        if num.isdigit() and int(num) >= 0 and int(num) <= 99:
            return True
        else:
            return False
    @staticmethod
    def isvalid(ptype):
        """docstring"""
        if len(ptype) > 4:
            return False
        if ptype[0] != 'I' and ptype[0] != 'E':
            return False
        if ptype[1] != 'N' and ptype[1] != 'S':
            return False
        if ptype[2] != 'F' and ptype[2] != 'T':
            return False
        if ptype[3] != 'J' and ptype[3] != 'P':
            return False
        return True
    @staticmethod
    def get_list(per):
        """docstring"""
        pth = os.path.dirname(__file__)
        plist = []
        singles = open(os.path.join(pth, 'static/singles.txt'))
        for line in singles.readlines():
            line = line.rstrip().split(',')
            if line[0] == per.name:
                continue
            person = Person(line[0], line[1], int(line[2]), line[3], line[4], \
                line[5], int(line[6]), int(line[7]))
            name_path = line[0].lower().replace(' ', '_')
            person.set_image(os.path.join(pth, \
                'static/images/'+name_path+'.jpg'))
            if per.match(person) and per.match(person) >= 3:
                person.set_rating(per.match(person))
                plist.append(person)
        return plist

class LuvHandler(tornado.web.RequestHandler):
    '''music handlers'''
    def get(self):
        o_name = self.get_argument('old_name', None)
        if not o_name:
            self.render('index.html')
        else:
            pth = os.path.dirname(__file__)
            singles = open(os.path.join(pth, 'static/singles.txt'))
            str_list = []
            for line in singles.readlines():
                line = line.rstrip()
                line = line.split(',')
                if line[0] == o_name:
                    str_list = line
                    break
            if len(str_list) == 0:
                self.render('wrong.html', err='404')
            else:
                per = Person(str_list[0], str_list[1], int(str_list[2]), \
                    str_list[3], str_list[4], str_list[5], int(str_list[6]), \
                    int(str_list[7]))
                self.render('results.html', persons=Person.get_list(per), \
                    ori_name=o_name)

    def post(self):
        name = self.get_argument('name', None)
        gender = self.get_argument('gender', None)
        pos = self.get_argument('os', None)
        age = self.get_argument('age', None)
        sex = self.get_arguments('sex')
        age_start = self.get_argument('age_start', None)
        age_end = self.get_argument('age_end', None)
        ptype = self.get_argument('ptype', None)
        image = self.request.files['image']
        if not Person.check_blank(name, gender, pos, age, sex, \
            age_start, age_end, ptype):
            self.render('wrong.html', err='Lost a value')
        elif not Person.check_valid(age, \
            age_start, age_end, ptype):
            self.render('wrong.html', err='invalid value')
        else:
            per = Person(name, gender, int(age), ptype, pos, sex, \
                int(age_start), int(age_end))
            pth = os.path.dirname(__file__)

            for info in image:
                f_path = os.path.join(pth, 'static/images/' + \
                    name.lower().replace(' ', '_')+'.jpg')
                img = open(f_path, 'wb')
                img.write(info['body'])
                img.close()
                per.set_image(f_path)
            singles = open(os.path.join(pth, 'static/singles.txt'), 'a')
            seq = [per.name, per.gender, str(per.age), per.type, per.fav_os, \
            per.sex, str(per.age_start), str(per.age_end)]
            singles.write(','.join(seq)+'\n')
            singles.close()
            self.render('results.html', persons=Person.get_list(per), ori_name=name)

    def data_received(self, chunk):
        pass



def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers=[(r"/nerdluv", LuvHandler)],
        template_path=os.path.join(pth, "templates"),
        static_path=os.path.join(pth, "static"),
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

