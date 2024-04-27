import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import MyListCard from "../MyListCard/MyListCard";


const MyArtCraftList = () => {

    const { user } = useContext(AuthContext);
    const items = useLoaderData();

    const myItems = items.filter(item => item.uid === user?.uid);
    console.log(myItems);

    return (
        <div>
            <h1 className=' my-8 text-center pt-4 lg:pt-7 h-[70px] lg:h-[100px] card-img-div text-3xl font-bold'>
                My Art & Craft List</h1>

            <div>
                {
                    myItems.map(item => <MyListCard
                        key={item._id}
                        item={item}
                    ></MyListCard>)
                }
            </div>

        </div>
    );
};

export default MyArtCraftList;