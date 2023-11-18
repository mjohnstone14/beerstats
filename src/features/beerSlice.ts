import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface BeerState {
    value: number
}

const initialState: BeerState = {
    value: 0
}

export const beerSlice = createSlice({
    name: 'beer',
    initialState,
    reducers: {
        getBeer: state => {
            state.value +=1
        },
        getBeerByAmount: (state, action: PayloadAction<number>) => {
            console.log("Getting " + action.payload + " beers")
            state.value = state.value
        },
        setBeerAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
        clearBeerData: state => {
            state.value = 0
        }
    }
})

export const { getBeer, setBeerAmount, getBeerByAmount, clearBeerData } = beerSlice.actions

export default beerSlice.reducer