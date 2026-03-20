import { forwardRef } from 'react';
import {
    Bold, Italic, Underline,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Link,
    Indent, Outdent,
    Eraser, Undo2, Redo2
} from 'lucide-react';
import ToolbarButton from './Toolbar/ToolbarButton';
import FontSize from './Toolbar/FontSize';
import LineSpacing from './Toolbar/LineSpacing';


function Divider() {
    return <div className="w-px h-5 bg-gray-200 mx-1 self-center" />;
}

const Toolbar = forwardRef(({ quillRef, activeFormats, onFormatsChange }, ref) => {

    const format = (name, value) => {
        const quill = quillRef.current;
        if (!quill) return;
        quill.focus();
        if (value === undefined) {
            const current = quill.getFormat();
            quill.format(name, current[name] ? false : true);
        } else {
            quill.format(name, value);
        }

        const updatedFormats = quill.getFormat();
        onFormatsChange?.(updatedFormats);
    };

    const handleUndo = () => quillRef.current?.history.undo();
    const handleRedo = () => quillRef.current?.history.redo();

    const handleClearFormatting = () => {
        const quill = quillRef.current;
        if (!quill) return;
        const range = quill.getSelection();
        if (range) quill.removeFormat(range.index, range.length);
    };

    return (
        <div 
            ref={ref} 
            className="border-b border-gray-200 px-4 py-2 flex gap-1 bg-white"
        >
            <ToolbarButton onClick={handleUndo} title="Undo">
                <Undo2 size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={handleRedo} title="Redo">
                <Redo2 size={16} />
            </ToolbarButton>

            <Divider />

            {/* Add Zoom */}

            <select
                className="h-7 text-sm border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 cursor-pointer focus:outline-none"
                onChange={(e) => format('header', e.target.value || false)}
                title="Heading"
                defaultValue=""
            >
                <option value="">Normal</option>
                <option value="1">Heading 1</option>
                <option value="2">Heading 2</option>
                <option value="3">Heading 3</option>
            </select>

            <select
                className="h-7 text-sm border border-gray-200 rounded px-1 py-0.5 bg-white text-gray-600 cursor-pointer focus:outline-none"
                onChange={(e) => format('font', e.target.value || false)}
                title="Font"
                defaultValue=""
            >
                <option value="">Default</option>
                <option value="arial">Arial</option>
                <option value="times-new-roman">Times New Roman</option>
                <option value="courier-new">Courier New</option>
                <option value="georgia">Georgia</option>
                <option value="verdana">Verdana</option>
            </select>   

            <Divider />

            <FontSize quillRef={quillRef} />

            <Divider />

            <ToolbarButton onClick={() => format('bold')} title="Bold" active={activeFormats?.bold}>
                <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('italic')} title="Italic" active={activeFormats?.italic}>
                <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('underline')} title="Underline" active={activeFormats?.underline}>
                <Underline size={16} />
            </ToolbarButton>

            <Divider />

            <div className="flex items-center gap-1" title="Text colour">
                <span className="text-xs text-gray-600">A</span>
                <input
                    type="color"
                    defaultValue="#000000"
                    onChange={(e) => format('color', e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-gray-200"
                    title="Text colour"
                />
            </div>

            <div className="flex items-center gap-1" title="Highlight colour">
                <span className="text-xs text-gray-600">H</span>
                <input
                    type="color"
                    defaultValue="#ffff00"
                    onChange={(e) => format('background', e.target.value)}
                    className="w-5 h-5 rounded cursor-pointer border border-gray-200"
                    title="Highlight colour"
                />
            </div>

            <Divider />

            <ToolbarButton onClick={() => format('align', false)} title="Align left" active={!activeFormats?.align}>
                <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('align', 'center')} title="Align center" active={activeFormats?.align === 'center'}>
                <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('align', 'right')} title="Align right" active={activeFormats?.align === 'right'}>
                <AlignRight size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('align', 'justify')} title="Justify" active={activeFormats?.align === 'justify'}>
                <AlignJustify size={16} />
            </ToolbarButton>

            <LineSpacing quillRef={quillRef} />

            <Divider />

            <ToolbarButton onClick={() => format('list', 'ordered')} title="Numbered list" active={activeFormats?.list === 'ordered'}>
                <ListOrdered size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => format('list', 'bullet')} title="Bulleted list" active={activeFormats?.list === 'bullet'}>
                <List size={16} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton onClick={() => quillRef.current?.format('indent', '-1')} title="Decrease indent">
                <Outdent size={16} />
            </ToolbarButton>
            <ToolbarButton onClick={() => quillRef.current?.format('indent', '+1')} title="Increase indent">
                <Indent size={16} />
            </ToolbarButton>

            <Divider />
            
            <ToolbarButton
                onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) format('link', url);
                }}
                title="Insert link"
                active={activeFormats?.link}
            >
                <Link size={16} />
            </ToolbarButton>

            <ToolbarButton onClick={handleClearFormatting} title="Clear formatting">
                <Eraser size={16} />
            </ToolbarButton>

        </div>
    );
});

Toolbar.displayName = 'Toolbar';

export default Toolbar;
