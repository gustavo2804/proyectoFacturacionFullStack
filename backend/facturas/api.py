from .models import Factura, DetalleFactura, Cotizacion, DetalleCotizacion
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import FacturaSerializer, DetalleFacturaSerializer, CotizacionSerializer, DetalleCotizacionSerializer

class FacturaViewSet(viewsets.ModelViewSet):
    queryset=Factura.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = FacturaSerializer

class DetalleFacturaViewSet(viewsets.ModelViewSet):
    queryset=DetalleFactura.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DetalleFacturaSerializer

    def get_queryset(self):
        queryset = DetalleFactura.objects.all()
        factura_id = self.request.query_params.get('factura')
        if factura_id:
            queryset = queryset.filter(factura_id=factura_id)
        return queryset

    @action(detail=False, methods=['get'])
    def by_factura(self, request):
        factura_id = request.query_params.get('factura')
        if factura_id:
            detalles = DetalleFactura.objects.filter(factura_id=factura_id)
            serializer = self.get_serializer(detalles, many=True)
            return Response(serializer.data)
        return Response([])

class CotizacionViewSet(viewsets.ModelViewSet):
    queryset=Cotizacion.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CotizacionSerializer

class DetalleCotizacionViewSet(viewsets.ModelViewSet):
    queryset=DetalleCotizacion.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = DetalleCotizacionSerializer

    def get_queryset(self):
        queryset = DetalleCotizacion.objects.all()
        cotizacion_id = self.request.query_params.get('cotizacion')
        if cotizacion_id:
            queryset = queryset.filter(cotizacion_id=cotizacion_id)
        return queryset

    @action(detail=False, methods=['get'])
    def by_cotizacion(self, request):
        cotizacion_id = request.query_params.get('cotizacion')
        if cotizacion_id:
            detalles = DetalleCotizacion.objects.filter(cotizacion_id=cotizacion_id)
            serializer = self.get_serializer(detalles, many=True)
            return Response(serializer.data)
        return Response([])



    