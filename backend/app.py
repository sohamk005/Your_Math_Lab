from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from typing import List, Union
import sympy as sp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://your-math-lab.netlify.app"}})

@app.route('/api/solve', methods=['POST', 'OPTIONS'])
def solve():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    eq_type = data.get('type')

    if not eq_type:
        return jsonify(error="Equation type not specified"), 400

    try:
        if eq_type == 'quadratic':
            a = float(data.get('a', 0))
            b = float(data.get('b', 0))
            c = float(data.get('c', 0))
            if a == 0:
                return jsonify(error="Coefficient 'a' cannot be zero for a quadratic equation."), 400
            
            coeffs = [a, b, c]
            solutions = np.roots(coeffs)
            
        elif eq_type == 'cubic':
            a = float(data.get('a', 0))
            b = float(data.get('b', 0))
            c = float(data.get('c', 0))
            d = float(data.get('d', 0))
            if a == 0:
                return jsonify(error="Coefficient 'a' cannot be zero for a cubic equation."), 400
            
            coeffs = [a, b, c, d]
            solutions = np.roots(coeffs)
        
        else:
            return jsonify(error="Invalid equation type provided"), 400

        roots = []
        for r in solutions:
            if abs(r.imag) > 1e-9:
                sign = "+" if r.imag > 0 else "-"
                roots.append(f"{round(r.real, 4)} {sign} {round(abs(r.imag), 4)}i")
            else:
                roots.append(round(r.real, 4))
        
        return jsonify(roots=roots)
            
    except (ValueError, TypeError):
        return jsonify(error="Invalid input. Please ensure all coefficients are numbers."), 400

# general polynomial solver
@app.route('/api/solve-polynomial', methods=['POST', 'OPTIONS'])
def solve_polynomial():
    
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    coefficients = data.get('coefficients')

    if not coefficients or not isinstance(coefficients, list) or len(coefficients) < 2:
        return jsonify(error="A list of at least two coefficients is required."), 400
    
    try:
        # Convert all coefficients to floats
        coeffs = [float(c) for c in coefficients]

        if coeffs[0] == 0:
            return jsonify(error="The leading coefficient cannot be zero."), 400

        solutions = np.roots(coeffs)
        
        roots = []
        for r in solutions:
            if abs(r.imag) > 1e-9:
                sign = "+" if r.imag > 0 else "-"
                roots.append(f"{round(r.real, 4)} {sign} {round(abs(r.imag), 4)}i")
            else:
                roots.append(round(r.real, 4))
                
        return jsonify(roots=roots)

    except (ValueError, TypeError):
        return jsonify(error="Invalid input. Ensure all coefficients are valid numbers."), 400

@app.route('/api/matrix-operation', methods=['POST', 'OPTIONS'])
def matrix_operation():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    operation = data.get('operation')
    matrix_a = data.get('matrixA')
    matrix_b = data.get('matrixB')

    if not all([operation, matrix_a, matrix_b]):
        return jsonify(error="Missing operation or matrices."), 400

    try:
        mat_a = np.array(matrix_a, dtype=float)
        mat_b = np.array(matrix_b, dtype=float)
        
        if operation == 'add':
            if mat_a.shape != mat_b.shape:
                return jsonify(error="Matrices must have the same dimensions for addition."), 400
            result = np.add(mat_a, mat_b)
        elif operation == 'subtract':
            if mat_a.shape != mat_b.shape:
                return jsonify(error="Matrices must have the same dimensions for subtraction."), 400
            result = np.subtract(mat_a, mat_b)
        elif operation == 'multiply':
            if mat_a.shape[1] != mat_b.shape[0]:
                return jsonify(error="Number of columns in Matrix A must equal number of rows in Matrix B for multiplication."), 400
            result = np.dot(mat_a, mat_b)
        else:
            return jsonify(error="Invalid operation specified."), 400
        
        # Convert result back to a standard Python list to be sent as JSON
        return jsonify(result=result.tolist())

    except (ValueError, TypeError):
        return jsonify(error="Invalid matrix data. Ensure all entries are numbers."), 400
    
@app.route('/api/calculus', methods=['POST', 'OPTIONS'])
def calculus_operation():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    expression_str = data.get('expression')
    operation = data.get('operation')
    # Get the x-axis range from the request, with a default of -10 to 10
    x_range = data.get('x_range', {'min': -10, 'max': 10})
    
    if not all([expression_str, operation]):
        return jsonify(error="Missing expression or operation."), 400

    try:
        x_min = float(x_range.get('min', -10))
        x_max = float(x_range.get('max', 10))

        x = sp.symbols('x')
        original_expr = sp.sympify(expression_str, locals={'x': x})
        
        result_expr = None
        if operation == 'differentiate':
            result_expr = sp.diff(original_expr, x)
        elif operation == 'integrate':
            result_expr = sp.integrate(original_expr, x)
        else:
            return jsonify(error="Invalid operation."), 400

        original_func = sp.lambdify(x, original_expr, 'numpy')
        result_func = sp.lambdify(x, result_expr, 'numpy')
        
        x_vals = np.linspace(x_min, x_max, 200)
        original_y = original_func(x_vals)
        result_y = result_func(x_vals)

        plot_data = {
            'original': [{'x': float(xv), 'y': float(yv)} for xv, yv in zip(x_vals, original_y) if np.isfinite(yv)],
            'result': [{'x': float(xv), 'y': float(yv)} for xv, yv in zip(x_vals, result_y) if np.isfinite(yv)],
        }
        
        return jsonify({
            'result_expression': str(result_expr),
            'plot_data': plot_data
        })

    except (sp.SympifyError, TypeError, SyntaxError):
        return jsonify(error="Invalid mathematical expression."), 400
    except Exception as e:
        return jsonify(error=f"An unexpected error occurred: {str(e)}"), 500

