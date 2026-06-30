import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import PrivacyPolicy from './pages/PrivacyPolicy'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  )
}

export default App