import React, { useState, useEffect, useRef } from 'react';

/**
 * This component displays an image that can be clicked or activated via keyboard to zoom in.
 * 
 * @param {String} src - The source URL of the image.
 * @param {String} alt - The alternative text for the image.
 * @param {String} className - Additional CSS classes to apply to the image.
 * @returns Component that displays the image and handles zoom functionality.
 */
const QuestionImage = ({ src, alt, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isPng = src.toLowerCase().endsWith('.png');

    const overlayRef = useRef(null);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    const handleImageKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
        }
    };

    const handleOverlayKeyPress = (e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
            handleClose();
        }
    };

    useEffect(() => {
        if (isOpen && overlayRef.current) {
            overlayRef.current.focus();
        }
    }, [isOpen]);

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={className || ''}
                onClick={handleOpen}
                onContextMenu={(e) => e.preventDefault()}
                tabIndex={0}
                role="button"
                onKeyDown={handleImageKeyPress}
                aria-label="Open image zoom view"
            />

            {isOpen && (
                <div
                    className="zoomed-image-div"
                    onClick={handleClose}
                    onKeyDown={handleOverlayKeyPress}
                    tabIndex={0}
                    role="button"
                    ref={overlayRef}
                    aria-label="Zoomed image overlay"
                >
                    <img
                        className={`zoomed-image ${isPng ? 'no-border' : ''}`}
                        src={src}
                        alt={alt}
                    />
                </div>
            )}
        </>
    );
}

export default QuestionImage;
