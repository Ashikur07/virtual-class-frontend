import { useEffect } from "react";
import Hero from "./Hero"; 
import Features from "./Features";
import RoutineOverview from "./RoutineOverview";
import TaskHighlights from "./TaskHighlights";
import Testimonials from "./Testimonials";
import CallToAction from "./CallToAction";

const Home = () => {

    useEffect(() => {
        document.title = 'Home';
      }, []);

    return (
        <div className="pt-4">
           <Hero />
           <Features />
           <RoutineOverview />
           <TaskHighlights />
           <Testimonials />
           <CallToAction />

           
        </div>
    );
};

export default Home;