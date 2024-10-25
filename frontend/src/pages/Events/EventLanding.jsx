import { Link } from "react-router-dom";
import BoxReveal from "../../components/BoxReveal";
import BackgroundRipple from "../../components/BackgroundRipple";

const EventLanding = () => {
  return (
    <div className="relative min-h-screen overflow-hidden font-mono">
      <BackgroundRipple />
      <div className="container mx-auto px-4 py-8 relative z-10 mt-10">
        <BoxReveal>
          <h1 className="text-6xl font-bold mb-6 tracking-widest">
            Save Sea Turtle Initiative.
          </h1>
        </BoxReveal>

        <BoxReveal width="100%" boxColor="#96DEAE" duration={0.7}>
          <p className="text-4xl mt-4 text-[#5046e6]">
            Join us in our mission to protect endangered sea turtles!
          </p>
          <p className="text-2xl mt-4">
            We organize engaging events where participants can contribute to the
            conservation of these majestic creatures.
          </p>
        </BoxReveal>

        <BoxReveal width="100%" boxColor="#5046e6" duration={0.7}>
          <p className="text-2xl mt-4">
            Every event supports our efforts, with all proceeds going directly
            toward protecting sea turtles and their habitats.
            <span className="text-[#5046e6]">
              {" "}
              Together, we can make a difference
            </span>
            and ensure a safer future for these incredible marine animals.
          </p>
          <Link to="/eventViews">
            <button className="bg-[#5046e6] text-white px-4 py-2 rounded-md mt-10 text-2xl">
              Add Booking
            </button>
          </Link>
        </BoxReveal>
      </div>
    </div>
  );
};

export default EventLanding;
