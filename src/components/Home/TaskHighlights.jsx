import React from 'react';

const TaskHighlights = () => {
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Stay on Top of Tasks</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-10">
          Never miss an assignment or class activity. Get instant notifications and track your progress easily.
        </p>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-2">Assignments</h3>
            <p className="text-gray-600">Manage upcoming deadlines with ease.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg w-full md:w-1/3">
            <h3 className="text-xl font-semibold mb-2">Reminders</h3>
            <p className="text-gray-600">Receive alerts for important updates.</p>
          </div>
        </div>
      </section>
    );
};

export default TaskHighlights;