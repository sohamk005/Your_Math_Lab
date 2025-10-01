import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import Hammer from 'hammerjs';

const EquationSolversPage = () => {
    const quadChartRef = useRef(null);
    const cubicChartRef = useRef(null);
    const polyChartRef = useRef(null);
    
    // All state variables remain the same
    const [quadA, setQuadA] = useState(''); const [quadB, setQuadB] = useState(''); const [quadC, setQuadC] = useState(''); const [quadResult, setQuadResult] = useState(''); const [quadError, setQuadError] = useState(''); const [quadChartData, setQuadChartData] = useState(null);
    const [cubicA, setCubicA] = useState(''); const [cubicB, setCubicB] = useState(''); const [cubicC, setCubicC] = useState(''); const [cubicD, setCubicD] = useState(''); const [cubicResult, setCubicResult] = useState(''); const [cubicError, setCubicError] = useState(''); const [cubicChartData, setCubicChartData] = useState(null);
    const [polyDegree, setPolyDegree] = useState(4); const [polyCoeffs, setPolyCoeffs] = useState(Array.from({ length: 5 }, () => '')); const [polyResult, setPolyResult] = useState(''); const [polyError, setPolyError] = useState(''); const [polyChartData, setPolyChartData] = useState(null);

    // This logic remains the same
    useEffect(() => { setPolyCoeffs(Array.from({ length: parseInt(polyDegree) || 1 }, () => '')); }, [polyDegree]);

    const solveEquation = async (type) => {
        const errorSetter = { quadratic: setQuadError, cubic: setCubicError, polynomial: setPolyError }[type];
        const resultSetter = { quadratic: setQuadResult, cubic: setCubicResult, polynomial: setPolyResult }[type];
        const viewSetter = { quadratic: setQuadView, cubic: setCubicView, polynomial: setPolyView }[type];
        
        errorSetter(''); resultSetter('');
        viewSetter({ min: -10, max: 10 });

        let endpoint = 'http://127.0.0.1:5000/api/solve';
        let body = {};

        if (type === 'quadratic') { body = { type, a: quadA, b: quadB, c: quadC }; } 
        else if (type === 'cubic') { body = { type, a: cubicA, b: cubicB, c: cubicC, d: cubicD }; } 
        else {
            if (polyCoeffs.some(c => c === '')) { errorSetter('All coefficient fields must be filled.'); return; }
            endpoint = 'http://127.0.0.1:5000/api/solve-polynomial';
            body = { coefficients: polyCoeffs };
        }

        try {
            const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await response.json();
            if (response.ok) { resultSetter(`Roots: ${data.roots.join(', ')}`); } 
            else { errorSetter(data.error || 'An error occurred.'); }
        } catch (error) { errorSetter('Failed to connect to backend.'); }
    };
    
    const [quadView, setQuadView] = useState({ min: -10, max: 10 });
    const [cubicView, setCubicView] = useState({ min: -10, max: 10 });
    const [polyView, setPolyView] = useState({ min: -10, max: 10 });

    useEffect(() => { if (quadA !== '' && quadB !== '' && quadC !== '') plotGraph('quadratic'); }, [quadA, quadB, quadC, quadView]);
    useEffect(() => { if (cubicA !== '' && cubicB !== '' && cubicC !== '' && cubicD !== '') plotGraph('cubic'); }, [cubicA, cubicB, cubicC, cubicD, cubicView]);
    useEffect(() => { if (polyCoeffs.every(c => c !== '')) plotGraph('polynomial'); }, [polyCoeffs, polyView]);

    const plotGraph = (type) => {
        const points = [];
        const view = { quadratic: quadView, cubic: cubicView, polynomial: polyView }[type];
        const chartSetter = { quadratic: setQuadChartData, cubic: setCubicChartData, polynomial: setPolyChartData }[type];
        const coeffs = { quadratic: [quadA, quadB, quadC], cubic: [cubicA, cubicB, cubicC, cubicD], polynomial: polyCoeffs }[type];
        const numCoeffs = coeffs.map(c => parseFloat(c || 0));

        const range = view.max - view.min;
        const step = range / 100;

        for (let x = view.min; x <= view.max; x += step) {
            let y = 0;
            for (let i = 0; i < numCoeffs.length; i++) { y += numCoeffs[i] * Math.pow(x, numCoeffs.length - 1 - i); }
            points.push({ x, y });
        }
        
        chartSetter({
            datasets: [{ 
                label: `${type.charAt(0).toUpperCase() + type.slice(1)} Graph`, 
                data: points, 
                borderColor: {quadratic: 'rgb(75, 192, 192)', cubic: 'rgb(153, 102, 255)', polynomial: 'rgb(234, 179, 8)'}[type],
                backgroundColor: 'rgba(255, 255, 255, 1)',
                tension: 0.1, borderWidth: 2
            }],
        });
    };
    
    const chartOptions = (title, onViewChange) => ({ 
        responsive: true, maintainAspectRatio: false,
        plugins: { 
            legend: { position: 'top' }, 
            title: { display: true, text: title, font: { size: 18 } },
            zoom: {
                pan: { enabled: true, mode: 'xy', onPanComplete: ({chart}) => onViewChange({ min: chart.scales.x.min, max: chart.scales.x.max }) },
                zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy', onZoomComplete: ({chart}) => onViewChange({ min: chart.scales.x.min, max: chart.scales.x.max }) }
            }
        },
        scales: { x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x-axis' } }, y: { title: { display: true, text: 'y-axis' } } }
    });

    const handleDownload = (chartRef, filename) => { if (chartRef.current) { const link = document.createElement('a'); link.href = chartRef.current.toBase64Image('image/png', 1); link.download = `${filename}.png`; link.click(); } };
    const resetZoom = (chartRef, viewSetter) => { if (chartRef.current) { chartRef.current.resetZoom(); viewSetter({ min: -10, max: 10 }); } };

    return (
        <div className="divide-y divide-gray-200 animate-fade-in">
             <section id="poly-solver" className="py-6">
                <div className="flex justify-between items-center">
                    <div><h2 className="text-3xl font-semibold text-gray-700">General Polynomial Solver</h2><p className="text-gray-600 mt-2">Scroll to zoom, drag to pan</p></div>
                    <div>{polyChartData && <button onClick={() => resetZoom(polyChartRef, setPolyView)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>}{polyChartData && <button onClick={() => handleDownload(polyChartRef, 'polynomial-graph')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}</div>
                </div>
                <div className="my-4 flex items-center space-x-2"><label className="font-medium">Degree:</label><input type="number" min="1" max="10" value={polyDegree} onChange={e => setPolyDegree(parseInt(e.target.value) || 1)} className="p-2 w-20 border rounded-md"/></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">{polyCoeffs.map((coeff, index) => (<input key={index} type="number" placeholder={`x^${polyDegree - index}`} value={coeff} onChange={e => { const newC = [...polyCoeffs]; newC[index] = e.target.value; setPolyCoeffs(newC); }} className="form-input p-2 border rounded-md"/> ))}</div>
                <button onClick={() => solveEquation('polynomial')} className="mt-4 bg-yellow-500 text-white font-bold py-3 px-6 rounded-md hover:bg-yellow-600 transition">Solve & Plot</button>
                <div className="mt-4 text-center h-8">{polyError && <p className="text-red-500">{polyError}</p>}{polyResult && <p className="text-green-600 font-bold">{polyResult}</p>}</div>
                {polyChartData && <div className="w-full h-96 mt-4"><Line ref={polyChartRef} options={chartOptions('Polynomial Graph', setPolyView)} data={polyChartData}/></div>}
            </section>
            
            <section id="quadratic-solver" className="py-6">
                <div className="flex justify-between items-center">
                    <div><h2 className="text-3xl font-semibold text-gray-700">Quadratic Solver</h2><p className="text-gray-600 mt-2">Scroll to zoom, drag to pan</p></div>
                    <div>{quadChartData && <button onClick={() => resetZoom(quadChartRef, setQuadView)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>}{quadChartData && <button onClick={() => handleDownload(quadChartRef, 'quadratic-graph')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}</div>
                </div>
                <p className="text-gray-600 mt-2 mb-4">ax² + bx + c = 0</p>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                    {/* --- FIX IS HERE --- */}
                    <input type="number" value={quadA} onChange={(e) => setQuadA(e.target.value)} placeholder="a (x²)" className="form-input p-3 border rounded-md"/>
                    <input type="number" value={quadB} onChange={(e) => setQuadB(e.target.value)} placeholder="b (x)" className="form-input p-3 border rounded-md"/>
                    <input type="number" value={quadC} onChange={(e) => setQuadC(e.target.value)} placeholder="c" className="form-input p-3 border rounded-md"/>
                    <button onClick={() => solveEquation('quadratic')} className="sm:col-span-1 bg-cyan-600 text-white font-bold py-3 px-4 rounded-md hover:bg-cyan-700 transition">Solve & Plot</button>
                </div>
                <div className="mt-4 text-center h-8">{quadError && <p className="text-red-500">{quadError}</p>}{quadResult && <p className="text-green-600 font-bold">{quadResult}</p>}</div>
                {quadChartData && <div className="w-full h-96 mt-4"><Line ref={quadChartRef} options={chartOptions('Quadratic Graph', setQuadView)} data={quadChartData}/></div>}
            </section>
            
            <section id="cubic-solver" className="py-6">
                 <div className="flex justify-between items-center">
                     <div><h2 className="text-3xl font-semibold text-gray-700">Cubic Solver</h2><p className="text-gray-600 mt-2">Scroll to zoom, drag to pan</p></div>
                    <div>{cubicChartData && <button onClick={() => resetZoom(cubicChartRef, setCubicView)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition mr-2">Reset Zoom</button>}{cubicChartData && <button onClick={() => handleDownload(cubicChartRef, 'cubic-graph')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition">Download PNG</button>}</div>
                </div>
                <p className="text-gray-600 mt-2 mb-4">ax³ + bx² + cx + d = 0</p>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                    {/* --- FIX IS HERE --- */}
                    <input type="number" value={cubicA} onChange={(e) => setCubicA(e.target.value)} placeholder="a (x³)" className="form-input p-3 border rounded-md"/>
                    <input type="number" value={cubicB} onChange={(e) => setCubicB(e.target.value)} placeholder="b (x²)" className="form-input p-3 border rounded-md"/>
                    <input type="number" value={cubicC} onChange={(e) => setCubicC(e.target.value)} placeholder="c (x)" className="form-input p-3 border rounded-md"/>
                    <input type="number" value={cubicD} onChange={(e) => setCubicD(e.target.value)} placeholder="d" className="form-input p-3 border rounded-md"/>
                    <button onClick={() => solveEquation('cubic')} className="sm:col-span-1 bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 transition">Solve & Plot</button>
                </div>
                <div className="mt-4 text-center h-8">{cubicError && <p className="text-red-500">{cubicError}</p>}{cubicResult && <p className="text-green-600 font-bold">{cubicResult}</p>}</div>
                {cubicChartData && <div className="w-full h-96 mt-4"><Line ref={cubicChartRef} options={chartOptions('Cubic Graph', setCubicView)} data={cubicChartData}/></div>}
            </section>
        </div>
    );
};

export default EquationSolversPage;

