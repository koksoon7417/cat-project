import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import breedsReducer from '../components/breeds/breedsSlice';

export const store = configureStore({
  reducer: {
    breeds: breedsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
