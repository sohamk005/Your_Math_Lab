import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// Imported Components and Pages
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EquationSolversPage from './pages/EquationSolversPage';
import RoseCurvePage from './pages/RoseCurvePage';
import BlogPage from './pages/BlogPage';
import MatrixPage from './pages/MatrixPage';
import CalculusPage from './pages/CalculusPage';
import GeneralPlotterPage from './pages/GeneralPlotterPage';
import ParametricPlotterPage from './pages/ParametricPlotterPage';

// ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin);

function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/solvers' element={<EquationSolversPage />} />
        <Route path='/curves' element={<RoseCurvePage />} />
        <Route path='/matrix' element={<MatrixPage />} />
        <Route path='/calculus' element={<CalculusPage />} />
        <Route path='/generalplotter' element={<GeneralPlotterPage />} />
        <Route path='/parameterplotter' element={<ParametricPlotterPage />} />
        <Route path='/blog' element={<BlogPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

