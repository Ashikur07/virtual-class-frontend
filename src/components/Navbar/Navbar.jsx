import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import swal from "sweetalert";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [taskCount] = useState(1);
    const [isRoutineOpen, setIsRoutineOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const routineRef = useRef(null);

    useEffect(() => {
        if (user?.email) {
            const fetchUserRole = async () => {
                try {
                    const response = await fetch("http://localhost:5000/users");
                    const allUsers = await response.json();
                    const currentUser = allUsers.find(
                        (dbUser) => dbUser.email === user.email
                    );
                    if (currentUser) {
                        setUserRole(currentUser.role);
                    }
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                }
            };
            fetchUserRole();
        } else {
            setUserRole(null);
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (routineRef.current && !routineRef.current.contains(event.target)) {
                setIsRoutineOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                swal({
                    title: "Logout Successful!",
                    icon: "success",
                    timer: 2000,
                });
            })
            .catch(() => {});
    };

    const dailyRoutinePath =
        userRole === "teacher"
            ? "/routine/TeacherDailyView"
            : "/routine/StudentDailyView";

    const taskPath = userRole === "teacher" ? "/addTask" : "/taskList";
    const taskLabel = userRole === "teacher" ? "Add Task" : "Task";

    return (
        <div className="bg-white shadow-md fixed w-full z-50 px-6 md:px-20 py-3 flex justify-between items-center">
            {/* Left side */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2">
                    <h1 className="text-xl md:text-2xl font-bold text-blue-700">
                        Virtual-Class
                    </h1>
                </Link>
            </div>

            {/* Center */}
            {user && userRole && (
                <div className="hidden md:flex items-center gap-6">
                    {/* Routine dropdown */}
                    <div className="relative" ref={routineRef}>
                        <button
                            onClick={() => setIsRoutineOpen(!isRoutineOpen)}
                            className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-xl transition flex items-center gap-1"
                        >
                            Routine
                            <svg
                                className={`w-4 h-4 transition-transform ${
                                    isRoutineOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isRoutineOpen && (
                            <div className="absolute left-0 top-full bg-white shadow-lg rounded-lg mt-2 w-44 z-50">
                                <ul className="py-2 text-gray-700 font-medium">
                                    <li>
                                        <NavLink
                                            to="/routine/fixedRoutine"
                                            className={({ isActive }) =>
                                                `block px-4 py-2 hover:bg-blue-50 transition ${
                                                    isActive
                                                        ? "bg-blue-100 text-blue-600 font-semibold"
                                                        : ""
                                                }`
                                            }
                                            onClick={() => setIsRoutineOpen(false)}
                                        >
                                            Fixed Routine
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            to={dailyRoutinePath}
                                            className={({ isActive }) =>
                                                `block px-4 py-2 hover:bg-blue-50 transition ${
                                                    isActive
                                                        ? "bg-blue-100 text-blue-600 font-semibold"
                                                        : ""
                                                }`
                                            }
                                            onClick={() => setIsRoutineOpen(false)}
                                        >
                                            Daily View
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Task button */}
                    <div className="relative">
                        <NavLink
                            to={taskPath}
                            className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-green-600 hover:text-white rounded-xl transition"
                        >
                            {taskLabel}
                        </NavLink>
                        {userRole !== "teacher" && taskCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {taskCount}
                            </span>
                        )}
                    </div>

                    {/* ✅ Only for teacher */}
                    {userRole === "teacher" && (
                        <>
                            <NavLink
                                to="/viewSubmissions"
                                className="px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-purple-600 hover:text-white rounded-xl transition"
                            >
                                View Task Submission
                            </NavLink>
                        
                        </>
                    )}
                </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-4">
                {!user ? (
                    <>
                        <NavLink to="/login">
                            <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
                                Login
                            </button>
                        </NavLink>
                        <NavLink to="/register">
                            <button className="px-5 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white font-semibold rounded-full shadow-md hover:scale-105 transition">
                                Register
                            </button>
                        </NavLink>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link to="/profile">
                            <img
                                src={
                                    user?.photoURL ||
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                alt="user"
                                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md cursor-pointer"
                            />
                        </Link>
                        <button
                            onClick={handleLogOut}
                            className="px-5 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
