import { useState, useEffect, useRef } from 'react';
import { ListChevronsUpDown } from 'lucide-react';
import ToolbarButton from './ToolbarButton';

const LINE_SPACING_OPTIONS = [
    { label: 'Single', value: '1' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: 'Double', value: '2' },
];

export default function LineSpacing({ quillRef }) {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState('1.5');
    const wrapperRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (e) => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const applyLineSpacing = (value) => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.focus();
        const range = quill.getSelection();
        if (range) quill.format('lineHeight', value);
        setCurrent(value);
        setOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <ToolbarButton
                onClick={() => setOpen(!open)}
                title="Line spacing"
                active={open}
            >
                <ListChevronsUpDown size={16} />
            </ToolbarButton>

            {open && (
                <div className="absolute top-full left-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow z-20 flex flex-col">
                    {LINE_SPACING_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => applyLineSpacing(option.value)}
                            className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${
                                current === option.value
                                    ? 'font-medium text-blue-600'
                                    : 'text-gray-700'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}    
