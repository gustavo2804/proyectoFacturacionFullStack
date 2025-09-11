export default function SliderItem({ label, isActive, redirect, onClick }) {
    return (
        <div>
            <button
                onClick={onClick}
                className={`px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0 cursor-pointer z-10 ${
                    isActive
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-600 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
            >
                {label}
            </button>
        </div>
    )
}