import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';

const CalculusPage = () => {
    const chartRef = useRef(null);
    const [expression, setExpression] = useState('x**2');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- NEW STATE ---
    const [view, setView] = useState({ min: -10, max: 10 });
    const [currentTask, setCurrentTask] = useState(null); // To remember the last operation

    const performOperation = async (operation, newView = { min: -10, max: 10 }) => {
        setIsLoading(true);
        // Only clear results if it's a new operation from the button
        if (newView.min === -10 && newView.max === 10) {
            setError('');
            setResult(null);
            setCurrentTask({ expression, operation });
            setView(newView);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/calculus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression, operation, x_range: newView })
            });
            const data = await response.json();
            if (response.ok) {
                // Only set the text result on the initial calculation
                if (newView.min === -10 && newView.max === 10) {
                    setResult({ operation, expression: data.result_expression });
                }
                setChartData({
                    datasets: [
                        { label: `f(x) = ${expression}`, data: data.plot_data.original, borderColor: 'rgb(59, 130, 246)', borderWidth: 2, tension: 0.1, pointRadius: 0 },
                        { label: `${operation === 'differentiate' ? "f'(x)" : "∫f(x)dx"} = ${data.result_expression}`, data: data.plot_data.result, borderColor: 'rgb(239, 68, 68)', borderWidth: 3, borderDash: [5, 5], tension: 0.1, pointRadius: 0 }
                    ]
                });
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the backend server.');
        } finally {
            setIsLoading(false);
        }
    };

    // Re-fetch data when view changes after an initial operation
    useEffect(() => {
        if (currentTask) {
            performOperation(currentTask.operation, view);
        }
    }, [view]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } }, y: { title: { display: true, text: 'y' } } },
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Function Plot', font: { size: 18 } },
            zoom: {
                pan: { enabled: true, mode: 'xy', onPanComplete: ({chart}) => setView({ min: chart.scales.x.min, max: chart.scales.x.max }) },
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy', onZoomComplete: ({chart}) => setView({ min: chart.scales.x.min, max: chart.scales.x.max }) }
            }
        }
    };
    
    const handleDownload = () => { if (chartRef.current) { const link = document.createElement('a'); link.href = chartRef.current.toBase64Image('image/png', 1); link.download = 'calculus-graph.png'; link.click(); } };
    const resetZoom = () => { if (chartRef.current) { chartRef.current.resetZoom(); setView({ min: -10, max: 10 }); } };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-4xl font-bold text-center text-gray-800">Calculus Toolkit</h2>

            {/* --- CHANGE IS HERE: Changed to a 3-column grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* --- CHANGE IS HERE: This column now spans 2 of the 3 grid columns on large screens --- */}
                <div className="w-full lg:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                         <p className="text-gray-600">Scroll to zoom, drag to pan</p>
                        <div>
                            {chartData && <button onClick={resetZoom} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>}
                            {chartData && <button onClick={handleDownload} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}
                        </div>
                    </div>
                    <div className="w-full h-[60vh] min-h-[400px] bg-white rounded-lg border p-2">
                        {chartData ? (
                            <Line ref={chartRef} options={chartOptions} data={chartData} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">Plot a function to see the graph.</div>
                        )}
                    </div>
                </div>

                {/* --- This column takes up the remaining 1/3 of the space --- */}
                <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-lg border h-full">
                        <label htmlFor="expression-input" className="block text-lg font-medium text-gray-700">Enter a function of x:</label>
                        <p className="text-sm text-gray-500 mb-2">Use Python syntax (e.g., `x**2`).</p>
                        <input id="expression-input" type="text" value={expression} onChange={e => setExpression(e.target.value)} className="w-full p-3 font-mono text-lg border rounded-md" placeholder="e.g., x**3 - 2*x + 1"/>
                        <div className="flex items-center space-x-4 mt-4">
                            <button onClick={() => performOperation('differentiate')} disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition disabled:bg-gray-400">{isLoading ? 'Calculating...' : 'Differentiate'}</button>
                            <button onClick={() => performOperation('integrate')} disabled={isLoading} className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-md hover:bg-orange-600 transition disabled:bg-gray-400">{isLoading ? 'Calculating...' : 'Integrate'}</button>
                        </div>
                        <div className="text-center mt-6 min-h-[6rem] p-4 bg-white rounded-lg border">
                             <h3 className="text-xl font-semibold text-gray-700 mb-2">Result</h3>
                            {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}
                            {isLoading && <p className="text-blue-600 text-lg">Calculating...</p>}
                            {result && (
                                <div className="text-xl">
                                    <span className="font-semibold">{result.operation === 'differentiate' ? 'Derivative:' : 'Integral:'}</span>
                                    <p className="font-mono p-2 bg-gray-100 inline-block rounded-md mt-2">{result.expression}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculusPage;

