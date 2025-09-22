import React from 'react';

const Hero = () => {
  return (
    <div>
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 md:px-20 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Welcome to Virtual-Class Representative System
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
          Manage routines, tasks, and class activities seamlessly. Designed for
          students, teachers, and class reps to stay connected and organized.
        </p>
        <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:scale-105 transition">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Hero;