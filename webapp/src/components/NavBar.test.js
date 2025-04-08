import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import NavBar from './NavBar';
import { TextEncoder } from 'util';
import AuthContext from './contextProviders/AuthContext';
import i18n from '../i18n/i18next';

global.TextEncoder = TextEncoder;

jest.mock('../i18n/i18next', () => ({
  changeLanguage: jest.fn(),
}));


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('./Rules', () => ({ show, handleClose }) =>
  show ? (
    <div>
      <p>Rules Modal</p>
      <button onClick={handleClose}>Close Rules</button>
    </div>
  ) : null
);

describe('NavBar component', () => {
  const renderWithContext = async (tokenValue = null) => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: tokenValue }}>
            <NavBar hasPadding={true} />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });
  };

  it('renders logo and language menu', async () => {
    await renderWithContext();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('language-menu')).toBeInTheDocument();
  });

  it('shows and closes rules modal', async () => {
    await renderWithContext();

    const rulesBtn = screen.getByText('rules-menu');
    await act(async () => {
      await userEvent.click(rulesBtn);
    });

    expect(screen.getByText('Rules Modal')).toBeInTheDocument();

    const closeBtn = screen.getByText('Close Rules');
    await act(async () => {
      await userEvent.click(closeBtn);
    });

    expect(screen.queryByText('Rules Modal')).not.toBeInTheDocument();
  });

  it('shows login/signup when token is not present', async () => {
    await renderWithContext(null);

    expect(screen.getByText('LogIn')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows user and logout icons when token exists', async () => {
    await renderWithContext('mock-token');

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
  });

  it('shows logout modal when logout icon is clicked', async () => {
    await renderWithContext('mock-token');

    const logoutIcon = screen.getByTestId('logout-icon');
    await act(async () => {
      await userEvent.click(logoutIcon);
    });

    expect(screen.getByText('logout-message')).toBeInTheDocument();
    expect(screen.getByText('confirm-logout')).toBeInTheDocument();
  });
  


  it('changes language when a language is selected', async () => {
    await renderWithContext();

    const langDropdown = screen.getByText('language-menu');
    await act(async () => {
      await userEvent.click(langDropdown);
    });

    const spanishOption = screen.getByText('spanish-menu');
    await act(async () => {
      await userEvent.click(spanishOption);
    });

    expect(i18n.changeLanguage).toHaveBeenCalledWith('es');
  });


});
