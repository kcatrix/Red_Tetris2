import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const catalogPiecesSlice = createSlice ({

	name: 'catalogPieces',
	initialState,
	reducers: {
		fillCatalog(state, action){
			return action.payload
		}
	}
})

export const { fillCatalog } = catalogPiecesSlice.actions
export default catalogPiecesSlice.reducer

export const selectCatalogPieces = (state) => state.catalogPieces