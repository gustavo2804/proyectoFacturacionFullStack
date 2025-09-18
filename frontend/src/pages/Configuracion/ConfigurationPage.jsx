import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { empresaConfig } from '../../config/empresaConfig'
import { Upload, Save, X, Building2 } from 'lucide-react'
import Toast from '../../components/ui/toast'

const ConfigurationPage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    rnc: '',
    logo: null
  })
  const [logoPreview, setLogoPreview] = useState(null)
  const [toast, setToast] = useState({ isVisible: false, type: 'success', message: '' })

  useEffect(() => {
    // Load company data from config
    setFormData({
      nombre: empresaConfig.nombre,
      rnc: empresaConfig.rnc,
      logo: null
    })
  }, [])

  const showToast = (type, message) => {
    setToast({ isVisible: true, type, message })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('error', 'Por favor selecciona un archivo de imagen válido')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'El archivo es demasiado grande. Máximo 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        logo: file
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Here you would typically save to backend or localStorage
    // For now, we'll just show a success message
    console.log('Saving company data:', formData)
    showToast('success', 'Información de la empresa guardada exitosamente')
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      nombre: empresaConfig.nombre,
      rnc: empresaConfig.rnc,
      logo: null
    })
    setLogoPreview(null)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  return (
    <div className="w-full px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">Gestiona la información de tu empresa</p>
        </div>

        <Card className="bg-white border rounded-xl divider-border shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-emerald-600" />
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Información de la Empresa</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Configura los datos básicos de tu empresa
                  </p>
                </div>
              </div>
              {!isEditing && (
                <Button 
                  onClick={handleEdit} 
                  className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  size="sm"
                >
                  Editar
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0 space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium">
                Nombre de la Empresa
              </Label>
              {isEditing ? (
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingresa el nombre de tu empresa"
                  className="w-full h-8 sm:h-9 pl-3 pr-4 text-xs sm:text-sm border divider-border rounded-md focus:outline-none focus:!ring-emerald-500 focus:border-transparent bg-white text-slate-700 placeholder:text-slate-500 hover:bg-slate-50 transition-colors"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border divider-border">
                  <span className="text-sm text-gray-700">{formData.nombre}</span>
                </div>
              )}
            </div>

            {/* RNC Number */}
            <div className="space-y-2">
              <Label htmlFor="rnc" className="text-sm font-medium">
                Número de RNC
              </Label>
              {isEditing ? (
                <Input
                  id="rnc"
                  name="rnc"
                  value={formData.rnc}
                  onChange={handleInputChange}
                  placeholder="Ej: 131-12345-6"
                  className="w-full h-8 sm:h-9 pl-3 pr-4 text-xs sm:text-sm border divider-border rounded-md focus:outline-none focus:!ring-emerald-500 focus:border-transparent bg-white text-slate-700 placeholder:text-slate-500 hover:bg-slate-50 transition-colors"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border divider-border">
                  <span className="text-sm text-gray-700">{formData.rnc}</span>
                </div>
              )}
            </div>

            {/* Logo Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Logo de la Empresa
              </Label>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="logo"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Label
                        htmlFor="logo"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-emerald-500 rounded-md bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Subir Logo
                      </Label>
                    </div>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
                    </span>
                  </div>
                  
                  {(logoPreview || empresaConfig.logo) && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
                      <div className="inline-block p-4 border divider-border rounded-lg bg-white">
                        <img
                          src={logoPreview || empresaConfig.logo}
                          alt="Logo preview"
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-md border divider-border">
                  {empresaConfig.logo ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={empresaConfig.logo}
                        alt="Logo de la empresa"
                        className="h-12 w-auto object-contain"
                      />
                      <span className="text-sm text-gray-700">Logo actual</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">No hay logo configurado</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          {isEditing && (
            <CardFooter className="flex justify-end gap-3 pt-6 border-t divider-border">
              <Button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors"
                size="sm"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="flex items-center gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                <Save className="h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Toast notifications */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  )
}

export default ConfigurationPage
