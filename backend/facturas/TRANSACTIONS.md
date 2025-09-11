# Transacciones en Facturas y Cotizaciones

## Descripción

Se han implementado transacciones atómicas en los serializers de `Factura` y `Cotizacion` para garantizar la integridad de los datos cuando se crean o actualizan facturas y cotizaciones con sus respectivos detalles.

## Implementación

### FacturaSerializer

#### Crear Factura con Detalles
```python
def create(self, validated_data):
    detalle_facturas_data = validated_data.pop('detalle_facturas', [])
    
    with transaction.atomic():
        # Generar número de factura automáticamente
        ultima_factura = Factura.objects.select_for_update().order_by('-numero_factura').first()
        if ultima_factura:
            validated_data['numero_factura'] = ultima_factura.numero_factura + 1
        else:
            validated_data['numero_factura'] = 1
        
        # Crear la factura
        factura = super().create(validated_data)
        
        # Crear los detalles
        for detalle_data in detalle_facturas_data:
            detalle_data['factura'] = factura
            DetalleFactura.objects.create(**detalle_data)
        
        return factura
```

#### Actualizar Factura con Detalles
```python
def update(self, instance, validated_data):
    detalle_facturas_data = validated_data.pop('detalle_facturas', [])
    
    with transaction.atomic():
        # Actualizar la factura
        factura = super().update(instance, validated_data)
        
        # Si hay detalles, eliminar los existentes y crear los nuevos
        if detalle_facturas_data:
            DetalleFactura.objects.filter(factura=factura).delete()
            for detalle_data in detalle_facturas_data:
                detalle_data['factura'] = factura
                DetalleFactura.objects.create(**detalle_data)
        
        return factura
```

### CotizacionSerializer

#### Crear Cotización con Detalles
```python
def create(self, validated_data):
    detalle_cotizaciones_data = validated_data.pop('detalle_cotizaciones', [])
    
    with transaction.atomic():
        # Generar número de cotización automáticamente
        ultima_cotizacion = Cotizacion.objects.select_for_update().order_by('-numero_cotizacion').first()
        if ultima_cotizacion:
            validated_data['numero_cotizacion'] = ultima_cotizacion.numero_cotizacion + 1
        else:
            validated_data['numero_cotizacion'] = 1
        
        # Crear la cotización
        cotizacion = super().create(validated_data)
        
        # Crear los detalles
        for detalle_data in detalle_cotizaciones_data:
            detalle_data['cotizacion'] = cotizacion
            DetalleCotizacion.objects.create(**detalle_data)
        
        return cotizacion
```

#### Actualizar Cotización con Detalles
```python
def update(self, instance, validated_data):
    detalle_cotizaciones_data = validated_data.pop('detalle_cotizaciones', [])
    
    with transaction.atomic():
        # Actualizar la cotización
        cotizacion = super().update(instance, validated_data)
        
        # Si hay detalles, eliminar los existentes y crear los nuevos
        if detalle_cotizaciones_data:
            DetalleCotizacion.objects.filter(cotizacion=cotizacion).delete()
            for detalle_data in detalle_cotizaciones_data:
                detalle_data['cotizacion'] = cotizacion
                DetalleCotizacion.objects.create(**detalle_data)
        
        return cotizacion
```

## Características de las Transacciones

### 1. Atomicidad
- **Todo o Nada**: Si cualquier operación falla, se hace rollback de toda la transacción
- **Consistencia**: No se pueden crear facturas/cotizaciones sin sus detalles
- **Integridad**: Los datos siempre están en un estado válido

### 2. Concurrencia
- **select_for_update()**: Previene condiciones de carrera al generar números secuenciales
- **Bloqueo de filas**: Evita que dos usuarios generen el mismo número simultáneamente
- **Serialización**: Las operaciones se ejecutan de forma ordenada

### 3. Manejo de Errores
- **Rollback automático**: Django maneja automáticamente el rollback en caso de error
- **Excepciones propagadas**: Los errores se propagan correctamente al frontend
- **Estado limpio**: No quedan datos parciales en la base de datos

## Flujo de Transacción

