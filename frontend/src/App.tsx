import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './shared/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function App() {
    const { currentUser } = useAuth()

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    element={
                        <Layout
                            isAuthenticated={currentUser !== null}
                        />
                    }
                >
                    <Route path="/" element={<LoginPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App