import React, { useState } from 'react';

const QuestionImage = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="question-img"
        onClick={() => setIsOpen(true)}
        onContextMenu={(e) => e.preventDefault()}
      />

      {isOpen && (
        <div
          className="zoomed-image-div"
          onClick={() => setIsOpen(false)}
        >
          <img
            className="zoomed-image"
            src={src}
            alt={alt}
          />
        </div>
      )}
    </>
  );
}

export default QuestionImage;
