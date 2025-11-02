// components/StackResizableWrapper.tsx
"use client";

import React, { useRef, useCallback, useEffect } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { throttle } from 'lodash-es';
import clsx from 'clsx'; // Utility for conditional classes, install with `npm install clsx`

// --- Constants ---
const THROTTLE_WAIT = 16; // ~60fps updates

// --- Types ---
type Handle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
interface StackResizableWrapperProps {
    children: React.ReactNode;
    nodeId: string;
    enableWidthResize?: boolean;
    enableHeightResize?: boolean;
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: string | null; // e.g., "16/9", "1/1"
}

// --- Helper Functions ---
const parseAspectRatio = (ratioStr: string | null): number | null => {
    if (!ratioStr || typeof ratioStr !== 'string') return null;
    const parts = ratioStr.split(/[/:]/);
    if (parts.length === 2) {
        const w = parseFloat(parts[0]);
        const h = parseFloat(parts[1]);
        if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
            return w / h; // width / height
        }
    }
    return null;
};

// Define the 8 resize handles
const handles: { id: Handle; cursor: string }[] = [
    { id: 'n', cursor: 'ns-resize' },
    { id: 's', cursor: 'ns-resize' },
    { id: 'e', cursor: 'ew-resize' },
    { id: 'w', cursor: 'ew-resize' },
    { id: 'ne', cursor: 'nesw-resize' },
    { id: 'nw', cursor: 'nwse-resize' },
    { id: 'se', cursor: 'nwse-resize' },
    { id: 'sw', cursor: 'nesw-resize' },
];

