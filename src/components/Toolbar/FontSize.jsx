import { useState, useRef, useEffect } from "react";

const PRESET_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36];

export default function FontSize({ quillRef }) {
    const [size, setSize] = useState(12);
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const applySize = (newSize) => {
        const clamped = Math.min(96, Math.max(1, newSize));
        setSize(clamped);
        setOpen(false);
        const range = quillRef.current?.getSelection();
        if (range) {
            quillRef.current.format('size', `${clamped}pt`);
        }
    };

    const handleInputChange = (e) => {
        setSize(e.target.value);
    };

    const handleInputCommit = (e) => {
        const parsed = parseInt(size);
        if (!isNaN(parsed)) applySize(parsed);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleInputCommit(e);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative flex items-center self-center">
            <button 
                onClick={() => applySize(parseInt(size) - 1)} 
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-base leading-none"
            >
                <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                    <rect x="0" y="0" width="10" height="2" rx="1" fill="currentColor" />
                </svg>

            </button>

            <input
                type="text"
                value={size}
                onChange={handleInputChange}
                onBlur={handleInputCommit}
                onKeyDown={handleKeyDown}
                onClick={() => setOpen(!open)}
                className="w-9 text-center text-sm border border-gray-200 rounded mx-0.5 py-0.5 cursor-pointer focus:outline-none focus:outline-none focus:border-blue-400"
            />

            <button 
                onClick={() => applySize(parseInt(size) + 1)} 
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 text-base leading-none"
            >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="flex-shrink-0">
                    <rect x="0" y="4" width="10" height="2" rx="1" fill="currentColor" />
                    <rect x="4" y="0" width="2" height="10" rx="1" fill="currentColor" />
                </svg>     
                
            </button>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-16 bg-white border border-gray-200 rounded shadow z-20 flex flex-col">
                    {PRESET_SIZES.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => applySize(preset)}
                            className={`w-full text-left px-3 py-1 text-sm hover:bg-gray-100 ${size === preset ? 'font-medium text-blue-600' : 'text-gray-700'}`}
                        >
                            {preset}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
