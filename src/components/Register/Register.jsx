import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../../AuthProvider/AuthProvider';
import { updateProfile } from 'firebase/auth';
import { AiOutlineEye, AiOutlineCloudUpload } from "react-icons/ai";
import { FaRegEyeSlash } from "react-icons/fa";
import swal from 'sweetalert';

// Teacher list remains the same
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
  { short: "THM", full: "Prof. Dr. Md. Zahidul Islam (HUM)" }
];

// Options for student dropdowns
const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const semesterOptions = ["1st Semester", "2nd Semester"];

// Generate session options dynamically
const sessionOptions = [];
for (let i = 2018; i <= 2024; i++) {
    sessionOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
}


const Register = () => {
    useEffect(() => {
        document.title = 'Register';
    }, []);

    const navigate = useNavigate();
    const { createNewUser, setUser } = useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('student');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [session, setSession] = useState('');
    const [roll, setRoll] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadPhotoToImgbb = async () => {
        if (!photoFile) return null;
        
        const formData = new FormData();
        formData.append('image', photoFile);
        formData.append('key', 'c9bf2d9693ce99cc5e188004c011fa03'); // Use your own key in a real project
        
        try {
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleRegisterWithEmail = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const name = e.target.name.value;
        
        if (password.length < 6) {
            swal({ icon: "warning", title: "Password should be at least 6 characters", timer: 2000 });
            return;
        }
        if (!/[A-Z]/.test(password)) {
            swal({ icon: "warning", title: "Password needs at least one uppercase letter", timer: 2000 });
            return;
        }
        if (!/[a-z]/.test(password)) {
            swal({ icon: "warning", title: "Password needs at least one lowercase letter", timer: 2000 });
            return;
        }

        try {
            const photoUrl = await uploadPhotoToImgbb();
            
            const result = await createNewUser(email, password);
            const user = result.user;
            
            await updateProfile(user, {
                displayName: name,
                photoURL: photoUrl || ''
            });
            
            setUser({ ...user, displayName: name, photoURL: photoUrl || '' });
            
            const userData = {
                uid: user.uid,
                email,
                name,
                photoURL: photoUrl || '',
                role
            };
            
            if (role === 'student') {
                userData.year = year;
                userData.semester = semester;
                userData.session = session;
                userData.roll = roll;
            } else {
                const teacher = teachersList.find(t => t.short === selectedTeacher);
                userData.teacherShortName = selectedTeacher;
                userData.teacherFullName = teacher ? teacher.full : '';
            }
            
            const response = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                swal({ title: "Registration Successful!", icon: "success", timer: 1500 });
                setTimeout(() => navigate('/'), 1500);
            } else {
                throw new Error('Failed to save user data');
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                swal({ icon: "warning", title: "Email already in use.", timer: 3000 });
            } else {
                swal({ icon: "error", title: error.message || "Registration failed.", timer: 3000 });
            }
        }
    };

    return (
        <div className='bg-gray-100 w-full min-h-screen flex items-center justify-center py-12 px-4'>
            <div className="animate__animated animate__zoomIn mx-auto w-full max-w-2xl lg:max-w-4xl bg-white rounded-2xl shadow-xl p-6 md:p-10">
                <h1 className='text-center text-3xl font-bold text-gray-800 mb-8'>Create Your Account</h1>
                
                <form onSubmit={handleRegisterWithEmail} className='space-y-6'>
                    
                    {/* Responsive Grid Layout */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {/* Name Field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Your Name</label>
                            <input className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' type="text" name='name' placeholder='Enter Your Name' required />
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                            <input className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' type="email" name='email' placeholder='Enter Your email' required />
                        </div>

                        {/* Profile Photo Upload */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Profile Photo</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            {photoPreview && (
                                <div className="flex justify-center items-center">
                                    <img src={photoPreview} alt="Preview" className="h-28 w-28 rounded-full object-cover border-4 border-gray-200" />
                                </div>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className='md:col-span-2'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>Register as</label>
                            <div className="flex space-x-6">
                                <label className="flex items-center">
                                    <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                                    <span className="ml-2 text-gray-700">Student</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" className="form-radio h-4 w-4 text-blue-600" name="role" value="teacher" checked={role === 'teacher'} onChange={() => setRole('teacher')} />
                                    <span className="ml-2 text-gray-700">Teacher</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    {/* Conditional Fields based on Role */}
                    <div className='pt-4 border-t'>
                        {role === 'student' ? (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Year Dropdown */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Year</label>
                                    <select value={year} onChange={(e) => setYear(e.target.value)} className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' required>
                                        <option value="">Select Year</option>
                                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                
                                {/* Semester Dropdown */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Semester</label>
                                    <select value={semester} onChange={(e) => setSemester(e.target.value)} className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' required>
                                        <option value="">Select Semester</option>
                                        {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                
                                {/* Session Dropdown */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Session</label>
                                    <select value={session} onChange={(e) => setSession(e.target.value)} className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' required>
                                        <option value="">Select Session</option>
                                        {sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                
                                {/* Roll Number Field */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Roll Number</label>
                                    <input value={roll} onChange={(e) => setRoll(e.target.value)} className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' type="text" placeholder='Enter your roll number' required />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Select Your Name</label>
                                <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)} className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' required>
                                    <option value="">Select a teacher</option>
                                    {teachersList.map(teacher => (
                                        <option key={teacher.short} value={teacher.short}>{teacher.short} - {teacher.full}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    
                    {/* Password Field */}
                    <div className='pt-4 border-t'>
                         <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <div className="relative">
                            <input
                                className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition'
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder='Enter your Password' required 
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-xl text-gray-600">
                                {showPassword ? <FaRegEyeSlash /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    
                    <button className='w-full font-bold text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-lg transition shadow-md hover:shadow-lg'>
                        Register
                    </button>
                </form>
                
                <p className='text-center pt-6 text-gray-600'>
                    Already have an account? <NavLink to="/login" className='font-bold text-blue-600 hover:underline'>Login</NavLink>
                </p>
            </div>
        </div>
    );
};

export default Register;