import React, { useContext } from "react";
import ModeContext from "../context/ModeContext";

const Footer = () => {
  const { mode } = useContext(ModeContext);
  return (
    <footer>
      <h4
        className={`${mode ? "bg-white" : "bg-dark-darkBlue"} ${
          mode ? "text-dark-veryDarkBlue" : "text-white"
        } font-[600] text-center py-[20px]`}
      >
        &copy; Anahel Gines Delgado Almeida 2025
      </h4>
    </footer>
  );
};

export default Footer;