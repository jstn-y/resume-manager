import { useRef, useState } from 'react';
import Toolbar from '@/components/Toolbar';
import TextEditor from '@/components/TextEditor';

export default function Dashboard() {
    const quillRef = useRef(null);
    const toolbarRef = useRef(null);
    const [activeFormats, setActiveFormats] = useState({});

    const handleSelectionChange = (range) => {
        if (range && quillRef.current) {
            const formats = quillRef.current.getFormat(range);
            setActiveFormats(formats);
        }
    };

    const handleTextChange = () => {
        if (quillRef.current) {
            const range = quillRef.current.getSelection();
            if (range) {
                const formats = quillRef.current.getFormat(range);
                setActiveFormats(formats);
            }
        }
    };

    const handleFormatsChange = (formats) => {
        setActiveFormats(formats);
    };

    return (
        <div className="flex flex-col h-screen">
            <Toolbar
                ref={toolbarRef}
                quillRef={quillRef}
                activeFormats={activeFormats}
                onFormatsChange={handleFormatsChange}
            />
            <TextEditor
                ref={quillRef}
                toolbarRef={toolbarRef}
                onTextChange={handleTextChange}
                onSelectionChange={handleSelectionChange}
            />
        </div>
    );
}
