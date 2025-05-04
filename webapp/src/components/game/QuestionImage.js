import React, { useState } from 'react';

/**
 * This component displays an image that can be clicked to zoom in.
 * 
 * @param {String} src - The source URL of the image.
 * @param {String} alt - The alternative text for the image.
 * @param {String} className - Additional CSS classes to apply to the image.
 * @returns Component that displays the image and handles zoom functionality.
 */
const QuestionImage = ({ src, alt, className }) => {
    
    // State to manage the zoomed image visibility
    const [isOpen, setIsOpen] = useState(false);
    // Check if the image is a PNG to apply specific styles
    const isPng = src.toLowerCase().endsWith('.png');

    return (
        <>
            <img
                src={src}
                alt={alt}
                className={className ? className : ''}
                onClick={() => setIsOpen(true)}
                onContextMenu={(e) => e.preventDefault()}
            />

            {isOpen && (
                <div
                    className="zoomed-image-div"
                    onClick={() => setIsOpen(false)}
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
