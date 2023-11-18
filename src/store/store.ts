import { PreloadedState, combineReducers, configureStore } from '@reduxjs/toolkit'
import beerReducer from '../features/beerSlice'

const rootReducer = combineReducers({
    beers: beerReducer
})

export function setupStore(preloadedState?: PreloadedState<RootState>) {
    return configureStore({
        reducer: rootReducer,
        preloadedState
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
export type AppStore = ReturnType<typeof setupStore>