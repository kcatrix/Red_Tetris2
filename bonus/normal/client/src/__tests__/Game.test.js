import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import reducers from '../reducers';
import MultiGame from '../multigame';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('MultiGame Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: reducers
    });

    // Mock Audio
    window.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn(),
      pause: jest.fn(),
      loop: false
    }));
  });

  test('renders game component', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const appContainer = container.querySelector('.App');
    expect(appContainer).toBeInTheDocument();
  });

  test('displays player name', () => {
    store.dispatch({ type: 'tempName/changeTempName', payload: 'TestPlayer' });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const nameElement = screen.getByText('TestPlayer');
    expect(nameElement).toBeInTheDocument();
  });

  test('shows go back button', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const backButton = screen.getByText('Go back');
    expect(backButton).toBeInTheDocument();
  });

  test('shows opponents section', () => {
    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MultiGame />
        </BrowserRouter>
      </Provider>
    );

    const opponentsSection = container.querySelector('.Opponents');
    expect(opponentsSection).toBeInTheDocument();
  });
});
