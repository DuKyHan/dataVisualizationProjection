import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./WorldMap.scss";
import * as d3 from "d3";
import { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import { geoPath } from "d3";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import MouseTracker from "../MouseTracker/MouseTracker";

function WorldMapAtlas() {
  const [geoData, setGeoData] = useState<[] | Array<Feature<Geometry | null>>>(
    []
  );
  interface Country {
    name: string;
  }
  const [countries, setCountries] = useState<[] | Array<Country>>([]);
  const [hoverCountry, setHoverCountries] = useState<String | null | undefined>(
    null
  );
  const [isHover, setIsHover] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<number | null | undefined>(
    null
  );

  const svgRef = React.useRef<SVGSVGElement>(null);

  const getCountryCovidCase = async (date: string, iso: string) => {
    const options = {
      method: "GET",
      url: "https://covid-19-statistics.p.rapidapi.com/reports/total",
      params: { date, iso },
      headers: {
        "X-RapidAPI-Key": "e0254ae8f1mshd6cb426fc951df5p13cb6cjsn8aa6ce284419",
        "X-RapidAPI-Host": "covid-19-statistics.p.rapidapi.com",
      },
    };

    const response = await axios
      .request(options)
      .then((response) => response)
      .catch(function (error) {
        console.error(error);
      });
    return response;
  };

  useEffect(() => {
    d3.json("/data/world-110m.json")
      .then((data) => {
        return data;
      })
      .then((worldData) => {
        const mapFeature: Array<Feature<Geometry | null>> = //@ts-ignore
          (feature(worldData, worldData.objects.countries) as FeatureCollection)
            .features;
        setGeoData(mapFeature);
      });
    axios.get("data/countries.json").then(({ data }) => {
      setCountries(data);
    });
  }, []);

  const projection = d3.geoEqualEarth().rotate([0, 0, 0]).scale(250);
  console.log(getCountryCovidCase("2020-04-16", "USA"));
  return (
    <>
      <MouseTracker
        isHover={isHover}
        hoverCountry={hoverCountry}
        countryCode={countryCode}
      >
        {(geoData as []).map((d: any, i: number) => (
          <g className="geo-display">
            <path
              id={`countries-${d.id}`}
              key={`path=${uuidv4()}`}
              d={geoPath().projection(projection)(d) as string}
              fill={`rgba(65, 38, 132, ${
                (1 / (geoData ? geoData.length : 0)) * i
              })`}
              onMouseEnter={() => {
                const country = countries.find(
                  (country: any) => country["country-code"] == d.id
                );
                setHoverCountries(country?.name);
                setCountryCode(d.id);
                setIsHover(true);
              }}
              onMouseLeave={() => {
                setHoverCountries(null);
                setCountryCode(null);
                setIsHover(false);
              }}
            />
          </g>
        ))}
      </MouseTracker>
    </>
  );
}

export default WorldMapAtlas;
