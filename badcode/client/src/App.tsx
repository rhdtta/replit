import { LandingPage } from './components/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CodingPage } from './components/CodingPage'


function App() {
  return (
    <div className='main-container'>
      <BrowserRouter>
        <Routes>
            <Route path="/coding" element={<CodingPage />} />
            <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
