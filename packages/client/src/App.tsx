import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootLayout } from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import { AuthLayout } from "./layouts/AuthLayout"
import Signup from "./pages/auth/Signup"
import PersistLogin from "./components/PersistLogin"
import ProtectedRoutes from "./components/ProtectedRoutes"
import GuestRoutes from "./components/GuestRoutes"

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <PersistLogin />,
        children: [
          {
            element: <ProtectedRoutes />,
            children: [
              {
                index: true,
                element: <Home />
              }
            ]
          }
        ]
      },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        element: <PersistLogin />,
        children: [
          {
            element: <GuestRoutes />,
            children: [
              {
                path: 'login',
                element: <Login />
              },
              {
                path: 'signup',
                element: <Signup />
              }
            ]
          }
        ]
      }
    ]
  }
])

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App