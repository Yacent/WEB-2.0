#-*-coding: utf-8 -*-
import re
import functools

from tornado import httpclient
from tornado import escape
from tornado.httputil import url_concat
from tornado.concurrent import Future
from tornado.auth import OAuth2Mixin, _auth_return_future, AuthError
from tornado import gen

import urllib as urllib_parse

class QQMixin(OAuth2Mixin):
    _OAUTH_ACCESS_TOKEN_URL = "https://graph.qq.com/oauth2.0/token?"
    _OAUTH_AUTHORIZE_URL = "https://graph.qq.com/oauth2.0/authorize?"
    _OAUTH_NO_CALLBACKS = False
    _QQ_BASE_URL = "https://graph.qq.com"

    def authorize_redirect(self, redirect_uri=None, client_id=None,
                           client_secret=None, extra_params=None):
        args = {
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type" : "code",
            "state": "authorize",
        }
        if extra_params:
            args.update(extra_params)
        self.redirect(url_concat(self._OAUTH_AUTHORIZE_URL, args))

    @_auth_return_future
    def get_authenticated_user(self, redirect_uri, client_id, client_secret,
                               code, callback, extra_fields=None):
        http = self.get_auth_http_client()
        args = {
            "redirect_uri": redirect_uri,
            "code": code,
            "client_id": client_id,
            "client_secret": client_secret,
            "extra_params":{"grant_type": "authorization_code"}
        }
        http.fetch(self._oauth_request_token_url(**args),
                   functools.partial(self._on_access_token, redirect_uri, client_id,
                                       client_secret, callback))

    def _on_access_token(self, redirect_uri, client_id, client_secret,
                         callback, response):
        http = self.get_auth_http_client()
        if response.error:
            future.set_exception(AuthError('QQaccesstoken  auth error: %s' % str(response)))
            return

        args = escape.parse_qs_bytes(escape.native_str(response.body))
        session = {
            "access_token": args["access_token"][-1],
            "expires": args.get("expires_in"),
        }
        http.fetch(url_concat('https://graph.qq.com/oauth2.0/me?',{'access_token':session['access_token']}),
                   functools.partial(self._on_open_id, redirect_uri, client_id,
                                       client_secret, session, callback))

    def _on_open_id(self, redirect_uri, client_id, client_secret, session, future, response):
        if response.error:
            future.set_exception(AuthError('QQopenid auth error: %s' % str(response)))
            return
        res = re.search(r'"openid":"([a-zA-Z0-9]+)"', escape.native_str(response.body))
        session['openid']=res.group(1)
        session['client_id']=client_id
        self.qq_request(
            path="/user/get_user_info",
            callback=functools.partial(
                self._on_get_user_info, future, session),
            access_token=session["access_token"],
            open_id=session["openid"],
            client_id=session["client_id"]
        )
    def _on_get_user_info(self, future, session, user):
        if user is None:
            future.set_result(None)
            return
        user = escape.json_decode(user)
        future.set_result(user)

    @_auth_return_future
    def qq_request(self, path, callback, access_token=None,
                         post_args=None, open_id=None, client_id=None, **args):
        url = self._QQ_BASE_URL + path
        all_args = {}
        if access_token:
            all_args["access_token"] = access_token
            all_args["openid"] = open_id
            all_args["oauth_consumer_key"] = client_id
            all_args.update(args)

        if all_args:
            url += "?" + urllib_parse.urlencode(all_args)
        callback = functools.partial(self._on_qq_request, callback)
        http = self.get_auth_http_client()
        if post_args is not None:
            http.fetch(url, method="POST", body=urllib_parse.urlencode(post_args),
                       callback=callback)
        else:
            http.fetch(url, callback=callback)

    def _on_qq_request(self, future, response):
        if response.error:
            future.set_exception(AuthError("Error response %s fetching %s" %
                                           (response.error, response.request.url)))
            return

        future.set_result(escape.native_str(response.body))

    def get_auth_http_client(self):
        return httpclient.AsyncHTTPClient()
