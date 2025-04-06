import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Rules from './Rules';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Rules component', () => {
  it('should render the modal with translated content', () => {
    render(<Rules show={true} handleClose={jest.fn()} />);

    expect(screen.getByText('rules-title')).toBeInTheDocument();
    expect(screen.getByText('rules-content-1')).toBeInTheDocument();
    expect(screen.getByText('rules-content-2')).toBeInTheDocument();
    expect(screen.getByText('rules-content-3')).toBeInTheDocument();
  });

  it('should call handleClose when close button is clicked', async () => {
    const handleCloseMock = jest.fn();
    render(<Rules show={true} handleClose={handleCloseMock} />);

    const closeButton = screen.getByRole('button', { name: /close/i });

    await act(async () => {
      await userEvent.click(closeButton);
    });

    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('should not render when show is false', () => {
    const { queryByText } = render(<Rules show={false} handleClose={jest.fn()} />);
    expect(queryByText('rules-title')).not.toBeInTheDocument();
  });
});
