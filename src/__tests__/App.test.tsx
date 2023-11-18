import App from "../components/App"
import { screen } from '@testing-library/react'
import { renderWithProviders } from "../utils/test-utils"

test('Uses preloaded state to render', () => {
    const initialBeer = 2
    expect(renderWithProviders(<App />, {
        preloadedState: {
            beers: {
                value: initialBeer,
                data: [
                    1,
                    2
                ],
                status: 'idle',
                error: 'none'
            }
        }
    }).store.getState()).toStrictEqual({
        "beers": {"value": 2, "data": [1,2], "status": "idle", "error": "none"}
    })
})

test('checks the welcome message', () => {
    const initialBeer = 0
    renderWithProviders(<App />, {
        preloadedState: {
            beers: {
                value: initialBeer,
                data: [
                    1,
                    2
                ],
                status: 'idle',
                error: 'none'
            }
        }
    })
    expect(screen.getByText('Welcome friend, to Beer Stats!')).toBeTruthy()
})