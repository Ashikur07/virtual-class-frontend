import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';

// Importing icons for a professional look
import { FaUserGraduate, FaChalkboardTeacher, FaIdCard, FaEnvelope, FaRegCalendarAlt, FaHashtag, FaInfoCircle } from "react-icons/fa";

// Provided list of teachers to match full names from short names
const teachersList = [
    { short: "MMR", full: "Prof. Dr. Md. Mahbubur Rahman" },
    { short: "PCB", full: "Prof. Dr. Paresh Chandra Barman" },
    { short: "TKJ", full: "Prof. Dr. Tapan Kumar Jodder" },
    { short: "ZI", full: "Prof. Dr. Md. Zahidul Islam" },
    { short: "SI", full: "Dr. Md. Shariful Islam" },
    { short: "AR", full: "Prof. Md. Ashek Raihan Mahmud" },
    { short: "SM", full: "Prof. Dr. Md. Sipaon Miah" },
    { short: "AH", full: "Prof. Dr. Md. Alamgir Hossain" },
    { short: "JU", "full": "Md. Jashim Uddin" },
    { short: "KTA", full: "Khandaker Takdir Ahmed" },
    { short: "KMA", full: "Kazi Mowdud Ahmed" },
    { short: "MMH", full: "Prof. Dr. Mohammad Mominul Haque" },
    { short: "MZH", full: "Prof. Dr. Mohammad Zulfiquar Hossain" },
    { short: "KMS", full: "K M Sharf Uddin" },
    { short: "FTT", full: "Mr. Farha Tanzim Titil" },
    { short: "MAI", full: "Dr. Md. Ariful Islam" },
    { short: "THM", full: "Prof. Dr. Md. Zahidul Islam (HUM)" }
];

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        document.title = 'Profile';

        if (user?.email) {
            const fetchProfileData = async () => {
                try {
                    const response = await fetch('http://localhost:5000/users');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const allUsers = await response.json();
                    
                    const currentUserData = allUsers.find(dbUser => dbUser.email === user.email);
                    
                    if (currentUserData) {
                        // ✅ KEY CHANGE: If user is a teacher and fullName is missing, find it from the list
                        if (
                            currentUserData.role === 'teacher' &&
                            !currentUserData.teacherFullName && // Check if full name is missing
                            currentUserData.teacherShortName    // And a short name exists
                        ) {
                            const matchedTeacher = teachersList.find(
                                (teacher) => teacher.short === currentUserData.teacherShortName
                            );
                            if (matchedTeacher) {
                                // Add the found full name to the data object
                                currentUserData.teacherFullName = matchedTeacher.full;
                            }
                        }
                        setProfileData(currentUserData);
                    } else {
                        setProfileData({ 
                            name: user.displayName, 
                            email: user.email, 
                            photoURL: user.photoURL,
                            role: 'User'
                        });
                    }
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfileData();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!profileData) {
        return <div className="flex justify-center items-center h-screen">Could not find profile information.</div>;
    }

    const roleBadgeColor = profileData.role === 'teacher' 
        ? 'bg-blue-100 text-blue-800' 
        : profileData.role === 'student'
        ? 'bg-green-100 text-green-800'
        : 'bg-gray-100 text-gray-800';

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-36 relative">
                    <img 
                        src={profileData.photoURL || 'https://i.ibb.co/61A0Q00/user-not-found.png'} 
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-white absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
                    />
                </div>

                <div className="pt-20 pb-10 px-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{profileData.name || user?.displayName}</h1>
                    <div className="flex items-center justify-center gap-2 mt-2 text-gray-500">
                        <FaEnvelope />
                        <p>{profileData.email}</p>
                    </div>
                    
                    <div className="mt-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${roleBadgeColor} inline-flex items-center gap-2`}>
                            {profileData.role === 'teacher' && <FaChalkboardTeacher />}
                            {profileData.role === 'student' && <FaUserGraduate />}
                            {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                        </span>
                    </div>
                </div>

                <hr className="border-gray-200" />

                <div className="p-6 sm:p-8 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-blue-500"/>
                        Additional Information
                    </h2>
                    
                    {profileData.role === 'teacher' && (
                        <>
                            <div className="flex items-center text-gray-600">
                                <FaChalkboardTeacher className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Full Name:</strong><span className="ml-2">{profileData.teacherFullName || 'Not Available'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaIdCard className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Short Name:</strong><span className="ml-2">{profileData.teacherShortName}</span>
                            </div>
                        </>
                    )}

                    {profileData.role === 'student' && (
                        <>
                            <div className="flex items-center text-gray-600">
                                <FaIdCard className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Roll:</strong><span className="ml-2">{profileData.roll}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaHashtag className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Session:</strong><span className="ml-2">{profileData.session}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <FaUserGraduate className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Year/Semester:</strong><span className="ml-2">{profileData.year} / {profileData.semester}</span>
                            </div>
                        </>
                    )}
                     <div className="flex items-center text-gray-600">
                                <FaRegCalendarAlt className="w-6 h-6 mr-3 text-gray-400" />
                                <strong>Registered:</strong><span className="ml-2">{ user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;