import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CountriesContext from "../context/CountriesContext";
import ModeContext from "../context/ModeContext";
import { motion, useScroll, useSpring } from "framer-motion";
import BackToTop from "react-back-to-top-button";

const Countries = () => {
  const { countries } = useContext(CountriesContext);
  const { isLoading } = useContext(CountriesContext);
  const { mode } = useContext(ModeContext);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className={`${mode ? "progress-bar-dark" : "progress-bar"}`}
        style={{ scaleX }}
      />
      {isLoading ? (
        <div className="w-[100px] h-[100vh] mt-[200px] font-[800]">
          <h2 className="text-3xl tracking-widest">Cargando...</h2>
        </div>
      ) : (
        countries.map((country, idx) => {
          return (
            <>
              <Link
                to={`/country/${country.name}`}
                className="w-[300px] rounded-lg shadow-lg cursor-pointer mb-[80px]"
                key={idx}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    translateX: -500,
                  }}
                  animate={{
                    opacity: 1,
                    translateX: 0,
                  }}
                  transition={{
                    delay: 0.5,
                    x: { duration: 1 },
                    default: { ease: "linear" },
                  }}
                  whileHover={{
                    translateY: -10,
                  }}
                >
                  <div className="image h-[200px] w-[100%]">
                    <img
                      className="h-[100%] w-[100%] object-cover block rounded-t-lg"
                      src={country.flag}
                      alt="flag"
                    />
                  </div>
                  <div
                    className={`${
                      mode ? "bg-white" : "bg-dark-darkBlue"
                    } text min-h-[230px] pl-5 rounded-b-lg`}
                  >
                    <h2 className="font-[600] text-xl py-6">{country.name}</h2>
                    <div className="space-y-2">
                      <p>
                        <span className="font-[600]">Población: </span>{" "}
                        {country.population.toLocaleString()}
                      </p>
                      <p>
                        <span className="font-[600]">Región: </span>
                        {country.region}
                      </p>
                      <p>
                        <span className="font-[600]">Capital: </span>{" "}
                        {country.capital}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
              {mode ? (
                <BackToTop
                  scrollTo={0}
                  showAt={200}
                  speed={1500}
                  easing="easeInOutSine"
                  style={{ marginRight: "20px", zIndex: "999" }}
                >
                  <ion-icon
                    style={{ color: "black", fontSize: "4rem" }}
                    name="caret-up-circle-outline"
                  ></ion-icon>
                </BackToTop>
              ) : (
                <BackToTop
                  scrollTo={0}
                  showAt={200}
                  speed={1500}
                  easing="easeInOutSine"
                  style={{ marginRight: "20px", zIndex: "999" }}
                >
                  <ion-icon
                    style={{ color: "white", fontSize: "4rem" }}
                    name="caret-up-circle-outline"
                  ></ion-icon>
                </BackToTop>
              )}
            </>
          );
        })
      )}
    </>
  );
};

export default Countries;
