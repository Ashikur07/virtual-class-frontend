import Banner from "../Banner/Banner";
import BestSelling from "../BestSelling/BestSelling";
import CraftItemSection from "../CraftItemSection/CraftItemSection";
import LetestCollection from "../LetestCollection/LetestCollection";

const Home = () => {

    return (
        <div className="bg-white">
            <Banner></Banner>
            <LetestCollection></LetestCollection>
            <CraftItemSection></CraftItemSection>
            <BestSelling></BestSelling>
        </div>
    );
};

export default Home;