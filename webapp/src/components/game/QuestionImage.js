import React, { useState } from 'react';

const QuestionImage = ({ src, alt, className }) => {
  const [isOpen, setIsOpen] = useState(false);
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
