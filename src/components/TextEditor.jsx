import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.core.css';

const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'times-new-roman', 'courier-new', 'georgia', 'verdana'];
Quill.register(Font, true);

const Size = Quill.import('attributors/style/size');
Size.whitelist = Array.from({ length: 96 }, (_, i) => `${i + 1}pt`);
Quill.register(Size, true);

const Parchment = Quill.import('parchment');
const StyleAttributor = Parchment.StyleAttributor;
const LineHeightStyle = new StyleAttributor(
    'lineHeight',
    'line-height',
    { scope: Parchment.Scope.BLOCK, whitelist: ['1', '1.15', '1.5', '2', '2.5', '3'] }
);
Quill.register(LineHeightStyle, true);

const TextEditor = forwardRef(({defaultValue, onTextChange, onSelectionChange, toolbarRef}, ref) => {
    const containerRef = useRef(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
        const container = containerRef.current;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                toolbar: false,
                history: {
                    delay: 1000,
                    maxStack: 100,
                    userOnly: true,
                },
            },
        });

        ref.current = quill;

        if (defaultValueRef.current) {
            quill.setContents(defaultValueRef.current);
        }

        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
            onTextChangeRef.current && onTextChangeRef.current(...args);
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current && onSelectionChangeRef.current(...args);
        });

        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [ref]);

    return (
        <div className="flex-1 overflow-auto bg-gray-100 flex justify-center p-10">
            <div className="bg-white w-full max-w-3xl min-h-screen shadow-md rounded">
                <div ref={containerRef} className="p-8 text-base" />
            </div>
        </div>
    );

});

TextEditor.displayName = 'TextEditor';

export default TextEditor;
