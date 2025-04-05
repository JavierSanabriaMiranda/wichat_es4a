// Mock completo de i18n para evitar errores con initReactI18next
jest.mock('../i18n/i18next', () => ({
    changeLanguage: jest.fn(),
  }));
  
  import React from 'react';
  import { render, screen, fireEvent } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { MemoryRouter } from 'react-router';
  import NavBar from './NavBar';
  import { TextEncoder } from 'util';
  import AuthContext from './contextProviders/AuthContext';
  
  global.TextEncoder = TextEncoder;
  
  // Mock de react-i18next para devolver claves como textos
  jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
  // Mock del componente Rules
  jest.mock('./Rules', () => ({ show, handleClose }) => (
    show ? (
      <div>
        <p>Rules Modal</p>
        <button onClick={handleClose}>Close Rules</button>
      </div>
    ) : null
  ));
  
  describe('NavBar component', () => {
    const renderWithContext = (tokenValue = null) => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ token: tokenValue }}>
            <NavBar hasPadding={true} />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    };
  
    it('renders logo and language menu', () => {
      renderWithContext();
  
      expect(screen.getByAltText('Logo')).toBeInTheDocument();
      expect(screen.getByText('language-menu')).toBeInTheDocument();
    });
  
    it('shows and closes rules modal', async () => {
      renderWithContext();
  
      const rulesBtn = screen.getByText('rules-menu');
      await userEvent.click(rulesBtn);
  
      expect(screen.getByText('Rules Modal')).toBeInTheDocument();
  
      const closeBtn = screen.getByText('Close Rules');
      await userEvent.click(closeBtn);
  
      expect(screen.queryByText('Rules Modal')).not.toBeInTheDocument();
    });
  
    it('shows login/signup when token is not present', () => {
      renderWithContext(null);
  
      expect(screen.getByText('LogIn')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });
  
    it('shows user and logout icons when token exists', () => {
        renderWithContext('mock-token');
      
        expect(screen.getByTestId('user-icon')).toBeInTheDocument();
        expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
      });
      
      it('shows logout modal when logout icon is clicked', async () => {
        renderWithContext('mock-token');
      
        const logoutIcon = screen.getByTestId('logout-icon');
        await userEvent.click(logoutIcon);
      
        expect(screen.getByText('logout-message')).toBeInTheDocument();
        expect(screen.getByText('confirm-logout')).toBeInTheDocument();
      });
      
  
    
  });
  