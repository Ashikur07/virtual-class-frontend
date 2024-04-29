import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthProvider/AuthProvider";
import MyListCard from "../MyListCard/MyListCard";
import { useLoaderData } from "react-router-dom";

const MyArtCraftList = () => {
    useEffect(() => {
        document.title = 'My Art & Craft List';
    }, []);

    const { user } = useContext(AuthContext);
    const loadedItems = useLoaderData();
    const [items, setItems] = useState(loadedItems);
    const [customization, setCustomization] = useState(''); // State to hold the selected customization option

    const myItems = items.filter(item => item.uid === user?.uid);

    // Function to handle changes in the select dropdown
    const handleCustomizationChange = (event) => {
        setCustomization(event.target.value); // Update the selected customization option
    };

    // Filter items based on the selected customization option
    const filteredItems = customization ? myItems.filter(item => item.customization === customization) : myItems;

    return (
        <div className="min-h-[80vh]">
            <h1 className='bg-slate-300 my-8 text-center pt-4 lg:pt-7 h-[70px] lg:h-[100px] text-3xl font-bold'>
                My Art & Craft List
            </h1>

            <div className="text-center mb-10">
                <select className="bg-white text-lg select select-info w-full max-w-[250px]" onChange={handleCustomizationChange}>
                    <option disabled selected>Select Customization</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>

            <div className="mb-32">
                {
                    filteredItems.map(item => (
                        <MyListCard
                            key={item._id}
                            item={item}
                            items={items}
                            setItems={setItems}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default MyArtCraftList;
