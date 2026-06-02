"use client"

import React from 'react'
import { Provider } from 'react-redux'
import reduxStore from './store'
import { ThemeProvider } from './ThemeProvider'

const ReduxProvider = ({children}: {children: React.ReactNode}) => {
  return <>
  <Provider store={reduxStore}>
    <ThemeProvider defaultTheme="light" storageKey="ecom-theme">
      {children}
    </ThemeProvider>
  </Provider>
  </>
}

export default ReduxProvider