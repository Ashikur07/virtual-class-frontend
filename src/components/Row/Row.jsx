import { Link } from "react-router-dom";

const Row = ({ item }) => {

    console.log(item);

    return (

        <tr className="border-[6px] border-white">
            <td>
                <img className="w-32 lg:h-32" src={item.image
                } alt="Avatar Tailwind CSS Component" />
            </td>

            <td className="text-base font-semibold">
                {item.item_name}
            </td>

            <td className="hidden lg:block lg:pt-16 font-bold">{item.subcategory_name}</td>

            <td className="font-bold">$ {item.price}</td>

            <td className="font-bold hidden lg:block">{item.rating}</td>

            <td>
                <Link to={`/details/${item._id}`} className="btn btn-success text-white px-4">View Details</Link>
            </td>
        </tr >
    );
};

export default Row;