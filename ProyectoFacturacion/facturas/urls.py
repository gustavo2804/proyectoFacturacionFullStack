from rest_framework import routers
from .api import FacturaViewSet, DetalleFacturaViewSet, CotizacionViewSet, DetalleCotizacionViewSet

router = routers.DefaultRouter()

router.register('api/facturas', FacturaViewSet, 'facturas')
router.register('api/detalle-facturas', DetalleFacturaViewSet, 'detalle-facturas')
router.register('api/cotizaciones', CotizacionViewSet, 'cotizaciones')
router.register('api/detalle-cotizaciones', DetalleCotizacionViewSet, 'detalle-cotizaciones')

urlpatterns = router.urls

