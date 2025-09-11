import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import ConfirmationDialog from "@/components/ui/confirmation-dialog"
import { MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Eye, Edit, Trash2 } from "lucide-react"

export default function AdvancedTable({ 
  data, 
  columns, 
  title = "Datos", 
  onDelete,
  onAdd,
  onEdit,
  onView,
  enableActions = true,
  enableAdd = false,
  enableEdit = true,
  enableView = true,
  enableDelete = true,
  addButtonText = "Nuevo",
  searchPlaceholder = "Buscar...",
  confirmDeleteMessage = "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
}) {
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterText, setFilterText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  )
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, rowId: null, rowData: null })

  // Filtrar datos por texto
  const filteredData = data.filter(row => {
    if (filterText === "") return true
    return Object.values(row).some(value =>
      value && value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  })

  // Filtrar columnas visibles
  const activeColumns = columns.filter(col => visibleColumns[col.key])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(new Set(currentData.map(row => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (rowId, checked) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }
    setSelectedRows(newSelected)
  }

  const toggleColumnVisibility = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }

  // Manejar acciones de fila
  const handleViewDetails = (rowId) => {
    if (onView) {
      onView(rowId);
    }
  }

  const handleQuickEdit = (rowId) => {
    if (onEdit) {
      onEdit(rowId);
    }
  }

  const handleDelete = (rowId, rowData) => {
    if (onDelete) {
      setConfirmDialog({
        isOpen: true,
        rowId: rowId,
        rowData: rowData
      });
    }
  }

  const confirmDelete = () => {
    if (onDelete && confirmDialog.rowId) {
      onDelete(confirmDialog.rowId);
      setConfirmDialog({ isOpen: false, rowId: null, rowData: null });
    }
  }

  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, rowId: null, rowData: null });
  }

  const handleAdd = () => {
    if (onAdd) {
      onAdd();
    }
  }

  const isAllSelected = currentData.length > 0 && currentData.every(row => selectedRows.has(row.id))
  const isIndeterminate = currentData.some(row => selectedRows.has(row.id)) && !isAllSelected

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-white border rounded-xl divider-border shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            
            <div className="flex items-center gap-4">
              {/* Botón de agregar */}
              {enableAdd && (
                <Button
                  onClick={handleAdd}
                  className="gap-2 rounded-md border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                >
                  {addButtonText}
                </Button>
              )}

              {/* Input de búsqueda */}
              <div className="relative [&>input:focus]:ring-2 [&>input:focus]:ring-emerald-500">
                <Input
                  placeholder={searchPlaceholder}
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-80 h-8 sm:h-9 pl-3 pr-4 text-xs sm:text-sm border divider-border rounded-md focus:outline-none focus:!ring-emerald-500 focus:border-transparent bg-white text-slate-700 placeholder:text-slate-500 hover:bg-slate-50 transition-colors"
                />
              </div>

              {/* Selector de columnas */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="gap-2 rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors"
                  >
                    Columns
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border divider-border shadow-lg">
                  {columns.map((column, index) => (
                    <div key={column.key}>
                      <DropdownMenuCheckboxItem
                        className="capitalize hover:bg-gray-50 focus:bg-gray-50"
                        checked={visibleColumns[column.key]}
                        onCheckedChange={() => toggleColumnVisibility(column.key)}
                      >
                        {column.label}
                      </DropdownMenuCheckboxItem>
                      {index < columns.length - 1 && <DropdownMenuSeparator />}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <div className="bg-white overflow-x-auto">
            <Table className="min-w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 border-b-2 divider-border">
                  <TableHead className="w-12 px-6">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className="translate-y-[2px]"
                    />
                  </TableHead>
                  {activeColumns.map((column) => (
                    <TableHead 
                      key={column.key} 
                      className="font-semibold text-gray-900 px-6 text-left"
                      style={{ width: column.width || 'auto', maxWidth: column.maxWidth || '200px' }}
                    >
                      {column.label}
                    </TableHead>
                  ))}
                  {enableActions && <TableHead className="w-12 px-6"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {currentData.map((row, index) => (
                  <TableRow 
                    key={row.id}
                    className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors border-b divider-border ${selectedRows.has(row.id) ? 'bg-sidebar-accent/20' : ''}`}
                  >
                    <TableCell className="px-6">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                        aria-label={`Select row ${index + 1}`}
                        className="translate-y-[2px]"
                      />
                    </TableCell>
                    {activeColumns.map((column) => (
                      <TableCell 
                        key={column.key} 
                        className="py-4 px-6 text-left"
                        style={{ width: column.width || 'auto', maxWidth: column.maxWidth || '200px' }}
                      >
                        <span 
                          className="text-sm text-gray-700 block truncate" 
                          title={row[column.key]}
                        >
                          {row[column.key]}
                        </span>
                      </TableCell>
                    ))}
                    {enableActions && (
                      <TableCell className="px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border divider-border shadow-lg">
                            {enableView && onView && (
                              <>
                                <DropdownMenuItem 
                                  className="hover:bg-gray-50 focus:bg-gray-50"
                                  onClick={() => handleViewDetails(row.id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {enableEdit && onEdit && (
                              <>
                                <DropdownMenuItem 
                                  className="hover:bg-gray-50 focus:bg-gray-50"
                                  onClick={() => handleQuickEdit(row.id)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {enableDelete && onDelete && (
                              <DropdownMenuItem 
                                className="text-red-600 hover:bg-red-50 focus:bg-red-50 hover:text-red-700 focus:text-red-700"
                                onClick={() => handleDelete(row.id, row)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Footer con paginación */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground text-left">
              {selectedRows.size} of {filteredData.length} row(s) selected.
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${rowsPerPage}`}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value))
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px] rounded-md border-emerald-500 bg-white text-slate-700 hover:bg-emerald-500 hover:text-white transition-colors">
                    <SelectValue placeholder={rowsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top" className="bg-white border divider-border shadow-lg">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-gray-50 focus:bg-gray-50">
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage <= 1}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage <= 1}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                  disabled={currentPage >= totalPages}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={confirmDeleteMessage}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
