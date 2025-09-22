import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { FaBook, FaCalendarAlt, FaPaperclip, FaUpload, FaLink, FaCommentDots, FaTimes, FaUserTie } from 'react-icons/fa';
import { AuthContext } from '../../AuthProvider/AuthProvider';
import swal from 'sweetalert';

const TaskList = () => {
    const { user } = useContext(AuthContext);

    // Component States
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [studentInfo, setStudentInfo] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form input states
    const [submissionLink, setSubmissionLink] = useState('');
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionComment, setSubmissionComment] = useState('');

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
                    axios.get(`http://localhost:5000/submitTask?studentEmail=${user.email}`)
                ]);

                const currentStudent = usersRes.data.find(dbUser => dbUser.email === user.email);
                if (currentStudent?.role === 'student') {
                    setStudentInfo(currentStudent);
                    const relevantTasks = tasksRes.data.filter(task =>
                        task.year === currentStudent.year && task.semester === currentStudent.semester
                    );
                    setTasks(relevantTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    setSubmissions(submissionsRes.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const uploadFileToImgBB = async (file) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=c9bf2d9693ce99cc5e188004c011fa03`, formData);
            return res.data.data.url;
        } catch (error) {
            console.error("File upload failed:", error);
            return null;
        }
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const fileUrl = await uploadFileToImgBB(submissionFile);

        const submissionData = {
            taskId: selectedTask._id,
            taskTitle: selectedTask.title,
            studentInfo: {
                name: studentInfo.name,
                email: studentInfo.email,
                roll: studentInfo.roll,
            },
            year: studentInfo.year,
            semester: studentInfo.semester,
            submissionLink,
            submissionFileUrl: fileUrl,
            submissionComment,
            submittedAt: new Date().toISOString(),
        };

        try {
            const response = await axios.post('http://localhost:5000/submitTask', submissionData);
            setSubmissions([...submissions, response.data]);
            swal("Success!", "Your assignment has been submitted.", "success");
            closeModal();
        } catch (error) {
            swal("Error!", "Failed to submit. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTask(null);
        setSubmissionLink('');
        setSubmissionFile(null);
        setSubmissionComment('');
    };

    const isTaskSubmitted = (taskId) => submissions.some(sub => sub.taskId === taskId);

    const formatDeadline = (dateString) => new Date(dateString).toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (isLoading) return <div className="text-center py-20 text-lg">Loading Your Tasks...</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Task Board</h1>
                {studentInfo && <p className="text-center text-xl text-blue-600 font-semibold mb-8">Tasks for: {studentInfo.year}, {studentInfo.semester}</p>}

                {tasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-white rounded-lg shadow-lg flex flex-col">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center text-sm text-blue-600 font-semibold"><FaBook className="mr-2" />{task.course}</div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">{task.title}</h2>
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <FaUserTie className="mr-2" />
                                        <span>Assigned by: {task.teacherFullName}</span>
                                    </div>
                                    <p className="text-gray-600 text-base mb-4">{task.description}</p>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t space-y-3">
                                    <div className="flex items-center text-red-600 font-semibold"><FaCalendarAlt className="mr-2" />Deadline: {formatDeadline(task.deadline)}</div>
                                    {task.fileUrl && <a href={task.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center w-full justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"><FaPaperclip className="mr-2" />View Attachment</a>}
                                    {isTaskSubmitted(task._id) ? (
                                        <button disabled className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg cursor-not-allowed">Submitted</button>
                                    ) : (
                                        <button onClick={() => openModal(task)} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Submit Assignment</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-md"><h2 className="text-2xl font-semibold">No Tasks Found</h2><p className="text-gray-500 mt-2">No tasks have been assigned for you yet.</p></div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Submit: {selectedTask?.title}</h2>
                            <button onClick={closeModal}><FaTimes className="text-2xl text-gray-500 hover:text-gray-800" /></button>
                        </div>
                        <form onSubmit={handleSubmission} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1"><FaLink className="inline mr-2" />Submission Link</label>
                                <input type="url" placeholder="https://docs.google.com/..." onChange={e => setSubmissionLink(e.target.value)} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"><FaUpload className="inline mr-2" />Upload File</label>
                                <input type="file" onChange={e => setSubmissionFile(e.target.files[0])} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1"><FaCommentDots className="inline mr-2" />Comments</label>
                                <textarea placeholder="Any comments for your teacher?" rows="3" onChange={e => setSubmissionComment(e.target.value)} className="w-full p-2 border rounded-lg"></textarea>
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                                {isSubmitting ? 'Submitting...' : 'Confirm Submission'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;