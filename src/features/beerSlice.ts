import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface BeerState {
    value: number,
    data: Array<any>,
    status: string,
    error: unknown
}

const initialState: BeerState = {
    value: 0,
    data: [],
    status: 'idle',
    error: null
}

const fetchBeerData = createAsyncThunk('data/fetchBeerData', async (size: number) => {
    const apiEndpoint = 'https://random-data-api.com/api/v2/beers'
    try {
        const response = await axios.get(apiEndpoint + '?size=' + size)
        return response.data
    } catch(error) {
        throw error;
    }
})

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
            state.status = 'idle'
            state.data = []
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // handle pending
        builder.addCase(fetchBeerData.pending, (state) => {
            state.status = 'loading'
        })

        // handle fulfilled
        builder.addCase(fetchBeerData.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.data = action.payload
        })

        // handle rejected
        builder.addCase(fetchBeerData.rejected, (state, action) => {
            state.status = 'failed',
            state.error = action.error.message
        })
    }
})

export { fetchBeerData }
export const { getBeer, setBeerAmount, getBeerByAmount, clearBeerData } = beerSlice.actions

export default beerSlice.reducer