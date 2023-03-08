import axios from "axios";
import React, { useEffect, useState } from "react";
import { setSelectedCountry } from "../../reduxState/lineChartSlice";
import { useAppDispatch } from "../../ultils/store";

interface Country {
  name: string;
  "country-code": string;
}
export default function DropList() {
  const [countries, setCountries] = useState([]);
  const dispatch = useAppDispatch();
  useEffect(() => {
    getAllCountries();
  }, []);

  const getAllCountries = async () => {
    await axios
      .get("data/countries.json")
      .then((response) => setCountries(response.data));
  };
  const handleOnChange = (e: any) => {
    const { value } = e.target;
    dispatch(setSelectedCountry(value));
  };
  return (
    <>
      {countries && (
        <select name="country" onChange={handleOnChange}>
          <option value="" selected>
            All
          </option>
          {countries.map((country: Country) => (
            <option
              value={country["country-code"]}
              key={country["country-code"]}
            >
              {country.name}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
