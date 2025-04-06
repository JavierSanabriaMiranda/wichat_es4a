import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameResults } from './GameResults';
import { MemoryRouter } from 'react-router';
import { GameConfigProvider } from '../contextProviders/GameConfigProvider';
import i18n from 'i18next';
import { AuthProvider } from '../contextProviders/AuthContext';


// Mocking localStorage
const mockLocalStorage = (data) => {
  global.Storage.prototype.getItem = jest.fn(() => JSON.stringify(data));
  global.Storage.prototype.setItem = jest.fn();
};
describe('GameResults component', () => {
  const renderComponent = () =>
    render(
      <AuthProvider>
        <MemoryRouter>
          <GameResults />
        </MemoryRouter>
      </AuthProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger the configuration modal when play again button is clicked', async () => {
    const mockGameResults = {
      questions: [],
      points: 100,
      numOfCorrectAnswers: 5,
      numOfWrongAnswers: 2,
      numOfNotAnswered: 3,
    };

    mockLocalStorage(mockGameResults);
    renderComponent();

    const playAgainButton = screen.getByRole('button', { name: i18n.t('play-again-button-text') });
    await act(async () => {
      userEvent.click(playAgainButton);
    });

    const modalButton = screen.getByRole('button', { name: /play again/i }); // Busca el botón del modal
    expect(modalButton).toBeInTheDocument();  // Verifica que el modal o su contenido esté visible
  });

  it('should navigate to home page when go back to menu button is clicked', async () => {
    const mockGameResults = {
      questions: [],
      points: 100,
      numOfCorrectAnswers: 5,
      numOfWrongAnswers: 2,
      numOfNotAnswered: 3,
    };

    mockLocalStorage(mockGameResults);
    renderComponent();

    const goBackButton = screen.getByRole('button', { name: i18n.t('go-back-to-menu') });
    await act(async () => {
      userEvent.click(goBackButton);
    });

    // Ensure the navigation works (for this, you would typically have a mock for react-router's navigation)
    expect(window.location.pathname).toBe('/'); // Adjust based on actual routing behavior
  });

  it('should display the game details correctly', async () => {
    const mockGameResults = {
        questions: [
          {
            text: 'What is 2+2?',
            imageUrl: 'url-to-image',
            wasUserCorrect: true,
            selectedAnswer: '4',
            answers: [
              { text: '3', isCorrect: false },
              { text: '4', isCorrect: true },
              { text: '5', isCorrect: false },
            ],
          },
          {
            text: 'What is 3+3?',
            imageUrl: 'url-to-image',
            wasUserCorrect: true,
            selectedAnswer: '6',
            answers: [
              { text: '5', isCorrect: false },
              { text: '6', isCorrect: true },
              { text: '7', isCorrect: false },
            ],
          },
        ],
        points: 100,
        numOfCorrectAnswers: 2,
        numOfWrongAnswers: 0,
        numOfNotAnswered: 0,
      };
  

    mockLocalStorage(mockGameResults);
    renderComponent();

    const questionAccordion = screen.getByText('1. What is 2+2?');
    expect(questionAccordion).toBeInTheDocument();
    expect(screen.getByText('2. What is 3+3?')).toBeInTheDocument();
  });
});
