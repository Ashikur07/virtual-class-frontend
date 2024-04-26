import { useLoaderData } from "react-router-dom";

const Home = () => {

    const lodedUser = useLoaderData();
    console.log(lodedUser);

    const handle = e =>{
        e.preventDefault();
        const value = e.target.aa.value;
        console.log(value)
    }


    return (
        <div>
            <form onSubmit={handle}>

                <textarea name="aa" id="" cols="30" rows="10"></textarea>
                    <input className="btn" type="submit" name="" id="" />
            </form>
        </div>
    );
};

export default Home;