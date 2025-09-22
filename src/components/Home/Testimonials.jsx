import React from 'react';

const Testimonials = () => {
    const reviews = [
        { name: "John Doe", text: "This system makes class management so easy!" },
        { name: "Sarah Lee", text: "As a student, I love how I never miss tasks now." },
      ];
    return (
        <section className="py-16 px-6 md:px-20 bg-white text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-12">What Users Say</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {reviews.map((r, idx) => (
          <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow">
            <p className="text-gray-700 italic mb-4">“{r.text}”</p>
            <h4 className="font-semibold">{r.name}</h4>
          </div>
        ))}
      </div>
    </section>
    );
};

export default Testimonials;