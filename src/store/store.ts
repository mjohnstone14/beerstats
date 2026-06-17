import { combineReducers, configureStore } from '@reduxjs/toolkit';
import myBeersReducer from '../features/myBeersSlice';

const rootReducer = combineReducers({
  myBeers: myBeersReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export type AppStore = ReturnType<typeof setupStore>;
