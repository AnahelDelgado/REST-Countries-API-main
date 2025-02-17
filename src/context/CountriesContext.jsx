import { createContext, useState, useEffect } from "react";
import { API_URL } from "../util/api";

const CountriesContext = createContext();

export const CountriesProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      setCountries(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let mounted = true;
    fetchCountries().then((items) => {
      if (mounted) {
        fetchCountries(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <CountriesContext.Provider
      value={{ countries, setCountries, isLoading, setIsLoading }}
    >
      {children}
    </CountriesContext.Provider>
  );
};

export default CountriesContext;
