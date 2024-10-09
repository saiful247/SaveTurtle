import hero from "../images/hero.jpg";
import { useEffect, useState } from "react";

const UnderConstruction = () => {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Trigger text reveal after a short delay
    const timer = setTimeout(() => {
      setTextVisible(true);
    }, 500); // Delay to enhance the reveal effect

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white relative"
        style={{
          backgroundImage: `url(${hero})`, // Local image in 'images' folder
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)", // This makes the hero much darker
            zIndex: 1, // Ensures the overlay is below the content
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10">
          <h1
            className={`text-6xl font-bold mb-6 transition-all duration-1000 ease-in-out ${
              textVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            SaveTurtles.lk
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg bg-primary text-white p-8 md:p-16">
        <h2 className="text-4xl font-semibold mb-4">
          Why Protect Turtles in Sri Lanka?
        </h2>
        <p className="text-lg mb-6">
          Sri Lanka is home to five of the seven species of sea turtles found in
          the world. These magnificent creatures have roamed the oceans for over
          100 million years, but today they are under severe threat due to human
          activities.
        </p>
        <h3 className="text-2xl font-semibold mb-3">
          The Importance of Turtle Conservation
        </h3>
        <p className="text-lg mb-6">
          Sea turtles play a crucial role in maintaining the health of marine
          ecosystems. They help balance ocean habitats and support biodiversity
          by regulating jellyfish populations and ensuring healthy seagrass
          beds. Protecting turtles is not just about saving an individual
          species, but about preserving the entire marine ecosystem they
          support.
        </p>
        <h3 className="text-2xl font-semibold mb-3">How You Can Help</h3>
        <p className="text-lg">
          There are many ways you can contribute to turtle conservation in Sri
          Lanka, from supporting turtle hatcheries to reducing plastic waste and
          ensuring clean oceans. Every small action counts toward creating a
          safe environment where these ancient creatures can continue to thrive.
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
