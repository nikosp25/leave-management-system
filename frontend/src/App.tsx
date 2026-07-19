import { BrowserRouter, Route, Routes } from 'react-router'
import { useAuth } from './hooks/useAuth'
import Layout from './shared/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ApplyLeavePage from './pages/ApplyLeavePage'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './components/dashboard/shared/DashboardLayout'

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
                    <Route
                        path="/"
                        element={<LoginPage />}
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            element={<DashboardLayout />}
                        >
                            <Route
                                path="/dashboard"
                                element={<DashboardPage />}
                            />

                            <Route
                                path="/dashboard/apply"
                                element={<ApplyLeavePage />}
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App