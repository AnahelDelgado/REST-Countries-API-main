import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";

const Filter = ({ onSelect }) => {
  const { mode } = useContext(ModeContext);

  const selectType = (event) => {
    const regionName = event.target.value;
    onSelect(regionName);
  };

  return (
    <>
      <select
        onChange={selectType}
        className={`${
          mode ? "bg-white" : "bg-dark-darkBlue"
        } w-[250px] px-[30px] py-[15px] outline-0 rounded-md shadow-lg border-0 cursor-pointer hover:opacity-50`}
        name="filter"
      >
        <option>Filtrar por región</option>
        <option value="Africa">África</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europa</option>
        <option value="Oceania">Oceania</option>
      </select>
    </>
  );
};

export default Filter;
