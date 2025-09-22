import React from 'react';

const RoutineOverview = () => {
    return (
        <section className="py-16 px-6 md:px-20 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Routine Overview</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="p-6 bg-blue-50 rounded-xl shadow w-full md:w-1/3 text-center">
          <h3 className="text-xl font-semibold mb-3">Fixed Routine</h3>
          <p className="text-gray-600">View your semester’s complete schedule.</p>
        </div>
        <div className="p-6 bg-green-50 rounded-xl shadow w-full md:w-1/3 text-center">
          <h3 className="text-xl font-semibold mb-3">Daily Routine</h3>
          <p className="text-gray-600">Check what’s on for today’s classes.</p>
        </div>
      </div>
    </section>
    );
};

export default RoutineOverview;