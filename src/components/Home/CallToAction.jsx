import React from 'react';

const CallToAction = () => {
    return (
        <section className="py-16 px-6 md:px-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-center rounded-t-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Simplify Your Class?</h2>
        <p className="max-w-2xl mx-auto mb-8">
          Join Virtual-Class today and experience effortless routine & task management.
        </p>
        <button className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-md hover:scale-105 transition">
          Get Started
        </button>
      </section>
    );
};

export default CallToAction;