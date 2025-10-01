import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, linkTo, icon }) => (
    <Link to={linkTo} className="block p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex items-center mb-3">
            <span className="text-3xl mr-4">{icon}</span>
            <h4 className="text-2xl font-bold text-gray-800">{title}</h4>
        </div>
        <p className="text-gray-600">{description}</p>
    </Link>
);

const HomePage = () => (
  <div className="space-y-16 animate-fade-in">
    <section className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 py-20 rounded-lg">
      <h2 className="text-5xl font-extrabold text-gray-800">Welcome to Your Math Lab</h2>
      <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">Your comprehensive, interactive toolkit for exploring the world of mathematics. Solve, plot, and visualize complex concepts with ease.</p>
      <div className="mt-8">
        <img src="https://placehold.co/700x350/dbeafe/1e3a8a?text=Interactive+Mathematics" alt="Mathematical Visualizations" className="rounded-lg shadow-2xl mx-auto"/>
      </div>
    </section>
    
    <section>
      <h3 className="text-4xl font-bold text-gray-700 text-center mb-10">Explore Our Tools</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <FeatureCard 
          title="Equation Solvers"
          description="From quadratics to high-degree polynomials, find real and complex roots in an instant. Our backend does the heavy lifting for you."
          linkTo="/solvers"
          icon="🧮"
        />
        <FeatureCard 
          title="Curve Plotters"
          description="Discover the beauty of mathematics. Create stunning Rose Curves and intricate Parametric plots with real-time, interactive controls."
          linkTo="/curves"
          icon="🌹"
        />
        <FeatureCard 
          title="Matrix Calculator"
          description="Perform essential linear algebra operations. Add, subtract, and multiply matrices with a simple and intuitive interface."
          linkTo="/matrix"
          icon="🔢"
        />
        <FeatureCard 
          title="Calculus Toolkit"
          description="Unravel the principles of calculus. Symbolically differentiate and integrate functions, and visualize the results on an infinite canvas."
          linkTo="/calculus"
          icon="📈"
        />
      </div>
    </section>
  </div>
);

export default HomePage;

