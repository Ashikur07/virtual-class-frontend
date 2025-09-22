import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaRegEyeSlash } from "react-icons/fa6";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import { AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import swal from 'sweetalert';
import axios from "axios";

// Data for dropdowns
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
const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];
const semesterOptions = ["1st Semester", "2nd Semester"];
const sessionOptions = [];
for (let i = 2018; i <= 2024; i++) {
    sessionOptions.push(`${i}-${(i + 1).toString().slice(-2)}`);
}

const Login = () => {
    useEffect(() => {
        document.title = 'Login';
    }, []);

    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const { createUserWithGoogle, createUserWithGitHub, signInUser } = useContext(AuthContext);

    const googleProvider = new GoogleAuthProvider();
    const gitHubProvider = new GithubAuthProvider();

    // modal states
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [socialUser, setSocialUser] = useState(null);
    const [role, setRole] = useState("");

    // ✅ **FIXED: Reverted to your original database checking logic**
    const checkUserInDB = async (user) => {
        try {
            const { data } = await axios.get("http://localhost:5000/users");
            const foundUser = data.find(dbUser => dbUser.email === user.email);

            if (foundUser) {
                // User exists, log them in
                swal({ title: "Login Successful!", icon: "success", timer: 1000 });
                setTimeout(() => {
                    navigate(location?.state ? location.state : '/');
                }, 1000);
            } else {
                // New user, show the completion modal
                setSocialUser(user);
                setShowRegisterModal(true);
            }
        } catch (error) {
            console.log("Error checking user:", error);
            swal({ title: "Error", text: "Could not verify user. Please try again.", icon: "error" });
        }
    };

    const handleGoogleSignIn = () => {
        createUserWithGoogle(googleProvider)
            .then(result => checkUserInDB(result.user))
            .catch(err => console.log(err));
    };

    const handleGitHubSignIn = () => {
        createUserWithGitHub(gitHubProvider)
            .then(result => checkUserInDB(result.user))
            .catch(err => console.log(err));
    };

    const handleSignInWithEmail = e => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        signInUser(email, password)
            .then(() => {
                swal({ title: "Login Successful!", icon: "success", timer: 1000 });
                setTimeout(() => {
                    navigate(location?.state ? location.state : '/');
                }, 1000);
            })
            .catch(() => {
                swal({
                    icon: "warning",
                    title: "Email or password does not match!",
                    timer: 2000
                });
            });
    };

    const handleRegisterNewUser = async (e) => {
        e.preventDefault();
        const form = e.target;

        const teacherShortName = form.teacher?.value;
        const selectedTeacher = teachersList.find(t => t.short === teacherShortName);

        const newUser = {
            uid: socialUser?.uid,
            email: socialUser?.email,
            name: socialUser?.displayName,
            photoURL: socialUser?.photoURL,
            role,
            ...(role === "student" && {
                year: form.year.value,
                semester: form.semester.value,
                session: form.session.value,
                roll: form.roll.value
            }),
            ...(role === "teacher" && {
                teacherShortName: teacherShortName,
                teacherFullName: selectedTeacher ? selectedTeacher.full : ''
            })
        };

        try {
            await axios.post("http://localhost:5000/users", newUser);
            swal({ title: "Registration Successful!", icon: "success", timer: 1500 });
            setShowRegisterModal(false);
            navigate('/');
        } catch (error) {
            console.log("Error registering new user:", error);
            swal({ title: "Registration Failed", text: "Something went wrong.", icon: "error" });
        }
    };

    return (
        <div className='bg-gray-100 w-full min-h-screen flex items-center justify-center py-12 px-4'>
            <div className="animate__animated animate__zoomIn mx-auto w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10">
                <h1 className='text-center text-3xl font-bold text-gray-800 py-4'>Welcome Back!</h1>
                
                <div className="space-y-3 my-5">
                    <button onClick={handleGoogleSignIn} className='w-full p-2.5 flex justify-center items-center gap-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition'>
                        <FcGoogle className='text-2xl' />
                        <span className='font-semibold text-gray-700'>Sign in with Google</span>
                    </button>
                    <button onClick={handleGitHubSignIn} className='w-full p-2.5 flex justify-center items-center gap-3 border border-transparent rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition'>
                        <FaGithub className='text-2xl' />
                        <span className='font-semibold'>Sign in with GitHub</span>
                    </button>
                </div>

                <div className='flex my-6 justify-between items-center'>
                    <p className='flex-grow border-b border-gray-300'></p>
                    <p className='px-4 text-gray-500'>or</p>
                    <p className='flex-grow border-b border-gray-300'></p>
                </div>

                <form onSubmit={handleSignInWithEmail} className="space-y-4">
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
                        <input className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' type="email" name='email' placeholder='Enter Your email' required />
                    </div>
                    <div>
                         <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
                        <div className="relative">
                            <input className='w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition' type={showPassword ? "text" : "password"} name="password" placeholder='Enter your Password' required />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-xl text-gray-600">
                                {showPassword ? <FaRegEyeSlash /> : <AiOutlineEye />}
                            </span>
                        </div>
                    </div>
                    <button className='w-full font-bold text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-lg transition shadow-md hover:shadow-lg'>Login</button>
                </form>

                <p className='text-center mt-6 text-gray-600'>
                    Don't have an account? <NavLink to='/register' className='font-bold text-blue-600 hover:underline'>Register</NavLink>
                </p>
            </div>

            {/* Registration Modal */}
            {showRegisterModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg animate__animated animate__fadeInUp">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
                            <button onClick={() => setShowRegisterModal(false)} className="text-gray-500 hover:text-gray-800">
                                <AiOutlineClose size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleRegisterNewUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
                                <select name="role" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition" required onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            
                            {role === "student" && (
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t'>
                                    <select name="year" className="w-full p-2.5 border border-gray-300 rounded-lg" required><option value="">Select Year</option>{yearOptions.map(y => <option key={y} value={y}>{y}</option>)}</select>
                                    <select name="semester" className="w-full p-2.5 border border-gray-300 rounded-lg" required><option value="">Select Semester</option>{semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                    <select name="session" className="w-full p-2.5 border border-gray-300 rounded-lg" required><option value="">Select Session</option>{sessionOptions.map(s => <option key={s} value={s}>{s}</option>)}</select>
                                    <input type="text" name="roll" placeholder="Roll Number" className="w-full p-2.5 border border-gray-300 rounded-lg" required />
                                </div>
                            )}

                            {role === "teacher" && (
                                <div className="pt-4 border-t">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Name</label>
                                    <select name="teacher" className="w-full p-2.5 border border-gray-300 rounded-lg" required>
                                        <option value="">Select Teacher</option>
                                        {teachersList.map(t => <option key={t.short} value={t.short}>{t.short} - {t.full}</option>)}
                                    </select>
                                </div>
                            )}

                            <button type="submit" className="w-full font-bold text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-lg transition mt-4">Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;