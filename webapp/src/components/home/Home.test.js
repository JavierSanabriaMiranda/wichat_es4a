import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { Home } from './Home';
import i18n from 'i18next';
import { TextEncoder } from 'util';
import AuthContext from '../contextProviders/AuthContext'; 

global.TextEncoder = TextEncoder;

// Mocks
jest.mock('./Configuration', () => ({ onClose }) => (
  <div>
    <p>Configuration Component</p>
    <button onClick={onClose}>Close</button>
  </div>
));

jest.mock('../../services/LLMService', () => ({
  welcome: jest.fn().mockResolvedValue({ data: { answer: '¡Hola, bienvenido!' } })
}));

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { answer: '¡Hola, bienvenido!' } })
}));


jest.mock('../NavBar', () => () => <div>Mocked NavBar</div>);

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'es' },
  }),
}));

// Function to wrap Home with the AuthContext context
const renderWithAuth = (component) => {
  const mockUser = { username: 'TestUser' };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: mockUser }}>
        {component}
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('Home component', () => {
  it('renders the initial content properly', async () => {
    await act(async () => {
      renderWithAuth(<Home />);
    });
    expect(screen.getByText('welcome-home')).toBeInTheDocument();
    expect(screen.getByText('quickGame-home')).toBeInTheDocument();
    expect(screen.getByText('chaosMode-home')).toBeInTheDocument();
    expect(screen.getByText('Mocked NavBar')).toBeInTheDocument();
  });

  it('shows Configuration component when Quick Game button is clicked', async () => {
    await act(async () => {
      renderWithAuth(<Home />);
    });
    const quickGameButton = screen.getByText('quickGame-home');
    await act(async () => {
      await userEvent.click(quickGameButton);
    });
    expect(screen.getByText('Configuration Component')).toBeInTheDocument();
  });

  it('shows Chaos Mode modal when Chaos Mode button is clicked', async () => {
    await act(async () => {
      renderWithAuth(<Home />);
    });
    const chaosModeButton = screen.getByText('chaosMode-home');
    await act(async () => {
      await userEvent.click(chaosModeButton);
    });
    expect(screen.getByText('chaosMode-intro-title')).toBeInTheDocument();
    expect(screen.getByText('chaosMode-intro-body')).toBeInTheDocument();
    expect(screen.getByText('playChaos')).toBeInTheDocument();
  });

  it('hides Configuration component when Close is clicked', async () => {
    await act(async () => {
      renderWithAuth(<Home />);
    });
    const quickGameButton = screen.getByText('quickGame-home');
    await act(async () => {
      await userEvent.click(quickGameButton);
    });

    expect(screen.getByText('Configuration Component')).toBeInTheDocument();

    const closeButton = screen.getByText('Close');
    await act(async () => {
      await userEvent.click(closeButton);
    });

    await waitFor(() => {
      expect(screen.queryByText('Configuration Component')).not.toBeInTheDocument();
    });
  });
});
