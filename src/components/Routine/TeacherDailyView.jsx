import { useState, useEffect, useMemo, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../AuthProvider/AuthProvider";

export const timeSlots = [
  "9:00 - 10:30",
  "10:30 - 12:00",
  "12:00 - 1:30",
  "2:00 - 4:00",
];

const TeacherDailyView = () => {
  const { user } = useContext(AuthContext);

  const [currentTeacherId, setCurrentTeacherId] = useState("");
  const [routine, setRoutine] = useState([]);
  const [confirmedClasses, setConfirmedClasses] = useState([]);
  const [currentDay, setCurrentDay] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State for the "Add Class" modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    semester: "",
    slotIndex: "",
    courseName: "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";
  const todayDate = new Date().toISOString().split("T")[0];

  // Fetch Teacher ID using logged-in user's email
  useEffect(() => {
    const fetchTeacherId = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`${BASE_URL}/users`);
        const loggedInTeacher = res.data.find(
          (u) => u.email === user.email && u.role === "teacher"
        );
        if (loggedInTeacher) {
          setCurrentTeacherId(loggedInTeacher.teacherShortName);
        }
      } catch (error) {
        console.error("Error fetching teacher info:", error);
      }
    };
    fetchTeacherId();
  }, [user?.email, BASE_URL]);

  // Create a reusable function to fetch all data
  const fetchData = async () => {
    if (!currentTeacherId) return;
    setIsLoading(true);
    try {
      const [routineRes, dailyRoutineRes] = await Promise.all([
        axios.get(`${BASE_URL}/routine`),
        axios.get(`${BASE_URL}/dailyRoutine`),
      ]);

      setRoutine(routineRes.data);

      const todaysConfirmed = dailyRoutineRes.data.filter(
        (cls) => cls.date === todayDate && cls.teacherId === currentTeacherId
      );
      setConfirmedClasses(todaysConfirmed); // Store the full confirmed class objects

      const dayIndex = new Date().getDay();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      setCurrentDay(days[dayIndex]);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Routine + Confirmed Classes on component mount and when teacher ID changes
  useEffect(() => {
    fetchData();
  }, [currentTeacherId]); // Depends only on currentTeacherId now

  // Get classes from the base routine for today
  const routineClasses = useMemo(() => {
    if (!currentDay || !routine.length || !currentTeacherId) return [];
    const teacherClasses = [];
    routine.forEach((schedule) => {
      if (schedule.day === currentDay) {
        schedule.slots.forEach((slot, index) => {
          if (slot.includes(`(${currentTeacherId})`)) {
            teacherClasses.push({
              id: `${schedule.semester}-${slot}-${index}`,
              course: slot,
              semester: schedule.semester,
              teacherId: currentTeacherId,
              time: timeSlots[index] || `Slot ${index + 1}`,
              date: todayDate,
            });
          }
        });
      }
    });
    return teacherClasses;
  }, [currentDay, routine, currentTeacherId, todayDate]);
  
  // Combine routine classes and extra confirmed classes for display
  const allTodaysClasses = useMemo(() => {
    const combined = [...routineClasses];
    const routineClassIds = new Set(routineClasses.map(c => c.id));
    
    // Add confirmed classes that are NOT in the base routine
    confirmedClasses.forEach(confirmedClass => {
        if (!routineClassIds.has(confirmedClass.id)) {
            combined.push(confirmedClass);
        }
    });
    
    return combined;
  }, [routineClasses, confirmedClasses]);


  // Get unique semesters for the modal dropdown
  const uniqueSemesters = useMemo(() => [...new Set(routine.map(r => r.semester))], [routine]);

  // This function is for confirming classes that are ALREADY in the weekly routine
  const handleConfirmClass = async (classInfo) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to add ${classInfo.course} to your daily routine?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${BASE_URL}/dailyRoutine`, classInfo);
          // Refetch data to update the view
          fetchData();
          Swal.fire("Class Added!", `${classInfo.course} has been added.`, "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to add class. Try again.", "error");
        }
      }
    });
  };

  // *** NEW LOGIC: This function now adds a NEW one-off class for TODAY ***
  const handleAddNewClass = async (e) => {
    e.preventDefault();
    const { semester, slotIndex, courseName } = newClass;
    if (!semester || !slotIndex || !courseName) {
      Swal.fire("Incomplete", "Please fill all fields.", "warning");
      return;
    }

    // Construct the class object, same as a confirmed class
    const course = `${courseName.trim()}(${currentTeacherId})`;
    const newClassData = {
      id: `${semester}-${course}-${slotIndex}`,
      course: course,
      semester: semester,
      teacherId: currentTeacherId,
      time: timeSlots[slotIndex],
      date: todayDate,
    };

    try {
      // POST to /dailyRoutine to add it for today
      await axios.post(`${BASE_URL}/dailyRoutine`, newClassData);
      
      Swal.fire("Success", "Extra class has been added for today!", "success");
      setIsModalOpen(false);
      setNewClass({ semester: "", slotIndex: "", courseName: "" }); // Reset form
      
      // Refetch all data to show the newly added class in the list
      fetchData();

    } catch (error) {
      console.error("Error adding new class:", error);
      Swal.fire("Error", "Could not add the new class.", "error");
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading classes...</div>;
  }

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Teacher's Daily Agenda</h2>
            <p className="text-gray-600 font-semibold">Today is {currentDay}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Add Extra Class
          </button>
        </div>

        <div className="space-y-4">
          {allTodaysClasses.length > 0 ? (
            allTodaysClasses.map((classInfo) => {
              // Check if this class's ID is in the list of confirmed classes for today
              const isConfirmed = confirmedClasses.some(c => c.id === classInfo.id);
              return (
                <div
                  key={classInfo.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    isConfirmed ? "bg-green-100 border-l-4 border-green-500" : "bg-gray-50 border-l-4 border-gray-300"
                  }`}
                >
                  <div>
                    <p className="font-bold text-lg text-gray-800">{classInfo.course}</p>
                    <p className="text-sm text-gray-600">{classInfo.semester}</p>
                    <p className="text-sm font-medium text-blue-600">{classInfo.time}</p>
                  </div>
                  <button
                    onClick={() => handleConfirmClass(classInfo)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-transform duration-200 ${
                      isConfirmed
                        ? "bg-white text-green-600 border border-green-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                    }`}
                    disabled={isConfirmed}
                  >
                    {isConfirmed ? "✓ Confirmed" : "Confirm Class"}
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 p-4 bg-gray-100 rounded-lg">
              You have no classes scheduled for today.
            </p>
          )}
        </div>
      </div>

      {/* Add New Class Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-center">Add Extra Class for Today</h3>
            <form onSubmit={handleAddNewClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <select name="semester" value={newClass.semester} onChange={(e) => setNewClass({...newClass, semester: e.target.value})} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select Semester</option>
                  {uniqueSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time Slot</label>
                <select name="slotIndex" value={newClass.slotIndex} onChange={(e) => setNewClass({...newClass, slotIndex: e.target.value})} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Select Time Slot</option>
                  {timeSlots.map((ts, index) => <option key={ts} value={index}>{ts}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Name (e.g., CSE-101)</label>
                <input type="text" name="courseName" value={newClass.courseName} onChange={(e) => setNewClass({...newClass, courseName: e.target.value})} placeholder="Course Name" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherDailyView;