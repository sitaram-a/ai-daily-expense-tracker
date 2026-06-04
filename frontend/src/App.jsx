import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route

        path="/dashboard"

        element={

        <PrivateRoute>

        <Dashboard/>

        </PrivateRoute>

        }

        />

        <Route
          path="/expense"
          element={<AddExpense />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;