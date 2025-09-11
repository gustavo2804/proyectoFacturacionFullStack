from rest_framework import routers
from .api import TipoComprobanteViewSet, ComprobanteViewSet, SerieComprobanteViewSet

router = routers.DefaultRouter()

router.register('api/comprobantes', ComprobanteViewSet, 'comprobantes')
router.register('api/seriecomprobantes', SerieComprobanteViewSet, 'seriecomprobantes')
router.register('api/tipocomprobantes', TipoComprobanteViewSet, 'tipocomprobantes')

urlpatterns = router.urls

