
import { HiOutlineUsers } from "react-icons/hi2";
import { RiPagesFill } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';


const MyListCard = ({ item }) => {


    return (
        <div className='lg:h-[300px] flex gap-6 card-style p-4 mx-52 mb-10 '>

            <div className=''>
                <img className="rounded-xl w-[350px] h-[270px]" src={item.image} alt="" />
            </div>


            <div className="rounded-xl flex-grow bg-slate-200 py-4 px-8">

                <h1 className='pb-4 font-bold text-2xl border-b-2 border-dashed border-[#988a8a]'>{item.item_name}</h1>
                <p className='text-xl font-medium pt-3 pb-2'>Price : ${item.price}</p>

                <div className="flex items-center gap-2 text-lg font-medium">
                    <p className=''>
                        Rating : {item.rating}
                    </p>
                    <FaStar />
                </div>


                <div className='py-2 flex flex-col lg:flex-row gap-4 lg:gap-10 text-lg font-medium'>

                    <p> Customization: {item.customization}</p>
                    <p> Stock Status: {item.stockStatus}</p>

                </div>


                <div className='flex flex-col lg:flex-row gap-4 mt-4 items-center'>

                    <button className='font-medium text-lg btn btn-warning text-white'>Delete</button>

                    <Link to={`/details/${item._id}`}>
                        <button className='view-details ml-16 lg:ml-0 mt-4 lg:mt-0'>Update</button>
                    </Link>
                </div>

            </div>

        </div>
    );
};

// MyListCard.prototype = {
//     item: PropTypes.object,
// }


export default MyListCard;