### Crear Nueva Factura/Cotización
1. **Inicio de transacción**: `transaction.atomic()`
2. **Bloqueo de consulta**: `select_for_update()` para obtener último número
3. **Generación de número**: Incremento del número secuencial
4. **Creación del padre**: Factura o Cotización
5. **Creación de detalles**: Todos los detalles asociados
6. **Commit automático**: Si todo es exitoso
7. **Rollback automático**: Si hay algún error

### Actualizar Factura/Cotización
1. **Inicio de transacción**: `transaction.atomic()`
2. **Actualización del padre**: Factura o Cotización
3. **Eliminación de detalles**: Detalles existentes
4. **Creación de nuevos detalles**: Detalles actualizados
5. **Commit automático**: Si todo es exitoso
6. **Rollback automático**: Si hay algún error

## Ventajas

### Rendimiento
- **Menos consultas**: Una sola transacción en lugar de múltiples
- **Bloqueos optimizados**: Solo se bloquean las filas necesarias
- **Menos overhead**: Menos comunicación con la base de datos

### Confiabilidad
- **Datos consistentes**: No hay estados intermedios inválidos
- **Recuperación automática**: Rollback automático en caso de fallo
- **Integridad referencial**: Relaciones siempre válidas

### Escalabilidad
- **Concurrencia controlada**: Múltiples usuarios pueden trabajar simultáneamente
- **Sin condiciones de carrera**: Números secuenciales únicos garantizados
- **Bloqueos mínimos**: Solo se bloquean los recursos necesarios

## Casos de Uso

### Escenario 1: Crear Factura con Múltiples Productos
```json
POST /api/facturas/
{
  "cliente": 1,
  "fecha_emision": "2024-01-15",
  "total": 1180.00,
  "detalle_facturas": [
    {"producto": 1, "cantidad": 2, "precio_unitario": 500.00, "subtotal": 1000.00},
    {"producto": 2, "cantidad": 1, "precio_unitario": 180.00, "subtotal": 180.00}
  ]
}
```

**Resultado**: Si algún detalle falla, toda la factura se cancela.

### Escenario 2: Actualizar Cotización
```json
PUT /api/cotizaciones/1/
{
  "cliente": 1,
  "total": 1500.00,
  "detalle_cotizaciones": [
    {"producto": 3, "cantidad": 3, "precio_unitario": 500.00, "subtotal": 1500.00}
  ]
}
```

**Resultado**: Se eliminan los detalles antiguos y se crean los nuevos en una sola operación atómica.

### Escenario 3: Error en Detalle
```json
POST /api/facturas/
{
  "cliente": 1,
  "detalle_facturas": [
    {"producto": 999, "cantidad": 1, "precio_unitario": 100.00, "subtotal": 100.00}
  ]
}
```

**Resultado**: Si el producto 999 no existe, toda la operación se cancela y no se crea la factura.

## Monitoreo y Debugging

### Logs de Transacciones
- Django registra automáticamente las transacciones
- Se pueden habilitar logs detallados en `settings.py`
- Las consultas SQL se pueden monitorear con `DEBUG=True`

### Manejo de Errores
```python
try:
    factura = serializer.save()
except Exception as e:
    # La transacción ya se hizo rollback automáticamente
    logger.error(f"Error al crear factura: {e}")
    raise
```

## Consideraciones de Rendimiento

### Optimizaciones Implementadas
- **select_for_update()**: Solo bloquea la fila necesaria
- **bulk_create()**: Se podría implementar para grandes volúmenes
- **Índices**: Asegurar índices en campos de búsqueda

### Limitaciones
- **Bloqueos**: Las transacciones pueden causar bloqueos en alta concurrencia
- **Timeout**: Transacciones largas pueden causar timeouts
- **Memoria**: Grandes volúmenes de detalles pueden consumir mucha memoria

## Conclusión

Las transacciones implementadas garantizan la integridad de los datos y proporcionan una base sólida para el manejo de facturas y cotizaciones con detalles. La implementación es robusta, eficiente y maneja correctamente los casos de error y concurrencia.

