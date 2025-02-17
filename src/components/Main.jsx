import React, { useContext } from "react";
import SearcIconWhite from "../assets/SearchIconWhite";
import SearchIcon from "../assets/SearchIcon";
import ModeContext from "../context/ModeContext";
import CountriesContext from "../context/CountriesContext";
import Countries from "./Countries";
import Search from "../constants/Search";
import Filter from "../constants/Filter";
import { API_URL } from "../util/api";

const Main = () => {
  const { mode } = useContext(ModeContext);
  const { setCountries } = useContext(CountriesContext);

  const getCountryByRegion = async (regionName) => {
    try {
      const res = await fetch(`${API_URL}/region/${regionName}`);
      if (!res.ok) throw new Error("Failed..........");
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      setError(false);
    }
  };

  return (
    <main
      className={`${mode ? "bg-white" : "bg-dark-veryDarkBlue"} ${
        mode ? "text-light-veryDarkBlue" : "text-white"
      } px-[20px] md:px-[80px] py-[40px]`}
    >
      <div className="top flex flex-col gap-10 xxl:gap-0 xl:flex-row xl:justify-between xl:items-center">
        <div className="search relative">
          {mode ? <SearchIcon /> : <SearcIconWhite />}
          <Search />
        </div>
        <Filter onSelect={getCountryByRegion} />
      </div>

      <div className="bottom pt-[40px] grid grid-cols-1 justify-items-center md:grid-cols-2 md:gap-10 xxl:gap-0 xxl:grid-cols-4">
        <Countries />
      </div>
    </main>
  );
};

export default Main;
