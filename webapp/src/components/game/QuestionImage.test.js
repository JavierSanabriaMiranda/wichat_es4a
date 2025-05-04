import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionImage from './QuestionImage';

describe('QuestionImage', () => {
  const altText = 'Image description';
  const pngSrc = 'image.png';
  const jpgSrc = 'image.jpg';

  test('renders image with props', () => {
    render(<QuestionImage src={jpgSrc} alt={altText} />);
    const image = screen.getByAltText(altText);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', jpgSrc);
  });

  test('displays zoomed image when clicked', () => {
    render(<QuestionImage src={jpgSrc} alt={altText} />);
    const image = screen.getByAltText(altText);
    fireEvent.click(image);

    const zoomedImage = screen.getAllByAltText(altText)[1];
    expect(zoomedImage).toBeInTheDocument();
    expect(zoomedImage).toHaveClass('zoomed-image');
  });

  test('closes zoomed image when clicking on the background', () => {
    render(<QuestionImage src={jpgSrc} alt={altText} />);
    fireEvent.click(screen.getByAltText(altText));
  
    // Seleccionamos el contenedor con la clase zoomed-image-div
    const overlay = document.querySelector('.zoomed-image-div');
    fireEvent.click(overlay);
  
    expect(screen.queryAllByAltText(altText).length).toBe(1);
  });
  

  test('applies no-border class if image is PNG', () => {
    render(<QuestionImage src={pngSrc} alt={altText} />);
    fireEvent.click(screen.getByAltText(altText));

    const zoomedImage = screen.getAllByAltText(altText)[1];
    expect(zoomedImage).toHaveClass('no-border');
  });

  test('does not apply no-border class if image is not PNG', () => {
    render(<QuestionImage src={jpgSrc} alt={altText} />);
    fireEvent.click(screen.getByAltText(altText));

    const zoomedImage = screen.getAllByAltText(altText)[1];
    expect(zoomedImage).not.toHaveClass('no-border');
  });
});
