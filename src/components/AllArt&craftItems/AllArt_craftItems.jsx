import { useLoaderData } from "react-router-dom";
import Row from "../Row/Row";


const AllArt_craftItems = () => {

    const items = useLoaderData();


    return (
        <div className="overflow-x-auto px-32 h-[80vh] pb-32">

            <h1 className="text-4xl font-bold text-center py-12">All Art & Craft Item List</h1>

            <div className="border-2 p-2 rounded-xl">
                <table className="table">
                    {/* head */}
                    <thead className="bg-[#90EE90] ">
                        <tr className="text-lg text-black">
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Subcategory Name</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-200">

                        {items.map(item => <Row
                            key={item._id}
                            item={item}></Row>)}

                    </tbody>


                </table>

            </div>

        </div>
    );
};

export default AllArt_craftItems;
