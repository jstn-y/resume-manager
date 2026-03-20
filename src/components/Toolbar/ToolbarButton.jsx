export default function ToolbarButton({ onClick, title, active, children }) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer transition-colors
                ${active
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
        >
            {children}
        </button>
    );
}
