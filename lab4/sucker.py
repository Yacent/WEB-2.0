'''Python and tornado'''
import os
import re
import math

import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web

class FormHandler(tornado.web.RequestHandler):
    '''handler the form data'''
    def get(self):
        self.render('buyagrade.html')

    def post(self):
        name = self.get_argument('name', '')
        section = self.get_argument('section', '')
        card = self.get_argument('card', '')
        card_type = self.get_argument('card_type', '')

        if not self.__isfill__(name, section, card, card_type):
            self.render('sorry.html',\
                str="You didn't fill out the form completely.")
        elif not self.__isvalid__(card, card_type):
            self.render('sorry.html',\
                str="You didn't provide a valid card number.")
        else:
            pth = os.path.dirname(__name__)
            
            txt = open(os.path.join(pth, 'suckers.txt'), 'a')
            txt.write(name+';'+section+';'+\
                self.__isvalid__(card, card_type)+';'+card_type)
            txt.write('\n')
            txt.close()
            
            txt = open(os.path.join(pth, 'suckers.txt'))
            text = ''
            for line in txt.readlines():
                text += line
            
            self.render('info.html', n=name, s=section,\
                c=card, ct=card_type, txt=text)

    def __isfill__(self, name, section, card, card_type):
        if name != '' and section != '' and card != '' and card_type != '':
            return True
        else:
            return False

    def __isvalid__(self, card, card_type):
        visa_patt = r'^4\d{3}(-?\d{4}){3}$'
        master_patt = r'^5\d{3}(-?\d{4}){3}$'
        
        if card_type == 'visa':
            res = re.match(visa_patt, card)
        else:
            res = re.match(master_patt, card)
        
        if not res:
            return False
        else:
            result = res.group(0).replace('-', '')
            if self.__luhn__(result):
                return result
            else:
                return False

    def __luhn__(self, result):
        index = len(result)-1
        summ = 0
        
        while index >= 0:
            if index%2 != 0:
                summ += int(result[index])
            else:
                temp = 2*int(result[index])
                if temp < 10:
                    summ += temp
                else:
                    first = math.floor(temp/10)
                    second = temp%10
                    summ += first + second
            index -= 1
        
        if summ%10 == 0:
            return True
        else:
            return False

    def data_received(self, chunk):
        pass

def main():
    '''main'''
    tornado.options.parse_command_line()
    pth = os.path.dirname(__file__)
    app = tornado.web.Application(
        handlers=[(r"/form", FormHandler)],
        template_path=os.path.join(pth, "templates"),
        static_path=os.path.join(pth, "static"),
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    
    http_server.listen(8888)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == '__main__':
    main()
