from threading import local

_user = local()


class CurrentUserMiddleware:
    """Middleware para almacenar el usuario actual en threading local"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        _user.value = getattr(request, 'user', None)
        response = self.get_response(request)
        return response


def get_current_user():
    """Obtiene el usuario actual del contexto"""
    return getattr(_user, 'value', None)

