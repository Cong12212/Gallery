import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ImageComponent from './Components/ImageComponent';
import ImageDetail from './Components/ImageDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ImageComponent />} />
        <Route path="/photos/:id" element={<ImageDetail />} /> {/* Sử dụng element thay cho component */}
      </Routes>
    </Router>
  );
}

export default App;
