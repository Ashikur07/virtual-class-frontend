import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { allCourses, yearOptions, semesterOptions } from '../../../Data/courseData';
import { AuthContext } from '../../AuthProvider/AuthProvider';

const AddTask = () => {
    const { user } = useContext(AuthContext);
    const [teacherInfo, setTeacherInfo] = useState(null);

    // Form fields state
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [course, setCourse] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [file, setFile] = useState(null);
    const [filteredCourses, setFilteredCourses] = useState(allCourses);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch logged-in teacher's info
    useEffect(() => {
        if (user?.email) {
            axios.get('http://localhost:5000/users')
                .then(res => {
                    const currentTeacher = res.data.find(dbUser => dbUser.email === user.email);
                    if (currentTeacher?.role === 'teacher') {
                        setTeacherInfo(currentTeacher);
                    }
                });
        }
    }, [user]);

    // Filter courses based on selection
    useEffect(() => {
        let filtered = allCourses;
        if (year) {
            filtered = filtered.filter(c => c.year === year);
        }
        if (semester) {
            filtered = filtered.filter(c => c.semester === semester);
        }
        setFilteredCourses(filtered);
        setCourse('');
    }, [year, semester]);

    const uploadFile = async () => {
        if (!file) return null;
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', 'c9bf2d9693ce99cc5e188004c011fa03');
        try {
            const res = await axios.post('https://api.imgbb.com/1/upload', formData);
            return res.data.data.url;
        } catch (error) {
            swal("Upload Failed!", "Could not upload the attached file.", "error");
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!teacherInfo) {
            swal("Error!", "Could not verify teacher information. Please log in again.", "error");
            return;
        }
        setIsSubmitting(true);
        const fileUrl = await uploadFile();
        const taskData = {
            year,
            semester,
            course,
            title,
            description,
            deadline,
            fileUrl,
            createdAt: new Date().toISOString(),
            // Add teacher's info to the task
            teacherShortName: teacherInfo.teacherShortName,
            teacherFullName: teacherInfo.teacherFullName,
        };
        try {
            await axios.post('http://localhost:5000/task', taskData);
            swal("Success!", "New task has been created successfully.", "success");
            e.target.reset();
            // Reset all states
            setYear(''); setSemester(''); setCourse(''); setTitle(''); setDescription(''); setDeadline(''); setFile(null);
        } catch (error) {
            swal("Error!", "Failed to create the task.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Create a New Task</h1>
                <p className="text-center text-gray-500 mb-8">Fill in the details below to assign a new task.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (rest of the form JSX is unchanged) ... */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                             <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" required>
                                 <option value="">Select Year</option>
                                 {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                             <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" required>
                                 <option value="">Select Semester</option>
                                 {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                         </div>
                         <div>
                             <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                             <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" required>
                                 <option value="">Select Course</option>
                                 {filteredCourses.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                             </select>
                         </div>
                    </div>
                    <div className="pt-6 border-t">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Assignment 1: Chapter 5" className="w-full p-2.5 border border-gray-300 rounded-lg" required />
                            </div>
                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" required />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Task Description</label>
                                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="5" placeholder="Provide detailed instructions..." className="w-full p-2.5 border border-gray-300 rounded-lg"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Attach File (Optional)</label>
                                <input id="file" type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                            </div>
                         </div>
                    </div>
                    <div className="pt-6 border-t text-center">
                        <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-12 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400">
                            {isSubmitting ? 'Submitting...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;