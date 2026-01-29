import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { RequireAuth } from './auth/RequireAuth'
import AuthCallback from './pages/AuthCallback'
import HomePage from './pages/HomePage'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import ProtectedPage from './pages/ProtectedPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import PortalPage from './pages/PortalPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/reset" element={<ResetPasswordPage />} />
          <Route
            path="/portal"
            element={
              <RequireAuth>
                <PortalPage />
              </RequireAuth>
            }
          />
          <Route
            path="/protected"
            element={
              <RequireAuth>
                <ProtectedPage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
