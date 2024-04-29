import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import MyListCard from "../MyListCard/MyListCard";
import { useLoaderData } from "react-router-dom";


const MyArtCraftList = () => {

    useEffect(() => {
        document.title = 'My Art & Craft List';
    }, []);

    const { user } = useContext(AuthContext);
    const lodedItems = useLoaderData();
    const [items, setItems] = useState(lodedItems);

    const myItems = items.filter(item => item.uid === user?.uid);



    return (
        <div className="min-h-[80vh]">
            <h1 className='bg-slate-300 my-8 text-center pt-4 lg:pt-7 h-[70px] lg:h-[100px] text-3xl font-bold'>
                My Art & Craft List</h1>

            <h1></h1>

            <div className="text-center mb-10">
                <select className="bg-white text-lg select select-info w-full max-w-[250px]">
                    <option disabled selected>Select Customization</option>
                    <option>Yes</option>
                    <option>No</option>
                </select>

            </div>
            <div className="mb-32">
                {
                    myItems.map(item => <MyListCard
                        key={item._id}
                        item={item}
                        items={items}
                        setItems={setItems}
                    ></MyListCard>)
                }
            </div>

        </div>
    );
};

export default MyArtCraftList;