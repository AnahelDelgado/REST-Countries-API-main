import React, { useContext, useState } from "react";
import ModeContext from "../context/ModeContext";
import CountriesContext from "../context/CountriesContext";
import { API_URL } from "../util/api";
import {motion} from "framer-motion";

const Search = () => {
  const { mode } = useContext(ModeContext);
  const { setCountries } = useContext(CountriesContext);
  const [input, setInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${API_URL}/name/${input}`)
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.log(err));

    event.target.name.value = "";
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.input
        whileFocus={{ scale: 1.1 }}
        className={`${
          mode ? "bg-white" : "bg-dark-darkBlue"
        }  font-[600] px-[100px] py-[15px] w-[100%] md:w-[500px] rounded-md shadow-lg focus:outline-0`}
        type="text"
        name="name"
        placeholder="Busca un país..."
        onChange={(e) => setInput(e.target.value)}
      />
    </form>
  );
};

export default Search;
