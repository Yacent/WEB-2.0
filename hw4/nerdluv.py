'''Python and tornado'''
import os

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

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
        if len(sex) == 2:
            self.__sex = sex[0].join(sex[1])
        else:
            self.__sex = sex[0]
    
    @property
    def name(self):
        return self.__name

    @property
    def gender(self):
        return self.__gender

    @property
    def age(self):
        return self.__age

    @property
    def age_start(self):
        return self.__age_start

    @property
    def age_end(self):
        return self.__age_end

    @property
    def type(self):
        return self.__type

    @property
    def os(self):
        return self.__os

    @property
    def rating(self):
        return self.__rating

    def set_rating(self, rating):
        self.__rating = rating

    @property
    def image(self):
        return self.__image

    def set_image(self, image):
        self.__image = image

    def match(self, per):
        if per.gender.find(self.sex) != -1 and self.sex.find(per.gender) != -1:
            rating = 0
            if per.age <= self.age_end and per.age >= self.age_start and self.age <= per.age_end and self.age >= per.age_start:
                rating += 1
            if per.os == self.os:
                rating += 2
            for cha in per.type:
                if self.type.find(cha) != -1:
                    rating += 1
            return rating
        else:
            return False

    @property
    def sex(self):
        return self.__sex

class LuvHandler(tornado.web.RequestHandler):
    '''music handlers'''
    def get(self):
        o_name = self.get_argument('old_name', '')
        if o_name == '':
            self.render('index.html')
        else:
            pth = os.path.dirname(__file__)
            singles = open(os.path.join(pth, 'static/singles.txt'))
            str_list = []
            for line in singles.readlines():
                line = line.rstrip()
                line = line.split(',')
                if line[0] == o_name:
                    str_list=line
                    break
            if len(str_list) == 0:
                self.render('wrong.html', err='404')
            else:
                per = Person(str_list[0], str_list[1], int(str_list[2]), str_list[3], str_list[4], str_list[5], int(str_list[6]), int(str_list[7]))
                self.render('results.html', persons=get_list(per))     

    def post(self):
        name = self.get_argument('name', 'none')
        gender = self.get_argument('gender', 'none')
        pos = self.get_argument('os', 'none')
        age = self.get_argument('age', 'none')
        sex = self.get_arguments('sex')
        age_start = self.get_argument('age_start', 'none')
        age_end = self.get_argument('age_end', 'none')
        ptype = self.get_argument('ptype', 'none')
        image = self.request.files['image']
        plist = []
        if not check_blank(name, gender, pos, age, sex, age_start, age_end, ptype):
            self.render('wrong.html', err='Lost a value')
        elif not check_valid(name, gender, pos, age, sex, age_start, age_end, ptype):
            self.render('wrong.html', err='invalid value')
        else:
            per = Person(name, gender, int(age), ptype, pos, sex, int(age_start), int(age_end))
            pth = os.path.dirname(__file__)

            for info in image:
                f_path = os.path.join(pth, 'static/images/'+name.lower().replace(' ', '_')+'.jpg')
                img = open(f_path, 'wb')
                img.write(info['body'])
                img.close()
                per.set_image(f_path)
            singles = open(os.path.join(pth, 'static/singles.txt'), 'a')
            seq = (per.name, per.gender, str(per.age), per.type, per.os, per.sex, str(per.age_start), str(per.age_end))
            singles.write(spe.join(',')+'\n')
            singles.close()
            self.render('results.html', persons=get_list(per))

    def data_received(self, chunk):
        pass

def check_blank(name, gender, pos, age, sex, age_start, age_end, ptype):
    if name=='none' or gender=='none' or pos=='none' or age=='none' or len(sex)==0 or age_start=='none' or ptype=='none':
        return False
    else:
        return True

def check_valid(name, gender, pos, age, sex, age_start, age_end, ptype):
    if isvalid_num(age) and isvalid_num(age_start) and isvalid(ptype) and \
    isvalid_num(age_end) and int(age_start)<=int(age_end):
        return True
    else:
        return False

def isvalid_num(num):
    if num.isdigit() and int(num) >= 0 and int(num) <= 99:
        return True
    else:
        return False

def isvalid(ptype):
    if ptype[0] != 'I' and ptype[0] != 'E':
        return False
    if ptype[1] != 'N' and ptype[1] != 'S':
        return False
    if ptype[2] != 'F' and ptype[2] != 'T':
        return False
    if ptype[3] != 'J' and ptype[3] != 'P':
        return False
    return True

def get_list(per):
    pth = os.path.dirname(__file__)
    plist=[]
    singles = open(os.path.join(pth, 'static/singles.txt'))
    for line in singles.readlines():
        line = line.rstrip()
        line = line.split(',')
        if line[0] == per.name:
            continue
        person = Person(line[0], line[1], int(line[2]), line[3], line[4], line[5], int(line[6]), int(line[7]))
        name_path = line[0].lower().replace(' ', '_')
        person.set_image(os.path.join(pth, 'static/images/'+name_path+'.jpg'))
        if per.match(person) and per.match(person) >= 3:
            person.set_rating(per.match(person))
            plist.append(person)
    return plist

def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers=[(r"/nurdluv", LuvHandler)],
        template_path=os.path.join(pth, "templates"),
        static_path=os.path.join(pth, "static"),
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()

