import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaUserGraduate, FaCalendarCheck, FaLink, FaPaperclip, FaComment, FaChevronDown, FaFilter, FaTimesCircle } from 'react-icons/fa';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { yearOptions, semesterOptions } from '../../../Data/courseData'; // Path might need adjustment

const ViewSubmissions = () => {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTask, setActiveTask] = useState(null);

    // State to hold all of teacher's tasks combined with their submissions
    const [tasksWithSubmissions, setTasksWithSubmissions] = useState([]);
    
    // State for filtered tasks that will be rendered
    const [filteredTasks, setFilteredTasks] = useState([]);

    // State for filters
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');

    // Step 1: Fetch all data and combine it
    useEffect(() => {
        if (!user?.email) {
            setIsLoading(false);
            return;
        }
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [usersRes, tasksRes, submissionsRes] = await Promise.all([
                    axios.get('http://localhost:5000/users'),
                    axios.get('http://localhost:5000/task'),
                    axios.get('http://localhost:5000/submitTask')
                ]);

                const currentTeacher = usersRes.data.find(dbUser => dbUser.email === user.email);
                if (!currentTeacher || currentTeacher.role !== 'teacher') return;

                const myTasks = tasksRes.data.filter(task => task.teacherShortName === currentTeacher.teacherShortName);
                const allSubmissions = submissionsRes.data;

                // Combine tasks with their respective submissions
                const combinedData = myTasks.map(task => {
                    const submissionsForThisTask = allSubmissions.filter(sub => sub.taskId === task._id);
                    return {
                        ...task, // All task details
                        submissions: submissionsForThisTask // An array of submissions for this task
                    };
                });
                
                // Sort by creation date, newest task first
                combinedData.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

                setTasksWithSubmissions(combinedData);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Step 2: Apply filters when selection changes
    useEffect(() => {
        let filtered = tasksWithSubmissions;

        if (selectedYear) {
            filtered = filtered.filter(task => task.year === selectedYear);
        }
        if (selectedSemester) {
            filtered = filtered.filter(task => task.semester === selectedSemester);
        }

        setFilteredTasks(filtered);
    }, [selectedYear, selectedSemester, tasksWithSubmissions]);


    const toggleAccordion = (taskId) => setActiveTask(activeTask === taskId ? null : taskId);
    const formatDate = (dateString) => new Date(dateString).toLocaleString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (isLoading) return <div className="text-center py-20 text-lg font-semibold">Loading Submissions...</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Student Submissions</h1>
                <p className="text-center text-gray-500 mb-8">Review assignments submitted for your tasks.</p>

                {/* Filter Section */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center text-gray-600 font-semibold"><FaFilter className="mr-2" /><span>Filter by:</span></div>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-full sm:w-auto p-2 border rounded-lg">
                        <option value="">All Years</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} className="w-full sm:w-auto p-2 border rounded-lg">
                        <option value="">All Semesters</option>
                        {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {(selectedYear || selectedSemester) && (
                        <button onClick={() => { setSelectedYear(''); setSelectedSemester(''); }} className="flex items-center text-red-500 hover:text-red-700">
                            <FaTimesCircle className="mr-1" /> Clear
                        </button>
                    )}
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTasks.map((task) => (
                             <div key={task._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                 <button onClick={() => toggleAccordion(task._id)} className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50">
                                     <div>
                                        <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
                                        <p className="text-sm text-gray-500">{task.course} - {task.year}</p>
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <span className={`${task.submissions.length > 0 ? 'bg-blue-500' : 'bg-gray-400'} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                                            {task.submissions.length} Submissions
                                         </span>
                                         <FaChevronDown className={`transform transition-transform ${activeTask === task._id ? 'rotate-180' : ''}`} />
                                     </div>
                                 </button>
                                 
                                 {activeTask === task._id && task.submissions.length > 0 && (
                                     <div className="px-6 pb-6 pt-2 border-t">
                                         {task.submissions.map((sub) => (
                                             <div key={sub._id} className="border-b last:border-b-0 py-4">
                                                 <div className="flex items-center mb-2"><FaUserGraduate className="text-blue-600 mr-3" /><p className="font-bold text-lg">{sub.studentInfo.name}</p><p className="text-gray-500 ml-3">(Roll: {sub.studentInfo.roll})</p></div>
                                                 <div className="flex items-center text-sm text-gray-600 mb-3 ml-1"><FaCalendarCheck className="mr-2" />Submitted on: {formatDate(sub.submittedAt)}</div>
                                                 {sub.submissionComment && <div className="flex text-gray-700 mb-3 bg-gray-100 p-3 rounded-lg"><FaComment className="mr-3 mt-1 flex-shrink-0" /><p><em>{sub.submissionComment}</em></p></div>}
                                                 <div className="flex flex-wrap gap-3">
                                                     {sub.submissionLink && <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer" className="flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-200"><FaLink className="mr-2" /> View Link</a>}
                                                     {sub.submissionFileUrl && <a href={sub.submissionFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-200"><FaPaperclip className="mr-2" /> View Attachment</a>}
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700">No Tasks or Submissions Found</h2>
                        <p className="text-gray-500 mt-2">No tasks match your current filter criteria, or no tasks have been created yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewSubmissions;