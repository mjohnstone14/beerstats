import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createHashRouter } from 'react-router-dom'
import Root from './routes/routes.tsx'
import ErrorPage from './routes/error-page.tsx'
import Dashboard from './components/Dashboard.tsx'
import MyBeers from './components/MyBeers.tsx'
import BeerDetail from './components/BeerDetail.tsx'
import { Provider } from 'react-redux'
import { setupStore } from './store/store'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);

const store = setupStore()

const router = createHashRouter([
  {
    path: "/*",
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/my-beers",
    element: <MyBeers />
  },
  {
    path: "/beer/:id",
    element: <BeerDetail />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
