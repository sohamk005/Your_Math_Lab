import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';
import { API_BASE_URL } from '../config'


const RoseCurveControls = ({ roseA, setRoseA, n, setN, d, setD, roseFunction, setRoseFunction, roseColor, setRoseColor }) => {
    const handleNumberInput = (setter, value) => {
        if (value === '') { setter(''); return; }
        const num = parseFloat(value);
        if (!isNaN(num)) { setter(num); }
    };

    return (
        <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg border h-full justify-center">
            <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Function</label>
                <div className="flex space-x-2">
                    <button onClick={() => setRoseFunction('cos')} className={`w-full py-2 rounded-md transition ${roseFunction === 'cos' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>cos</button>
                    <button onClick={() => setRoseFunction('sin')} className={`w-full py-2 rounded-md transition ${roseFunction === 'sin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>sin</button>
                </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="a-slider" className="block text-lg font-medium text-gray-700">Amplitude (a)</label>
                <div className="flex items-center space-x-2"><input id="a-slider" type="range" min="0.1" max="5" step="0.1" value={roseA} onChange={(e) => setRoseA(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/><input type="number" value={roseA} onChange={(e) => handleNumberInput(setRoseA, e.target.value)} className="w-24 p-1 border rounded-md"/></div>
            </div>
            <div className="space-y-2">
                <label htmlFor="n-slider" className="block text-lg font-medium text-gray-700">Numerator (n)</label>
                <div className="flex items-center space-x-2"><input id="n-slider" type="range" min="1" max="15" step="0.1" value={n} onChange={(e) => setN(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/><input type="number" value={n} onChange={(e) => handleNumberInput(setN, e.target.value)} className="w-24 p-1 border rounded-md"/></div>
            </div>
            <div className="space-y-2">
                <label htmlFor="d-slider" className="block text-lg font-medium text-gray-700">Denominator (d)</label>
                <div className="flex items-center space-x-2"><input id="d-slider" type="range" min="1" max="15" step="0.1" value={d} onChange={(e) => setD(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"/><input type="number" value={d} onChange={(e) => handleNumberInput(setD, e.target.value)} className="w-24 p-1 border rounded-md"/></div>
            </div>
            <div>
                <label htmlFor="color-picker" className="block text-lg font-medium text-gray-700">Curve Color</label>
                <input id="color-picker" type="color" value={roseColor} onChange={(e) => setRoseColor(e.target.value)} className="w-full h-10 p-1 border border-gray-300 rounded-md cursor-pointer"/>
            </div>
        </div>
    );
};

const RoseCurvePage = () => {

  const mainChartRef = useRef(null);
  const modalChartRef = useRef(null);
  
  const [roseA, setRoseA] = useState(1);
  const [n, setN] = useState(2);
  const [d, setD] = useState(5);
  const [roseColor, setRoseColor] = useState('#ef4444');
  const [roseFunction, setRoseFunction] = useState('cos');
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const k = n / d;
    const points = [];
    const step = 0.01;
    for (let theta = 0; theta < 2 * d * Math.PI; theta += step) {
      let r = roseFunction === 'cos' ? Math.cos(k * theta) : Math.sin(k * theta);
      r *= roseA;
      points.push({ x: r * Math.cos(theta), y: r * Math.sin(theta) });
    }
    setChartData({
      datasets: [{
        label: `r = ${roseA} * ${roseFunction}((${n}/${d})θ)`,
        data: points,
        borderColor: roseColor,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        showLine: true, pointRadius: 0, borderWidth: 2.5,
      }],
    });
  }, [roseA, n, d, roseColor, roseFunction]);

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { 
      legend: { position: 'top' }, 
      title: { display: true, text: 'Interactive Rose Curve', font: { size: 18 } },
      zoom: { pan: { enabled: true, mode: 'xy' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' } }
    },
    scales: {
      x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' }, grid: { color: '#f0f0f0' }, min: -roseA - 0.1, max: roseA + 0.1 },
      y: { title: { display: true, text: 'y' }, grid: { color: '#f0f0f0' }, min: -roseA - 0.1, max: roseA + 0.1 },
    },
    animation: { duration: 0 }
  };
  
  const handleDownload = (chartRef) => { 
    if (chartRef.current) { 
      const link = document.createElement('a'); 
      link.href = chartRef.current.toBase64Image('image/png', 1); 
      link.download = `rose-curve-${roseFunction}-a${roseA}-n${n}-d${d}.png`; 
      link.click(); 
    } 
  };
  const resetZoom = (chartRef) => { if (chartRef.current) { chartRef.current.resetZoom(); } };

  const controlProps = { roseA, setRoseA, n, setN, d, setD, roseFunction, setRoseFunction, roseColor, setRoseColor };

  return (
     <>
        <section className="py-6 animate-fade-in w-full bg-white p-8 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-semibold text-gray-700">Rose Curve Plotter</h2>
                    <p className="text-gray-600 mt-2 font-mono text-lg">Scroll to zoom, drag to pan</p>
                </div>
                <div className="flex space-x-2">

                    <button onClick={() => resetZoom(mainChartRef)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition">Reset Zoom</button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">Enlarge</button>
                    <button onClick={() => handleDownload(mainChartRef)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="w-full h-[60vh] lg:h-full min-h-[400px]">
                    {chartData && <Line ref={mainChartRef} options={chartOptions} data={chartData} />}
                </div>
                <div>
                    <RoseCurveControls {...controlProps} />
                </div>
            </div>
        </section>

        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-2xl w-full h-full flex flex-col p-4">
                    <div className="flex justify-between items-center mb-2 flex-shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold">Focus View: Rose Curve</h2>
                            <p className="text-gray-600 text-sm">Scroll to zoom, drag to pan</p>
                        </div>
                        <div>

                            <button onClick={() => resetZoom(modalChartRef)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>
                            <button onClick={() => handleDownload(modalChartRef)} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition mr-2">Download PNG</button>
                            <button onClick={() => setIsModalOpen(false)} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition">Close</button>
                        </div>
                    </div>
                    <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4 min-h-0">
                        <div className="lg:col-span-3 w-full h-full relative">
                            {chartData && <Line ref={modalChartRef} options={chartOptions} data={chartData} />}
                        </div>
                        <div className="overflow-y-auto">
                           <RoseCurveControls {...controlProps} />
                        </div>
                    </div>
                </div>
            </div>
        )}
     </>
  );
};

export default RoseCurvePage;