@app.route('/api/plot-general', methods=['POST', 'OPTIONS'])
def plot_general_function():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    expression_str = data.get('expression')
    x_range = data.get('x_range', {'min': -10, 'max': 10})
    
    if not expression_str:
        return jsonify(error="Missing expression."), 400

    try:
        x_min = float(x_range.get('min', -10))
        x_max = float(x_range.get('max', 10))

        x = sp.symbols('x')
        allowed_functions = {
            'sin': sp.sin, 'cos': sp.cos, 'tan': sp.tan,
            'asin': sp.asin, 'acos': sp.acos, 'atan': sp.atan,
            'exp': sp.exp, 'log': sp.log, 'sqrt': sp.sqrt
        }
        
        expr = sp.sympify(expression_str, locals={'x': x, **allowed_functions})
        func = sp.lambdify(x, expr, 'numpy')
        
        x_vals = np.linspace(x_min, x_max, 500)
        y_vals = func(x_vals)

        # ASYMPTOTE DETECTION ---
        sign_changes = np.where(np.sign(y_vals[:-1]) != np.sign(y_vals[1:]))[0] + 1
        
        huge_jumps = np.where(np.abs(np.diff(y_vals)) > 1000)[0] + 1
        
        asymptote_indices = np.intersect1d(sign_changes, huge_jumps)
        
        y_vals[asymptote_indices] = np.nan
        
        plot_data = []
        for xv, yv in zip(x_vals, y_vals):
            if np.isnan(yv) or not np.isfinite(yv):
                plot_data.append({'x': float(xv), 'y': None}) # Use None for breaks
            else:
                plot_data.append({'x': float(xv), 'y': float(yv)})
        
        return jsonify({'plot_data': plot_data})

    except (sp.SympifyError, TypeError, SyntaxError):
        return jsonify(error="Invalid mathematical expression."), 400
    except Exception as e:
        return jsonify(error="An unexpected error occurred during calculation."), 500

@app.route('/api/plot-parametric', methods=['POST', 'OPTIONS'])
def plot_parametric():
    if request.method == 'OPTIONS':
        return jsonify(success=True), 200
    if not request.is_json:
        return jsonify(error="Invalid request: Content-Type must be application/json"), 415

    data = request.get_json()
    x_expr_str = data.get('x_expr')
    y_expr_str = data.get('y_expr')
    t_range = data.get('t_range', {'min': '0', 'max': '2*pi'}) # Default to strings

    if not all([x_expr_str, y_expr_str]):
        return jsonify(error="Missing X(t) or Y(t) expression."), 400

    try:
        t = sp.symbols('t')
        allowed_functions = {
            'sin': sp.sin, 'cos': sp.cos, 'tan': sp.tan,
            'exp': sp.exp, 'log': sp.log, 'sqrt': sp.sqrt,
            'pi': sp.pi
        }

        t_min_expr = sp.sympify(t_range.get('min', '0'), locals=allowed_functions)
        t_max_expr = sp.sympify(t_range.get('max', '2*pi'), locals=allowed_functions)
        
        t_min = float(t_min_expr.evalf())
        t_max = float(t_max_expr.evalf())

        x_expr = sp.sympify(x_expr_str, locals={'t': t, **allowed_functions})
        y_expr = sp.sympify(y_expr_str, locals={'t': t, **allowed_functions})

        x_func = sp.lambdify(t, x_expr, 'numpy')
        y_func = sp.lambdify(t, y_expr, 'numpy')

        t_vals = np.linspace(t_min, t_max, 500)
        x_vals = x_func(t_vals)
        y_vals = y_func(t_vals)
        
        plot_data = []
        for xv, yv in zip(x_vals, y_vals):
            if np.isfinite(xv) and np.isfinite(yv):
                plot_data.append({'x': float(xv), 'y': float(yv)})
            else:
                plot_data.append({'x': None, 'y': None})

        return jsonify({'plot_data': plot_data})

    except (sp.SympifyError, TypeError, SyntaxError):
        return jsonify(error="Invalid mathematical expression."), 400
    except Exception:
        return jsonify(error="An unexpected error occurred during calculation."), 500


