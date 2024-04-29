import  { useContext, useEffect } from 'react';
import { AuthContext } from '../../AuthProvider/AuthProvider';

const Profile = () => {

    const { user } = useContext(AuthContext);

    useEffect(() => {
        document.title = 'Profile';
      }, []);

    return (
        <div className=' py-12 flex justify-center h-[700px]'>

            <div className='py-20 lg:py-[88px] mb-12  rounded-3xl text-center mx-3 w-[100%] lg:w-[450px] lg:h-[580px] bg-blue-950'>

                <div className="avatar mb-10">
                    <div className="w-52 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img src={user?.photoURL} />
                    </div>
                </div>

                <h1 className='text-[#D9AAFF] text-4xl font-bold'>{user?.displayName}</h1>
                <p className='text-[#AEA1BD] pt-4 '>UID : {user?.uid}</p>
                <p className='text-[#AEA1BD] py-1 text-lg font-bold'>{user?.email}</p>
                <h3 className='text-white'>Registered : {user?.metadata?.creationTime}</h3>

            </div>

        </div>
    );
};

export default Profile;
