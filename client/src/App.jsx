import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CalendarForm from "./components/CalendarForm";
import AdminPanel from "./components/AdminPanel";
import Login from "./components/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CalendarForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;