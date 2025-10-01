import React from 'react';

const BlogPage = () => {
  const blogPosts = [
    {
      title: "The Math Behind Rose Curves",
      summary: "Ever wondered how those beautiful flower-like patterns are generated? In this article, we dive deep into the polar equation r = a * cos(kθ) and explore the fascinating relationship between the parameters 'n' and 'd'.",
      imageUrl: "https://placehold.co/600x400/fecaca/b91c1c?text=Rose+Curve+Math",
      link: "https://medium.com/", // <-- REPLACE WITH YOUR ACTUAL ARTICLE LINK
    },
    {
      title: "Solving Polynomials: From Newton to NumPy",
      summary: "Finding the roots of a high-degree polynomial is a classic computational challenge. We'll explore the history of polynomial solvers and see how modern libraries like NumPy make it incredibly efficient.",
      imageUrl: "https://placehold.co/600x400/d1fae5/047857?text=Polynomial+Roots",
      link: "https://medium.com/", // <-- REPLACE WITH YOUR ACTUAL ARTICLE LINK
    },
     {
      title: "Building an Interactive Math App with React & Flask",
      summary: "A behind-the-scenes look at how this very website was built! I'll walk you through the architecture of a modern web app, from the React frontend to the Python Flask API backend.",
      imageUrl: "https://placehold.co/600x400/cffafe/0e7490?text=React+Flask+Code",
      link: "https://medium.com/", // <-- REPLACE WITH YOUR ACTUAL ARTICLE LINK
    },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Articles & Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 flex-grow">{post.summary}</p>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="mt-4 bg-gray-800 text-white font-bold py-2 px-4 rounded-md hover:bg-black transition text-center group-hover:bg-blue-600">
                Read Full Article →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;

