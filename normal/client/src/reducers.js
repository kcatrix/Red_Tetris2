import { createSlice } from '@reduxjs/toolkit';

const catalogPiecesSlice = createSlice({
  name: 'catalogPieces',
  initialState: [],
  reducers: {
    setCatalogPieces: (state, action) => action.payload
  }
});

const multiSlice = createSlice({
  name: 'multi',
  initialState: false,
  reducers: {
    setMulti: (state, action) => action.payload
  }
});

const urlSlice = createSlice({
  name: 'url',
  initialState: '',
  reducers: {
    setUrl: (state, action) => action.payload
  }
});

const backSlice = createSlice({
  name: 'back',
  initialState: false,
  reducers: {
    setBack: (state, action) => action.payload
  }
});

const showHighScoreSlice = createSlice({
  name: 'showHighScore',
  initialState: false,
  reducers: {
    setShowHighScore: (state, action) => action.payload
  }
});

const piecesSlice = createSlice({
  name: 'pieces',
  initialState: [],
  reducers: {
    setPieces: (state, action) => action.payload
  }
});

const tempNameSlice = createSlice({
  name: 'tempName',
  initialState: '',
  reducers: {
    changeTempName: (state, action) => action.payload
  }
});

export const {
  setCatalogPieces
} = catalogPiecesSlice.actions;

export const {
  setMulti
} = multiSlice.actions;

export const {
  setUrl
} = urlSlice.actions;

export const {
  setBack
} = backSlice.actions;

export const {
  setShowHighScore
} = showHighScoreSlice.actions;

export const {
  setPieces
} = piecesSlice.actions;

export const {
  changeTempName
} = tempNameSlice.actions;

export const selectCatalogPieces = state => state.catalogPieces;
export const selectMulti = state => state.multi;
export const selectUrl = state => state.url;
export const selectBack = state => state.back;
export const selectShowHighScore = state => state.showHighScore;
export const selectPieces = state => state.pieces;
export const selectTempName = state => state.tempName;

export default {
  catalogPieces: catalogPiecesSlice.reducer,
  multi: multiSlice.reducer,
  url: urlSlice.reducer,
  back: backSlice.reducer,
  showHighScore: showHighScoreSlice.reducer,
  pieces: piecesSlice.reducer,
  tempName: tempNameSlice.reducer
};
