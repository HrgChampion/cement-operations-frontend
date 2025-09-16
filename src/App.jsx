import './App.css'
import Login from './components/Login/Login'
import CementRealtimeDashboard from './components/Dashboard/Dashboard'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import KpiDashboard from './components/Dashboard/KpiDashboard'
import { Toaster } from 'react-hot-toast'


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
  },
  {
    path: "/kpis",
    element: <KpiDashboard />
  }
  
])
  return (
    <>
      <RouterProvider router={appRouter}/>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
