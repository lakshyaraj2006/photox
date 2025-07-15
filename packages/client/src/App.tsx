import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RootLayout } from "./layouts/RootLayout"
import Home from "./pages/Home"
import Login from "./pages/auth/Login"
import { AuthLayout } from "./layouts/AuthLayout"
import Signup from "./pages/auth/Signup"

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
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
])

function App() {
  return (
    <RouterProvider router={router}/>
  )
}

export default App