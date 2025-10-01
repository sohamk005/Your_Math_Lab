import React from 'react';

const HomePage = ({ setActivePage }) => (
  <div className="space-y-12 animate-fade-in">
    <section className="text-center bg-blue-50 py-16 rounded-lg">
      <h2 className="text-5xl font-bold text-gray-800">Welcome to Your Math Lab</h2>
      <p className="text-xl text-gray-600 mt-4 max-w-2xl mx-auto">Your one-stop destination for solving complex equations and visualizing beautiful mathematical curves in an interactive way.</p>
      <div className="mt-8">
        <img src="https://placehold.co/600x300/e0e7ff/3730a3?text=Mathematical+Visualizations" alt="Mathematical Visualizations" className="rounded-lg shadow-lg mx-auto"/>
      </div>
       <button onClick={() => setActivePage('solvers')} className="mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition text-lg">
        Get Started
      </button>
    </section>
    
    <section>
      <h3 className="text-3xl font-semibold text-gray-700 text-center mb-8">Our Tools</h3>
      <div className="grid md:grid-cols-2 gap-8 text-left">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
          <h4 className="text-2xl font-bold mb-2">Equation Solvers</h4>
          <p className="text-gray-600">Tackle everything from simple quadratics to high-degree polynomials. Our powerful backend provides instant, accurate roots, and we plot the results for you to see the function's behavior.</p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition">
          <h4 className="text-2xl font-bold mb-2">Interactive Curve Plotters</h4>
          <p className="text-gray-600">Discover the beauty of mathematics. Use sliders and real-time controls to manipulate parameters and create stunning Rose Curves. Perfect for students, teachers, and enthusiasts alike.</p>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;