import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

const store = configureStore({
  reducer: {
    catalogPieces: (state = [], action) => 
      action.type === 'catalogPieces/setCatalogPieces' ? action.payload : state,
    multi: (state = false, action) =>
      action.type === 'multi/setMulti' ? action.payload : state,
    url: (state = '', action) =>
      action.type === 'url/setUrl' ? action.payload : state,
    back: (state = false, action) =>
      action.type === 'back/setBack' ? action.payload : state,
    showHighScore: (state = false, action) =>
      action.type === 'showHighScore/setShowHighScore' ? action.payload : state,
    pieces: (state = [], action) =>
      action.type === 'pieces/setPieces' ? action.payload : state,
    tempName: (state = '', action) =>
      action.type === 'tempName/changeTempName' ? action.payload : state
  }
});

test('renders App component', () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );
  
  // Test initial state
  expect(screen.getByText(/Tetris/i)).toBeInTheDocument();
});
