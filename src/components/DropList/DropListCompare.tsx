import axios from "axios";
import React, { useEffect, useState } from "react";
import { setSelectedCountries } from "../../reduxState/lineChartSlice";
import { useAppDispatch, useAppSelector } from "../../ultils/store";

interface Country {
  name: string;
  country: string;
}
export default function DropListCompare() {
  const [countries, setCountries] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const { payloadCompare } = useAppSelector((state) => state.lineChartState);
  const [finalArray, setFinalArray] = useState([]);

  useEffect(() => {
    // const set1 = new Set(countries);
    // const commonArray = payloadCompare.filter((country: any) =>
    //   set1.has(country.country)
    // );
    dispatch(setSelectedCountries(countries));
  }, [countries]);

  const handleOnChange = (e: any) => {
    const { value } = e.target;
    if (!countries.includes(value)) {
      setCountries((prevState) => [...prevState, value]);
    }
  };
  return (
    <>
      {payloadCompare.length > 0 && (
        <select name="country" onChange={handleOnChange}>
          <option>Select Country</option>
          {payloadCompare.map((country: Country) => (
            <option value={country["country"]} key={country["country"]}>
              {country.country}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
