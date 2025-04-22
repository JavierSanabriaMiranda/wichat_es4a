import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChaosButton } from './ChaosMode';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

const mockSetConfig = jest.fn();

jest.mock('../contextProviders/GameConfigProvider', () => ({
  useConfig: () => ({
    setConfig: mockSetConfig,
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ChaosButton component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  it('renders chaos mode button', () => {
    render(<ChaosButton />);
    expect(screen.getByText('chaosMode-home')).toBeInTheDocument();
  });

  it('shows chaos mode modal on click', async () => {
    render(<ChaosButton />);
    const button = screen.getByText('chaosMode-home');

    await act(async () => {
      await userEvent.click(button);
    });

    expect(screen.getByText('chaosMode-intro-title')).toBeInTheDocument();
    expect(screen.getByText('chaosMode-intro-body')).toBeInTheDocument();
    expect(screen.getByText('playChaos')).toBeInTheDocument();
  });

  it('triggers chaos config and redirects on Play Chaos click', async () => {
    render(<ChaosButton />);
    const chaosButton = screen.getByText('chaosMode-home');

    await act(async () => {
      await userEvent.click(chaosButton);
    });

    const playChaosButton = screen.getByText('playChaos');

    await act(async () => {
      await userEvent.click(playChaosButton);
    });

    expect(mockSetConfig).toHaveBeenCalledWith(expect.objectContaining({
      questions: expect.any(Number),
      timePerRound: expect.any(Number),
      topics: expect.any(Array),
      isChaos: true
    }));

    expect(window.location.href).toBe('/game');
  });
});
