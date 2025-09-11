import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

const CustomSelect = ({
  id,
  label,
  value,
  onValueChange,
  options = [],
  placeholder = "Seleccionar...",
  disabled = false,
  required = false,
  valueKey = "value",
  labelKey = "label",
  isEditing = true
}) => {
  const selectTriggerClassName = isEditing 
    ? "bg-white border divider-border hover:bg-gray-50" 
    : "bg-gray-50 text-gray-700";

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </Label>
      <Select 
        value={value || ''} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={selectTriggerClassName}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-white border divider-border shadow-lg">
          {options.map((option) => (
            <SelectItem 
              key={option[valueKey]} 
              value={option[valueKey].toString()}
              className="hover:bg-gray-50"
            >
              {option[labelKey]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
