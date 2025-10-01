import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';
import { API_BASE_URL } from '../config'

const ParametricPlotterPage = () => {
    const chartRef = useRef(null);
    const [xExpr, setXExpr] = useState('3 * cos(t)');
    const [yExpr, setYExpr] = useState('3 * sin(t)');
    const [tMin, setTMin] = useState('0');
    const [tMax, setTMax] = useState('2*pi');
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const plotFunction = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/plot-parametric`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    x_expr: xExpr, 
                    y_expr: yExpr,
                    t_range: { min: tMin, max: tMax }
                })
            });
            const data = await response.json();
            if (response.ok) {
                setChartData({
                    datasets: [{
                        label: `Parametric Plot`,
                        data: data.plot_data,
                        borderColor: 'rgb(139, 92, 246)',
                        borderWidth: 2.5,
                        tension: 0.1,
                        pointRadius: 0,
                    }]
                });
            } else {
                setError(data.error || 'An error occurred.');
                setChartData(null);
            }
        } catch (err) {
            setError('Failed to connect to the backend server.');
            setChartData(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        plotFunction();
    }, []);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        scales: { 
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'X-axis' }, ticks: { callback: (val) => Number(val.toFixed(1)) } }, 
            y: { title: { display: true, text: 'Y-axis' }, ticks: { callback: (val) => Number(val.toFixed(1)) } } 
        },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Parametric Curve Plot', font: { size: 18 } },
            zoom: { pan: { enabled: true, mode: 'xy' }, zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' } }
        }
    };

    const handleDownload = () => { if (chartRef.current) { const link = document.createElement('a'); link.href = chartRef.current.toBase64Image('image/png', 1); link.download = 'parametric-plot.png'; link.click(); } };
    const resetZoom = () => { if (chartRef.current) { chartRef.current.resetZoom(); } };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-4xl font-bold text-center text-gray-800">Parametric Plotter</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <div className="p-6 bg-gray-50 rounded-lg border h-full space-y-4">
                    <div>
                        <label htmlFor="x-expr" className="block text-lg font-medium text-gray-700">X(t) =</label>
                        <input id="x-expr" type="text" value={xExpr} onChange={e => setXExpr(e.target.value)} className="w-full p-3 font-mono text-lg border rounded-md" />
                    </div>
                     <div>
                        <label htmlFor="y-expr" className="block text-lg font-medium text-gray-700">Y(t) =</label>
                        <input id="y-expr" type="text" value={yExpr} onChange={e => setYExpr(e.target.value)} className="w-full p-3 font-mono text-lg border rounded-md" />
                    </div>
                     <div className="flex items-center space-x-2">
                        <div className="flex-1">
                             <label htmlFor="t-min" className="block text-sm font-medium text-gray-700">t Min</label>
                             <input id="t-min" type="text" value={tMin} onChange={e => setTMin(e.target.value)} className="w-full p-2 font-mono border rounded-md" />
                        </div>
                         <div className="flex-1">
                             <label htmlFor="t-max" className="block text-sm font-medium text-gray-700">t Max</label>
                             <input id="t-max" type="text" value={tMax} onChange={e => setTMax(e.target.value)} className="w-full p-2 font-mono border rounded-md" />
                        </div>
                     </div>
                     <p className="text-xs text-gray-500">You can use `pi` for π (e.g., `2*pi`).</p>
                    <button onClick={plotFunction} disabled={isLoading} className="w-full bg-violet-600 text-white font-bold py-3 px-6 rounded-md hover:bg-violet-700 transition disabled:bg-gray-400 text-lg">
                        {isLoading ? 'Plotting...' : 'Plot Curve'}
                    </button>
                    {error && <p className="text-red-500 text-center pt-2 font-semibold">{error}</p>}
                </div>


                <div className="w-full lg:col-span-2">
                    <div className="flex justify-end items-center space-x-2 mb-2">
                        {chartData && <button onClick={resetZoom} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition">Reset Zoom</button>}
                        {chartData && <button onClick={handleDownload} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}
                    </div>
                    <div className="w-full h-[70vh] min-h-[500px] bg-white rounded-lg border p-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full text-gray-500">Loading Graph...</div>
                        ) : chartData ? (
                            <Line ref={chartRef} options={chartOptions} data={chartData} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Enter expressions and click "Plot" to begin.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParametricPlotterPage;
