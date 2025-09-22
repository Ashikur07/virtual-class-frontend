import React from 'react';

const Features = () => {
    const features = [
        { title: "Routine Management", desc: "Easily track fixed & daily routines.", icon: "📅" },
        { title: "Task & Assignment", desc: "Get notified and manage tasks efficiently.", icon: "✅" },
        { title: "Attendance", desc: "Keep attendance records with one click.", icon: "👥" },
        { title: "Class Notifications", desc: "Instant alerts for updates & deadlines.", icon: "🔔" },
      ];
      
    return (
        <section className="py-16 px-6 md:px-20 bg-gray-50 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    );
};

export default Features;