import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Home } from './Home';
import i18n from 'i18next';
import { TextEncoder } from 'util';
global.TextEncoder = TextEncoder;


jest.mock('./Configuration', () => ({ onClose }) => (
  <div>
    <p>Configuration Component</p>
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock('../NavBar', () => () => <div>Mocked NavBar</div>);


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Home component', () => {
  it('renders the initial content properly', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText('welcome-home')).toBeInTheDocument();
    expect(screen.getByText('quickGame-home')).toBeInTheDocument();
    expect(screen.getByText('chaosMode-home')).toBeInTheDocument();
    expect(screen.getByText('Mocked NavBar')).toBeInTheDocument();
  });

  it('shows Configuration component when Quick Game button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const quickGameButton = screen.getByText('quickGame-home');
    await userEvent.click(quickGameButton);

    expect(screen.getByText('Configuration Component')).toBeInTheDocument();
  });

  it('shows Configuration component when Chaos Mode button is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const chaosModeButton = screen.getByText('chaosMode-home');
    await userEvent.click(chaosModeButton);

    expect(screen.getByText('Configuration Component')).toBeInTheDocument();
  });

  it('hides Configuration component when Close is clicked', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const quickGameButton = screen.getByText('quickGame-home');
    await userEvent.click(quickGameButton);

    expect(screen.getByText('Configuration Component')).toBeInTheDocument();

    const closeButton = screen.getByText('Close');
    await userEvent.click(closeButton);

    expect(screen.queryByText('Configuration Component')).not.toBeInTheDocument();
  });
});
