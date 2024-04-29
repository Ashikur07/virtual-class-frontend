//CartoonDrawing
import { useEffect, useState } from "react";
import SubCategoryItemCard from "../SubCategoryItemCard/SubCategoryItemCard";


const CartoonDrawing = () => {

    useEffect(() => {
        document.title = 'Cartoon Drawing';
      }, []);

    const [items , setItems ] = useState([]);

    useEffect(() =>{
        fetch('https://assignment-10-server-site-beta.vercel.app/subcategory')
        .then(res => res.json())
        .then(datas =>{
            const data = datas.filter(data => data.subcategory_name === "Cartoon Drawing");
            // console.log(data);
            setItems(data);
        })

    },[])

    console.log(items);

    return (
        <div className="mt-10 mb-24 min-h-[70vh]">
            <h1 className="bg-white py-3 rounded mx-auto max-w-xl lg:text-5xl mb-6 font-semibold text-center"> Cartoon Drawing</h1>
            <div className="grid lg:grid-cols-2 max-w-4xl mx-5 lg:mx-auto gap-4 justify-center">
                {
                    items.map(item => <SubCategoryItemCard 
                    key={item._id}
                    item={item}></SubCategoryItemCard>)
                }
            </div>
        </div>
    );
};

export default CartoonDrawing;