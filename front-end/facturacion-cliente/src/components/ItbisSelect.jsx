import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/ui/select";
import { Label } from "../components/ui/label";

const ItbisSelect = ({ value, onChange, label = "ITBIS", className = "" }) => {
  const itbisOptions = [
    { value: 0, label: '0% - Exento', percentage: 0 },
    { value: 0.16, label: '16% - ITBIS Estándar', percentage: 16 },
    { value: 0.18, label: '18% - ITBIS República Dominicana', percentage: 18 },
    { value: 0.20, label: '20% - ITBIS Alto', percentage: 20 },
    { value: 0.25, label: '25% - ITBIS Premium', percentage: 25 }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="itbis" className="text-sm font-medium text-gray-700">
        {label}
      </Label>
      <Select 
        value={value?.toString() || '0.18'} 
        onValueChange={(value) => onChange(parseFloat(value))}
      >
        <SelectTrigger className="bg-white border divider-border hover:bg-gray-50">
          <SelectValue placeholder="Seleccionar ITBIS" />
        </SelectTrigger>
        <SelectContent className="bg-white border divider-border shadow-lg">
          {itbisOptions.map((option) => (
            <SelectItem 
              key={option.value.toString()} 
              value={option.value.toString()}
              className="hover:bg-gray-50"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ItbisSelect;
