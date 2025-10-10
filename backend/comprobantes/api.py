from .models import TipoComprobante, Comprobante, SerieComprobante
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .serializers import TipoComprobanteSerializer, ComprobanteSerializer, SerieComprobanteSerializer

class TipoComprobanteViewSet(viewsets.ModelViewSet):
    queryset = TipoComprobante.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = TipoComprobanteSerializer

class ComprobanteViewSet(viewsets.ModelViewSet):
    queryset=Comprobante.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ComprobanteSerializer

    @action(detail=False, methods=['get'])
    def disponibles(self, request):
        """Obtener comprobantes disponibles para un tipo de comprobante"""
        tipo_comprobante_id = request.query_params.get('tipo_comprobante')
        
        if not tipo_comprobante_id:
            return Response(
                {'error': 'tipo_comprobante es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            comprobantes_disponibles = Comprobante.objects.filter(
                tipo_comprobante_id=tipo_comprobante_id,
                cliente__isnull=True,
                factura_asignada__isnull=True
            ).order_by('numero_comprobante')
            
            serializer = self.get_serializer(comprobantes_disponibles, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class SerieComprobanteViewSet(viewsets.ModelViewSet):
    queryset=SerieComprobante.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SerieComprobanteSerializer
    
    @action(detail=True, methods=['post'])
    def anular(self, request, pk=None):
        """Anular una serie de comprobante y todos sus comprobantes no asignados"""
        try:
            serie = self.get_object()
            
            # Verificar si ya está anulada
            if serie.anulado:
                return Response(
                    {'error': 'Esta serie ya está anulada'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            with transaction.atomic():
                # Anular la serie
                serie.anulado = True
                serie.save()
                
                # Anular todos los comprobantes no asignados de esta serie
                comprobantes_a_anular = Comprobante.objects.filter(
                    tipo_comprobante=serie.tipo_comprobante,
                    numero_comprobante__gte=serie.desde if serie.desde else 0,
                    numero_comprobante__lte=serie.hasta if serie.hasta else 0,
                    cliente__isnull=True,
                    factura_asignada__isnull=True,
                    anulado=False
                )
                
                cantidad_anulados = comprobantes_a_anular.count()
                comprobantes_a_anular.update(anulado=True)
            
            return Response({
                'message': 'Serie anulada exitosamente',
                'comprobantes_anulados': cantidad_anulados
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def alertas(self, request):
        """Obtener series de comprobante que están por agotarse o agotadas"""
        limite = int(request.query_params.get('limite', 5))
        
        try:
            # Obtener series que están por agotarse (excluyendo anuladas)
            series_por_agotarse = SerieComprobante.objects.filter(
                desde__isnull=False,
                hasta__isnull=False,
                anulado=False
            ).exclude(desde__isnull=True, hasta__isnull=True)
            
            alertas = []
            for serie in series_por_agotarse:
                restantes = serie.comprobantes_restantes()
                if restantes <= limite:
                    alertas.append({
                        'id': serie.id,
                        'tipo_comprobante': serie.tipo_comprobante.tipo_comprobante,
                        'desde': serie.desde,
                        'hasta': serie.hasta,
                        'numero_actual': serie.numero_actual,
                        'comprobantes_restantes': restantes,
                        'esta_agotado': serie.esta_agotado(),
                        'esta_por_agotarse': serie.esta_por_agotarse(limite),
                        'fecha_vencimiento': serie.fecha_vencimiento
                    })
            
            return Response(alertas)
            
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