export const StackResizableWrapper: React.FC<StackResizableWrapperProps> = ({
    children,
    nodeId,
    enableWidthResize = true,
    enableHeightResize = true,
    minWidth = 20,
    minHeight = 20,
    aspectRatio = null,
}) => {
    const { actions, props: nodeProps } = useNode((node) => ({
        props: node.data.props,
    }));

    const { enabled: editorEnabled, selected } = useEditor((state, query) => ({
        enabled: state.options.enabled,
        selected: query.getEvent('selected').contains(nodeId),
    }));

    const wrapperRef = useRef<HTMLDivElement>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const startSize = useRef({ width: 0, height: 0 });
    const activeHandle = useRef<Handle | null>(null);

    const numericAspectRatio = parseAspectRatio(aspectRatio);

    const throttledSetProp = useCallback(
        throttle(
            (newProps: { width?: number; height?: number }) => {
                actions.setProp((props: any) => {
                    if (newProps.width !== undefined) props.width = `${Math.round(newProps.width)}px`;
                    if (newProps.height !== undefined) props.height = `${Math.round(newProps.height)}px`;
                }, 50);
            },
            THROTTLE_WAIT,
            { leading: true, trailing: true }
        ),
        [actions]
    );

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!activeHandle.current || !wrapperRef.current) return;
        e.preventDefault();

        const currentPos = { x: e.clientX, y: e.clientY };
        const deltaX = currentPos.x - startPos.current.x;
        const deltaY = currentPos.y - startPos.current.y;

        let newWidth = startSize.current.width;
        let newHeight = startSize.current.height;

        const handle = activeHandle.current;

        // Calculate new dimensions based on handle
        if (handle.includes('e')) newWidth = startSize.current.width + deltaX;
        if (handle.includes('w')) newWidth = startSize.current.width - deltaX;
        if (handle.includes('s')) newHeight = startSize.current.height + deltaY;
        if (handle.includes('n')) newHeight = startSize.current.height - deltaY;

        // Apply aspect ratio constraints
        if (numericAspectRatio) {
            if (handle.includes('n') || handle.includes('s')) {
                // Height is the driver
                newWidth = newHeight * numericAspectRatio;
            } else {
                // Width is the driver (or corner, where width takes precedence)
                newHeight = newWidth / numericAspectRatio;
            }
        }

        // Apply minimum size constraints
        newWidth = Math.max(minWidth, newWidth);
        newHeight = Math.max(minHeight, newHeight);

        // Apply styles directly for immediate feedback
        wrapperRef.current.style.width = `${newWidth}px`;
        wrapperRef.current.style.height = `${newHeight}px`;

        // Throttle the update to Craft.js state
        throttledSetProp({ width: newWidth, height: newHeight });
    }, [minWidth, minHeight, numericAspectRatio, throttledSetProp]);

    const handleMouseUp = useCallback(() => {
        if (!activeHandle.current) return;

        // Flush any pending updates
        throttledSetProp.flush();

        activeHandle.current = null;
        document.body.style.cursor = ''; // Reset body cursor
        document.body.classList.remove('is-resizing'); // Remove helper class

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, throttledSetProp]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, handle: Handle) => {
        if (!editorEnabled || !wrapperRef.current) return;
        e.preventDefault();
        e.stopPropagation();

        activeHandle.current = handle;
        startPos.current = { x: e.clientX, y: e.clientY };
        const rect = wrapperRef.current.getBoundingClientRect();
        startSize.current = { width: rect.width, height: rect.height };
        
        // Improve UX by setting a global cursor during resize
        const handleDef = handles.find(h => h.id === handle);
        if (handleDef) {
            document.body.style.cursor = handleDef.cursor;
            document.body.classList.add('is-resizing'); // For global styles if needed
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [editorEnabled, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        // Cleanup global listeners if component unmounts while resizing
        return () => {
            if (activeHandle.current) {
                throttledSetProp.cancel();
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.classList.remove('is-resizing');
            }
        };
    }, [handleMouseMove, handleMouseUp, throttledSetProp]);

    const renderHandles = () => {
        if (!selected || !editorEnabled) return null;

        return (
            <>
                {handles.map(({ id, cursor }) => {
                    const isEdge = id.length === 1;
                    const isVertical = id === 'n' || id === 's';
                    const isHorizontal = id === 'w' || id === 'e';
                    
                    if (!enableWidthResize && (isHorizontal || !isEdge)) return null;
                    if (!enableHeightResize && (isVertical || !isEdge)) return null;
                    
                    // If aspect ratio is locked, only show corner handles for simplicity and better UX
                    if (numericAspectRatio && isEdge) return null;

                    return (
                        <div
                            key={id}
                            onMouseDown={(e) => handleMouseDown(e, id)}
                            style={{ cursor, touchAction: 'none' }}
                            className={clsx(
                                'absolute bg-blue-500 border-2 border-white rounded-full shadow-md z-10',
                                {
                                    'w-3 h-3 -m-1.5': !isEdge, // Corner handle size
                                    'w-2 h-4 -my-2 -mx-1': isVertical, // Vertical handle size
                                    'w-4 h-2 -mx-2 -my-1': isHorizontal, // Horizontal handle size
                                    'top-0': id.includes('n'),
                                    'bottom-0': id.includes('s'),
                                    'left-0': id.includes('w'),
                                    'right-0': id.includes('e'),
                                    'left-1/2 -translate-x-1/2': isVertical,
                                    'top-1/2 -translate-y-1/2': isHorizontal,
                                }
                            )}
                            title={`Resize (${id.toUpperCase()})`}
                        />
                    );
                })}
            </>
        );
    };

    const wrapperStyle: React.CSSProperties = {
        position: 'relative',
        width: nodeProps.width ?? 'auto',
        height: nodeProps.height ?? 'auto',
        outline: selected && editorEnabled ? '2px dashed #3b82f6' : 'none',
        outlineOffset: '2px',
        // Resizing is now managed by direct style manipulation for performance
        transition: activeHandle.current ? 'none' : 'outline 0.1s ease-in-out',
        boxSizing: 'border-box',
    };

    return (
        <div ref={wrapperRef} style={wrapperStyle} className="craft-resizable-wrapper">
            <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                {children}
            </div>
            {renderHandles()}
        </div>
    );
};
