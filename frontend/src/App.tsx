import { BrowserRouter, Route, Routes } from 'react-router'
import { useAuth } from './hooks/useAuth'
import Layout from './shared/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ApplyLeavePage from './pages/ApplyLeavePage'
import ManageLeavePage from './pages/ManageLeavePage'
import EmployeeSearchPage from './pages/EmployeeSearchPage'
import ManageUsersPage from './pages/ManageUsersPage'
import CreateUserPage from './pages/CreateUserPage'
import UpdateUserPage from './pages/UpdateUserPage'
import ProtectedRoute from './routes/ProtectedRoute'
import CapabilityRoute from './routes/CapabilityRoute'
import DashboardLayout from './components/dashboard/layout/DashboardLayout'

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

                            <Route
                                path="/dashboard/manage-leave"
                                element={<ManageLeavePage />}
                            />

                            <Route
                                path="/dashboard/employees"
                                element={<EmployeeSearchPage />}
                            />

                            <Route
                                element={
                                    <CapabilityRoute
                                        requiredCapability="MANAGE_USERS"
                                    />
                                }
                            >
                                <Route
                                    path="/dashboard/manage-users"
                                    element={<ManageUsersPage />}
                                />

                                <Route
                                    path="/dashboard/manage-users/create"
                                    element={<CreateUserPage />}
                                />

                                <Route
                                    path="/dashboard/manage-users/:uuid/edit"
                                    element={<UpdateUserPage />}
                                />
                            </Route>
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App