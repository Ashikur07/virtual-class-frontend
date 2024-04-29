//PortraitDrawing
import { useEffect, useState } from "react";
import SubCategoryItemCard from "../SubCategoryItemCard/SubCategoryItemCard";


const PortraitDrawing = () => {

    useEffect(() => {
        document.title = 'Portrait Drawing';
      }, []);

    const [items , setItems ] = useState([]);

    useEffect(() =>{
        fetch('https://assignment-10-server-site-beta.vercel.app/subcategory')
        .then(res => res.json())
        .then(datas =>{
            const data = datas.filter(data => data.subcategory_name === "Portrait Drawing");
            // console.log(data);
            setItems(data);
        })

    },[])

    console.log(items);

    return (
        <div className="mt-10 mb-24 min-h-[70vh]">
            <h1 className="bg-white py-3 rounded mx-auto max-w-xl text-3xl lg:text-5xl mb-6 font-semibold text-center">Portrait Drawing</h1>
            <div className="grid lg:grid-cols-3 gap-4 max-w-6xl mx-5 lg:mx-auto justify-center">
                {
                    items.map(item => <SubCategoryItemCard 
                    key={item._id}
                    item={item}></SubCategoryItemCard>)
                }
            </div>
        </div>
    );
};

export default PortraitDrawing;