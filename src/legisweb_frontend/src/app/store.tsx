import { type Store, configureStore } from "@reduxjs/toolkit";
import contentElementReducer from "../features/content-element/content-element-slice";
import queryReducer from "../features/search/query-slice";
import queryResultReducer from "../features/search/result-slice";
import toastReducer from "../features/toast/toast-slice";

export const store: Store = configureStore({
	reducer: {
		contentElement: contentElementReducer,
		toast: toastReducer,
		query: queryReducer,
		queryResultReducer: queryResultReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
