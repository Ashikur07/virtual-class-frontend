import { useState, useEffect } from 'react';
import axios from 'axios';

const timeSlots = [
  "9:00 - 10:30",
  "10:30 - 12:00",
  "12:00 - 1:30",
  "2:00 - 4:00",
];

const StudentDailyView = () => {
  const currentSemester = '1st Year 1st Semester';
  const [todaysSchedule, setTodaysSchedule] = useState(null);
  const [confirmedClasses, setConfirmedClasses] = useState([]);
  const [currentDay, setCurrentDay] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const todayDate = new Date().toISOString().split("T")[0];
        
        // Get current day
        const dayIndex = new Date().getDay();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = days[dayIndex];
        setCurrentDay(today);

        // Fetch routine data
        const routineRes = await axios.get(`${BASE_URL}/routine`);
        const allRoutines = routineRes.data;
        
        // Find the routine for current semester and day
        const semesterRoutine = allRoutines.find(
          routine => routine.semester === currentSemester && routine.day === today
        );
        
        // Fetch confirmed classes for today
        const dailyRoutineRes = await axios.get(`${BASE_URL}/dailyRoutine`);
        const allConfirmedClasses = dailyRoutineRes.data;
        
        // Filter confirmed classes for today
        const todaysConfirmedClasses = allConfirmedClasses.filter(
          cls => cls.date === todayDate
        );
        
        setTodaysSchedule(semesterRoutine);
        setConfirmedClasses(todaysConfirmedClasses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL, currentSemester]);

  // Function to check if a class is confirmed
  const isClassConfirmed = (course, timeSlotIndex) => {
    const time = timeSlots[timeSlotIndex];
    return confirmedClasses.some(
      confirmedClass => 
        confirmedClass.course === course && 
        confirmedClass.time === time
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <p className="text-center text-gray-500">Loading schedule...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-blue-800 mb-2">Students Daily Schedule</h2>
      <p className="text-center text-gray-600 font-semibold mb-6">{currentSemester} - {currentDay}</p>

      <div className="space-y-4">
        {todaysSchedule && todaysSchedule.slots && todaysSchedule.slots.length > 0 ? (
          todaysSchedule.slots.map((course, index) => {
            const isConfirmed = isClassConfirmed(course, index);
            return (
              <div
                key={index}
                className={`relative p-4 rounded-xl border-l-4 overflow-hidden ${
                  isConfirmed
                    ? 'bg-green-50 border-green-500'
                    : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{course}</p>
                    <p className="text-sm font-medium text-blue-600">{timeSlots[index]}</p>
                  </div>
                  <div
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      isConfirmed
                        ? 'bg-green-200 text-green-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {isConfirmed ? 'CONFIRMED' : 'TENTATIVE'}
                  </div>
                </div>
                {!isConfirmed && (
                   <p className="text-xs text-yellow-700 mt-2">
                     This class is in the fixed routine but has not been confirmed by the teacher yet.
                   </p>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 p-4 bg-gray-100 rounded-lg">No classes are scheduled for today.</p>
        )}
      </div>
    </div>
  );
};

export default StudentDailyView;