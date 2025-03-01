import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DocumentUpload from "./pages/DocumentUpload"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<DocumentUpload />} />
      </Routes>
    </Router>
  )
}

export default App

