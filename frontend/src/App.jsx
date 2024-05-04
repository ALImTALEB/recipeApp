import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import { Toaster } from "react-hot-toast"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register'
import Add from './pages/AddUpdate/Add'
import Update from './pages/AddUpdate/Update'
import Recipe from './pages/Recipe/Recipe'
import MyRecipes from './pages/MyRecipes/MyRecipes'
import Login from './pages/Login/Login'
import Footer from './components/Footer/Footer'
import MyReviews from './pages/Myreviews/MyReviews'
import User from './components/User/User'
import UpdateProfile from './components/User/UpdateProfile'
import UpdatePassword from './components/User/UpdatePassword'


function App() {

  const queryClient = new QueryClient()

  // eslint-disable-next-line react/prop-types
  const ProtectedRoute = ({children}) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    
    if (!currentUser) {
      return <Navigate to="/login" />
    }

    return children
  }

  const Layout = () => {
    return (
      <>
        <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" />
        <Header />
        <Outlet />
        <Footer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      </>
    )
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/register",
          element: <Register />
        },
        {
          path: "/add",
          element: <ProtectedRoute><Add /></ProtectedRoute> 
        },
        {
          path: "/recipes/:id",
          element: <Recipe />
        },
        {
          path: "/myrecipes",
          element: <ProtectedRoute><MyRecipes /></ProtectedRoute> 
        },
        {
          path: "/login",
          element: <Login />
        },
        {
          path: "/myreviews",
          element: <ProtectedRoute><MyReviews /></ProtectedRoute> 
        },
        {
          path: "/update/:id",
          element: <ProtectedRoute><Update /></ProtectedRoute> 
        },
        {
          path: "/me/:id",
          element: <ProtectedRoute><User /></ProtectedRoute> 
        },
        {
          path: "/update/profile/:id",
          element: <ProtectedRoute><UpdateProfile /></ProtectedRoute> 
        },
        {
          path: "/update/password",
          element: <ProtectedRoute><UpdatePassword /></ProtectedRoute> 
        },
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
