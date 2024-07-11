import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface QueryResultState {
	[query: string]: {
		[documentType: string]: Array<unknown>;
	};
}

interface QueryResultPayload {
	query: string;
	documentType: string;
	result: Array<unknown>;
}

const initialState: QueryResultState = {};

export const queryResultSlice = createSlice({
	name: "queryResult",
	initialState,
	reducers: {
		load(state: QueryResultState, action: PayloadAction<QueryResultPayload>) {
			if (!Object.prototype.hasOwnProperty.call(state, action.payload.query)) {
				state[action.payload.query] = {};
			}

			state[action.payload.query][action.payload.documentType] =
				action.payload.result;
		},
	},
});

export const { load } = queryResultSlice.actions;

export default queryResultSlice.reducer;