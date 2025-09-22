"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const teachersList = [
  { short: "MMR", full: "Prof. Dr. Md. Mahbubur Rahman" },
  { short: "PCB", full: "Prof. Dr. Paresh Chandra Barman" },
  { short: "TKJ", full: "Prof. Dr. Tapan Kumar Jodder" },
  { short: "ZI", full: "Prof. Dr. Md. Zahidul Islam" },
  { short: "SI", full: "Dr. Md. Shariful Islam" },
  { short: "AR", full: "Prof. Md. Ashek Raihan Mahmud" },
  { short: "SM", full: "Prof. Dr. Md. Sipaon Miah" },
  { short: "AH", full: "Prof. Dr. Md. Alamgir Hossain" },
  { short: "JU", full: "Md. Jashim Uddin" },
  { short: "KTA", full: "Khandaker Takdir Ahmed" },
  { short: "KMA", full: "Kazi Mowdud Ahmed" },
  { short: "MMH", full: "Prof. Dr. Mohammad Mominul Haque" },
  { short: "MZH", full: "Prof. Dr. Mohammad Zulfiquar Hossain" },
  { short: "KMS", full: "K M Sharf Uddin" },
  { short: "FTT", full: "Mr. Farha Tanzim Titil" },
  { short: "MAI", full: "Dr. Md. Ariful Islam" },
  { short: "THM", full: "Prof. Dr. Md. Zahidul Islam (HUM)" },
];

const FixedRoutine = () => {
  const [routineData, setRoutineData] = useState({});
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Routine from API
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const res = await axios.get("http://localhost:5000/routine");
        const data = res.data;

        // Group by semester
        const grouped = data.reduce((acc, item) => {
          if (!acc[item.semester]) acc[item.semester] = [];
          acc[item.semester].push({
            day: item.day,
            slots: item.slots,
          });
          return acc;
        }, {});

        setRoutineData(grouped);
        setSelectedSemester(Object.keys(grouped)[0] || ""); // প্রথম semester ডিফল্ট হিসেবে সিলেক্ট হবে
      } catch (err) {
        console.error("Error fetching routine:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, []);

  if (loading) {
    return <p className="text-center text-blue-600">Loading routine...</p>;
  }

  return (
    <div className="p-6 md:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Dropdown + Routine */}
        <div className="lg:col-span-3">
          <div className="flex justify-center mb-8">
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(routineData).map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto">
            <h2 className="text-2xl font-bold text-center text-blue-700 py-4">
              {selectedSemester} Routine
            </h2>
            <table className="table-auto w-full text-sm md:text-base border-collapse">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="border px-4 py-2">Day</th>
                  <th className="border px-4 py-2">9:00 - 10:30</th>
                  <th className="border px-4 py-2">10:30 - 12:00</th>
                  <th className="border px-4 py-2">12:00 - 1:30</th>
                  <th className="border px-4 py-2">2:00 - 4:00</th>
                </tr>
              </thead>
              <tbody>
                {routineData[selectedSemester]?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2 font-semibold">{row.day}</td>
                    {row.slots.map((slot, i) => (
                      <td key={i} className="border px-4 py-2">{slot}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teachers */}
        <div className="bg-gray-50 rounded-2xl shadow-xl border border-gray-100 p-4 max-h-[500px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Teachers</h3>
          <ul className="space-y-2">
            {teachersList.map((teacher, index) => (
              <li
                key={teacher.short}
                className="text-gray-700 bg-white rounded-xl p-2 shadow-sm flex items-start gap-2"
              >
                <span className="font-bold text-blue-600">{index + 1}.</span>
                <span>
                  <span className="font-semibold">{teacher.short}:</span> {teacher.full}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FixedRoutine;
