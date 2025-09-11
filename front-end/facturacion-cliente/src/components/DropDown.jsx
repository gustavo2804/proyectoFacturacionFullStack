import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
const DropDown = ({children, items}) => {
    const navigator = useNavigate();
    const handleClick = (item) => {
        console.log('Navegando a:', item.href);
        navigator(item.href);
    }

    if (!items || items.length === 0) {
        return children;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="relative group">
                    {children}
                    <svg 
                        className="w-4 h-4 ml-1 text-gray-500 group-hover:text-gray-700 transition-colors duration-200 inline-block" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-2 mt-2" 
                align="start"
                sideOffset={8}
            >
                <DropdownMenuGroup>
                {items.map((item, index) => (
                    <DropdownMenuItem 
                        key={item.name} 
                        onClick={() => handleClick(item)}
                        className={`
                            cursor-pointer 
                            px-4 py-3 
                            rounded-md 
                            text-gray-700 
                            hover:bg-gray-100 
                            hover:text-gray-900 
                            focus:bg-gray-100 
                            focus:text-gray-900 
                            transition-all 
                            duration-200 
                            text-sm
                            font-medium
                            ${index !== items.length - 1 ? 'mb-1' : ''}
                        `}
                    >
                        <span className="flex items-center">
                            <svg 
                                className="w-4 h-4 mr-3 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {item.name}
                        </span>
                    </DropdownMenuItem>
                ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { DropDown };