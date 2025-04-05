import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Configuration from './Configuration';
import { useConfig } from '../contextProviders/GameConfigProvider';
import { useNavigate } from 'react-router';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

const mockSetConfig = jest.fn();
const mockResetConfig = jest.fn();

jest.mock('../contextProviders/GameConfigProvider', () => ({
  useConfig: () => ({
    config: {},
    setConfig: mockSetConfig,
    resetConfig: mockResetConfig,
  }),
}));

describe('Configuration component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial values', () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    expect(screen.getByText('title-configuration')).toBeInTheDocument();
    expect(screen.getByText('numberQuestions-configuration')).toBeInTheDocument();
    expect(screen.getByText('time-configuration')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'play-configuration' })).toBeDisabled();
  });

  it('calls onClose and resetConfig when close button is clicked', async () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    const closeBtn = screen.getByLabelText('Close configuration');
    await userEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockResetConfig).toHaveBeenCalled();
  });

  it('updates number of questions correctly', async () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    const dropdown = screen.getByText('30');
    await userEvent.click(dropdown);

    const option20 = screen.getByText('20');
    await userEvent.click(option20);

    expect(mockSetConfig).toHaveBeenCalledTimes(1);
    const callArg = mockSetConfig.mock.calls[0][0];
    const result = callArg({});
    expect(result).toEqual(expect.objectContaining({ questions: 20 }));
  });

  it('updates time correctly', async () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    const dropdown = screen.getByText('120s');
    await userEvent.click(dropdown);

    const option60 = screen.getByText('60s');
    await userEvent.click(option60);

    expect(mockSetConfig).toHaveBeenCalledTimes(1);
    const callArg = mockSetConfig.mock.calls[0][0];
    const result = callArg({});
    expect(result).toEqual(expect.objectContaining({ timePerRound: 60 }));
  });

  it('enables play button when a topic is selected', async () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    const historyButton = screen.getByText('history-configuration');
    await userEvent.click(historyButton);

    expect(mockSetConfig).toHaveBeenCalledTimes(1);
    const callArg = mockSetConfig.mock.calls[0][0];
    const result = callArg({ topics: [] });
    expect(result).toEqual(expect.objectContaining({ topics: ['history'] }));

    expect(screen.getByRole('button', { name: 'play-configuration' })).toBeEnabled();
  });

  it('navigates to /game with correct state when play button is clicked', async () => {
    render(
      <MemoryRouter>
        <Configuration onClose={mockOnClose} />
      </MemoryRouter>
    );

    const historyButton = screen.getByText('history-configuration');
    await userEvent.click(historyButton);

    const playButton = screen.getByRole('button', { name: 'play-configuration' });
    await userEvent.click(playButton);

    expect(mockedNavigate).toHaveBeenCalledWith('/game', { state: { questionTime: 120 } });
  });
});
