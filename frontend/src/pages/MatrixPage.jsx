import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config'

const MatrixInput = ({ matrix, onMatrixChange, rows, onRowsChange, cols, onColsChange, title }) => {
    const handleCellChange = (rowIndex, colIndex, value) => {
        const newMatrix = matrix.map((row, r) => 
            r === rowIndex ? row.map((cell, c) => c === colIndex ? value : cell) : row
        );
        onMatrixChange(newMatrix);
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="flex space-x-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600">Rows</label>
                    <input type="number" min="1" max="5" value={rows} onChange={e => onRowsChange(parseInt(e.target.value) || 1)} className="p-2 border rounded-md w-20"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600">Cols</label>
                    <input type="number" min="1" max="5" value={cols} onChange={e => onColsChange(parseInt(e.target.value) || 1)} className="p-2 border rounded-md w-20"/>
                </div>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {matrix.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <input 
                            key={`${rowIndex}-${colIndex}`}
                            type="number"
                            value={cell}
                            onChange={e => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="w-full p-2 text-center border rounded-md"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const MatrixResult = ({ matrix }) => (
    <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Result</h3>
        <div className="p-4 bg-gray-100 rounded-md border">
            {matrix.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center space-x-4">
                    {row.map((cell, colIndex) => (
                        <span key={colIndex} className="text-lg p-2 min-w-[50px] text-center">
                            {Number(cell.toFixed(4))}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    </div>
);


const MatrixPage = () => {
    const [rowsA, setRowsA] = useState(2);
    const [colsA, setColsA] = useState(2);
    const [matrixA, setMatrixA] = useState([['', ''], ['', '']]);

    const [rowsB, setRowsB] = useState(2);
    const [colsB, setColsB] = useState(2);
    const [matrixB, setMatrixB] = useState([['', ''], ['', '']]);

    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const createMatrix = (r, c) => Array.from({ length: r }, () => Array.from({ length: c }, () => ''));

    useEffect(() => { setMatrixA(createMatrix(rowsA, colsA)); }, [rowsA, colsA]);
    useEffect(() => { setMatrixB(createMatrix(rowsB, colsB)); }, [rowsB, colsB]);

    const performOperation = async (operation) => {
        setError('');
        setResult(null);

        // Basic validation
        if (matrixA.flat().some(c => c === '') || matrixB.flat().some(c => c === '')) {
            setError('Please fill all matrix cells before calculating.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/matrix-operation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ operation, matrixA, matrixB })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data.result);
            } else {
                setError(data.error || 'An error occurred.');
            }
        } catch (err) {
            setError('Failed to connect to the backend server.');
        }
    };

    return (
        <div className="animate-fade-in space-y-8">
            <h2 className="text-4xl font-bold text-center text-gray-800">Matrix Calculator</h2>
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <MatrixInput matrix={matrixA} onMatrixChange={setMatrixA} rows={rowsA} onRowsChange={setRowsA} cols={colsA} onColsChange={setColsA} title="Matrix A" />
                <MatrixInput matrix={matrixB} onMatrixChange={setMatrixB} rows={rowsB} onRowsChange={setRowsB} cols={colsB} onColsChange={setColsB} title="Matrix B" />
            </div>
            <div className="flex justify-center items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium">Operations:</h3>
                <button onClick={() => performOperation('add')} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-md hover:bg-blue-700 transition">A + B</button>
                <button onClick={() => performOperation('subtract')} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-md hover:bg-blue-700 transition">A - B</button>
                <button onClick={() => performOperation('multiply')} className="bg-blue-600 text-white font-bold py-2 px-5 rounded-md hover:bg-blue-700 transition">A * B</button>
            </div>
            <div className="mt-8 text-center">
                {error && <p className="text-red-500 text-lg font-semibold">{error}</p>}
                {result && <MatrixResult matrix={result} />}
            </div>
        </div>
    );
};

export default MatrixPage;
