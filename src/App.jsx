import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { path } from 'framer-motion/client'
import Login from './components/Login/Login'
import CementRealtimeDashboard from './components/Dashboard/Dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'


function App() {

const appRouter= createBrowserRouter([
  {
  path: "/", 
  element: <Login />
  },
  {
  path:"/signup", 
  element:<Login/>
  },
  {
    path:"/login", 
    element:<Login/>
  },
  {
    path:"/dashboard",
    element:<CementRealtimeDashboard/>
  }
])
  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
