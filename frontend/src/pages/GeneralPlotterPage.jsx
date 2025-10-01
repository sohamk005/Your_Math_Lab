import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';

const GeneralPlotterPage = () => {
    const chartRef = useRef(null);
    const [expression, setExpression] = useState('sin(x) / x');
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState({ min: -10, max: 10 });

    const plotFunction = async (newView = { min: -10, max: 10 }) => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://127.0.0.1:5000/api/plot-general', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression, x_range: newView })
            });
            const data = await response.json();
            if (response.ok) {
                setChartData({
                    datasets: [{
                        label: `y = ${expression}`,
                        data: data.plot_data,
                        borderColor: 'rgb(217, 70, 239)',
                        borderWidth: 2.5,
                        tension: 0.1,
                        pointRadius: 0,
                    }]
                });
            } else {
                setError(data.error || 'An error occurred.');
                setChartData(null); // Clear chart on error
            }
        } catch (err) {
            setError('Failed to connect to the backend server.');
            setChartData(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Re-fetch data when view changes
    useEffect(() => {
        plotFunction(view);
    }, [view]);

    const handlePlotClick = () => {
        // Reset the view and trigger a plot
        setView({ min: -10, max: 10 });
        plotFunction({ min: -10, max: 10 });
    };

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'y' } } },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'General Function Plot', font: { size: 18 } },
            zoom: {
                pan: { enabled: true, mode: 'xy', onPanComplete: ({chart}) => setView({ min: chart.scales.x.min, max: chart.scales.x.max }) },
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy', onZoomComplete: ({chart}) => setView({ min: chart.scales.x.min, max: chart.scales.x.max }) }
            }
        }
    };

    const handleDownload = () => { if (chartRef.current) { const link = document.createElement('a'); link.href = chartRef.current.toBase64Image('image/png', 1); link.download = `plot-${expression.replace(/[* /]/g, '_')}.png`; link.click(); } };
    const resetZoom = () => { if (chartRef.current) { chartRef.current.resetZoom(); setView({ min: -10, max: 10 }); } };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-4xl font-bold text-center text-gray-800">General Function Plotter</h2>
            <div className="p-6 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label htmlFor="expression-input" className="block text-lg font-medium text-gray-700">Enter a function, y = f(x):</label>
                        <p className="text-sm text-gray-500 mb-2">Use Python syntax (e.g., `x**2`, `sin(x)`).</p>
                        <input id="expression-input" type="text" value={expression} onChange={e => setExpression(e.target.value)} className="w-full p-3 font-mono text-lg border rounded-md" placeholder="e.g., exp(-x**2)"/>
                    </div>
                    <button onClick={handlePlotClick} disabled={isLoading} className="w-full bg-fuchsia-600 text-white font-bold py-3 px-6 rounded-md hover:bg-fuchsia-700 transition disabled:bg-gray-400 text-lg">
                        {isLoading ? 'Plotting...' : 'Plot Function'}
                    </button>
                </div>
                 {error && <p className="text-red-500 text-center mt-4 font-semibold">{error}</p>}
            </div>
            
            <div className="w-full bg-white p-4 rounded-lg border">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-gray-600">Scroll to zoom, drag to pan</p>
                    <div>
                        {chartData && <button onClick={resetZoom} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>}
                        {chartData && <button onClick={handleDownload} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}
                    </div>
                </div>
                <div className="w-full h-[60vh] min-h-[500px]">
                    {isLoading ? (
                         <div className="flex items-center justify-center h-full text-gray-500">Loading Graph...</div>
                    ) : chartData ? (
                        <Line ref={chartRef} options={chartOptions} data={chartData} />
                    ) : (
                         <div className="flex items-center justify-center h-full text-gray-400">Enter a function and click "Plot" to begin.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GeneralPlotterPage;