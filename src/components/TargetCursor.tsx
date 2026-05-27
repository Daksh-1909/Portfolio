import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TargetCursorProps {
    /** CSS selector for elements the cursor should snap to */
    targetSelector?: string;
    /** Duration of the spinning animation in idle state */
    spinDuration?: number;
    /** Transition duration for snapping/hover effects */
    hoverDuration?: number;
    /** Whether to hide the default browser cursor */
    hideDefaultCursor?: boolean;
    /** Enable subtle parallax movement when hovering elements */
    parallaxOn?: boolean;
    /** Container to track mouse within (optional) */
    containerRef?: React.RefObject<HTMLElement | null>;
    className?: string;
    color?: string;
}

export const TargetCursor: React.FC<TargetCursorProps> = ({
    targetSelector = '[data-target="true"], .cursor-target',
    spinDuration = 10,
    hoverDuration = 0.3,
    hideDefaultCursor = false,
    parallaxOn = true,
    containerRef,
    className = '',
    color = '#ffffff',
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isLocked, setIsLocked] = useState(false);
    const isVisible = useRef(false);

    // Dynamic states for snapping adaptation
    const [cursorColors, setCursorColors] = useState<{ left: string; right: string }>({
        left: color,
        right: color,
    });
    const [borderRadius, setBorderRadius] = useState<string>('0px');

    // Internal state for tracking without triggering re-renders
    const mouse = useRef({ x: -100, y: -100, absX: -100, absY: -100 });
    const cursor = useRef({ x: -100, y: -100, scale: 1, rotate: 0, opacity: 1 });
    const targetElement = useRef<HTMLElement | null>(null);
    const targetRect = useRef<DOMRect | null>(null);
    const rafId = useRef<number>(0);

    const updateMouse = useCallback((e: MouseEvent) => {
        let inside = true;

        if (containerRef?.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            inside = (
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom
            );

            mouse.current = { x, y, absX: e.clientX, absY: e.clientY };
        } else {
            mouse.current = {
                x: e.clientX,
                y: e.clientY,
                absX: e.clientX,
                absY: e.clientY,
            };
        }

        isVisible.current = inside;

        // Check for target elements
        const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
        const target = elementUnderMouse?.closest(targetSelector) as HTMLElement;

        if (target && inside) {
            targetElement.current = target;
            targetRect.current = target.getBoundingClientRect();

            // Extract border radius
            const computedStyle = window.getComputedStyle(target);
            const radius = computedStyle.borderRadius;
            setBorderRadius(radius && radius !== '0px' ? radius : '0px');

            // Adapt colors based on target classes and styles
            let leftColor = color;
            let rightColor = color;

            const customColors = target.getAttribute('data-cursor-colors');
            if (customColors) {
                const parts = customColors.split(',');
                if (parts.length === 2) {
                    leftColor = parts[0].trim();
                    rightColor = parts[1].trim();
                } else if (parts.length === 1) {
                    leftColor = parts[0].trim();
                    rightColor = parts[0].trim();
                }
            } else if (target.classList.contains('btn-primary')) {
                leftColor = '#06b6d4'; // accent-cyan
                rightColor = '#8b5cf6'; // accent-violet
            } else if (target.classList.contains('btn-outline')) {
                leftColor = '#06b6d4';
                rightColor = '#06b6d4';
            } else {
                const borderColor = computedStyle.borderColor;
                const textColor = computedStyle.color;
                if (borderColor && borderColor !== 'transparent' && !borderColor.startsWith('rgba(0, 0, 0, 0)')) {
                    leftColor = borderColor;
                    rightColor = borderColor;
                } else if (textColor) {
                    leftColor = textColor;
                    rightColor = textColor;
                }
            }

            setCursorColors({ left: leftColor, right: rightColor });
            if (!isLocked) setIsLocked(true);
        } else {
            targetElement.current = null;
            targetRect.current = null;
            if (isLocked) {
                setIsLocked(false);
                setCursorColors({ left: color, right: color });
                setBorderRadius('0px');
            }
        }
    }, [containerRef, targetSelector, isLocked, color]);

    const animate = useCallback(() => {
        if (!cursorRef.current) return;

        let targetX = mouse.current.x;
        let targetY = mouse.current.y;
        let targetRotate = (Date.now() / (spinDuration * 1000)) * 360;
        let width = 24;
        let height = 24;

        if (targetElement.current && targetRect.current) {
            const rect = targetElement.current.getBoundingClientRect(); // Live tracking
            const containerRect = containerRef?.current?.getBoundingClientRect();

            let centerX, centerY;
            if (containerRect) {
                centerX = rect.left + rect.width / 2 - containerRect.left;
                centerY = rect.top + rect.height / 2 - containerRect.top;
            } else {
                centerX = rect.left + rect.width / 2;
                centerY = rect.top + rect.height / 2;
            }

            if (parallaxOn) {
                const dx = mouse.current.x - centerX;
                const dy = mouse.current.y - centerY;
                targetX = centerX + dx * 0.15;
                targetY = centerY + dy * 0.15;
            } else {
                targetX = centerX;
                targetY = centerY;
            }

            width = rect.width + 12;
            height = rect.height + 12;
            targetRotate = 0;
        }

        // Smoothly interpolate cursor position
        cursor.current.x += (targetX - cursor.current.x) * 0.2;
        cursor.current.y += (targetY - cursor.current.y) * 0.2;

        const el = cursorRef.current;
        el.style.transform = `translate(${cursor.current.x}px, ${cursor.current.y}px)`;
        el.style.opacity = isVisible.current ? '1' : '0';
        el.style.visibility = isVisible.current ? 'visible' : 'hidden';

        const inner = el.querySelector('.cursor-inner') as HTMLElement;
        if (inner) {
            inner.style.width = `${width}px`;
            inner.style.height = `${height}px`;
            inner.style.transform = `translate(-50%, -50%) rotate(${targetRotate}deg)`;
        }

        rafId.current = requestAnimationFrame(animate);
    }, [spinDuration, parallaxOn, containerRef]);

    useEffect(() => {
        window.addEventListener('mousemove', updateMouse, { passive: true });
        rafId.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', updateMouse);
            cancelAnimationFrame(rafId.current);
        };
    }, [updateMouse, animate]);

    const cornerStyle = (side: 'left' | 'right', position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'): React.CSSProperties => {
        const sideColor = side === 'left' ? cursorColors.left : cursorColors.right;
        
        let specificRadius = '0px';
        if (isLocked && borderRadius !== '0px') {
            if (position === 'top-left') specificRadius = `${borderRadius} 0 0 0`;
            if (position === 'top-right') specificRadius = `0 ${borderRadius} 0 0`;
            if (position === 'bottom-left') specificRadius = `0 0 0 ${borderRadius}`;
            if (position === 'bottom-right') specificRadius = `0 0 ${borderRadius} 0`;
        }

        return {
            position: 'absolute',
            width: isLocked ? '14px' : '8px',
            height: isLocked ? '14px' : '8px',
            borderColor: sideColor,
            borderStyle: 'solid',
            borderRadius: specificRadius,
            transition: `all ${hoverDuration}s cubic-bezier(0.23, 1, 0.32, 1)`,
            pointerEvents: 'none',
        };
    };

    const containerSelector = containerRef ? '.target-cursor-area' : 'body';

    return (
        <div
            ref={cursorRef}
            className={`target-cursor ${className}`}
            style={{
                position: containerRef ? 'absolute' : 'fixed',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                transition: 'opacity 0.2s ease, visibility 0.2s ease',
                visibility: 'hidden',
                willChange: 'transform',
            }}
        >
            <style>{`
                ${hideDefaultCursor ? `
                ${containerSelector} { cursor: none !important; }
                ${containerSelector} button, 
                ${containerSelector} a, 
                ${containerSelector} .cursor-target,
                ${containerSelector} [data-target="true"] { cursor: none !important; }
                ` : ''}
                
                .cursor-inner {
                    position: relative;
                    transition: width ${hoverDuration}s cubic-bezier(0.23, 1, 0.32, 1), 
                                height ${hoverDuration}s cubic-bezier(0.23, 1, 0.32, 1),
                                border-radius ${hoverDuration}s cubic-bezier(0.23, 1, 0.32, 1);
                    will-change: width, height, transform, border-radius;
                }
            `}</style>

            <div 
                className="cursor-inner" 
                style={{ 
                    width: 24, 
                    height: 24, 
                    transform: 'translate(-50%, -50%)',
                    borderRadius: borderRadius,
                }}
            >
                {/* Top Left */}
                <div style={{ ...cornerStyle('left', 'top-left'), top: 0, left: 0, borderWidth: '2px 0 0 2px' }} />
                {/* Top Right */}
                <div style={{ ...cornerStyle('right', 'top-right'), top: 0, right: 0, borderWidth: '2px 2px 0 0' }} />
                {/* Bottom Left */}
                <div style={{ ...cornerStyle('left', 'bottom-left'), bottom: 0, left: 0, borderWidth: '0 0 2px 2px' }} />
                {/* Bottom Right */}
                <div style={{ ...cornerStyle('right', 'bottom-right'), bottom: 0, right: 0, borderWidth: '0 2px 2px 0' }} />

                {/* Center Dot (Visible when not locked) */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '4px',
                    height: '4px',
                    background: cursorColors.left,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: isLocked ? 0 : 1,
                    transition: `opacity ${hoverDuration}s ease`,
                }} />
            </div>
        </div>
    );
};

export default TargetCursor;
