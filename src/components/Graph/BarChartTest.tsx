import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import "./BarChart.scss";
import { element } from "prop-types";
type Props = {
  dataset: Array<Object>;
};

const BarChartTest: React.FC<Props> = ({ dataset }) => {
  const [data, setData] = useState([]);
  const margin = { top: 10, right: 150, bottom: 30, left: 100 };
  const width = 1200 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom + data.length + 10;
  const [isCase, setIsCase] = useState(true);
  const [isDeath, setIsDeath] = useState(false);
  const [isAlphabetical, setIsAlphabetical] = useState(false);
  const [isAscending, setIsAscending] = useState(false);
  const [isDescending, setIsDescending] = useState(false);
  const [content, setTooltipContent] = useState("");

  useEffect(() => {
    d3.select("#bar_chart").select("svg").remove();
    drawBarChart();
  }, [data, isCase, isDeath, isAscending, isDescending]);

  const updateData = (value: any) => {
    const addedItem = dataset.find((element: any) => element.country === value);
    //@ts-ignore
    setData((prevState) => [...prevState, addedItem]);
  };

  const handleType = (type: any) => {
    if (type === "case") {
      setIsCase(true);
      setIsDeath(false);
    }
    if (type === "death") {
      setIsCase(false);
      setIsDeath(true);
    }
  };

  const handleRemoveCountry = (country: any) => {
    setData(data.filter((element: any) => element.country !== country));
  };

  const handleRemoveAll = () => {
    setData([]);
  };

  const handleSorting = (type: any) => {
    if (type === "ascending") {
      setData(
        data.sort((a: any, b: any) =>
          isCase ? a.cases - b.cases : a.deaths - b.deaths
        )
      );
      setIsAscending(true);
      setIsDescending(false);
      setIsAlphabetical(false);
    }
    if (type === "descending") {
      setData(
        data.sort((a: any, b: any) =>
          isCase ? b.cases - a.cases : b.deaths - a.deaths
        )
      );
      setIsAscending(false);
      setIsDescending(true);
      setIsAlphabetical(false);
    }

    if (type === "alphabetical ") {
      setIsAscending(false);
      setIsDescending(false);
      setIsAlphabetical(true);

      const sortedNames = data.sort((a: any, b: any) =>
        a.country.localeCompare(b.country)
      );

      setData(sortedNames);
    }
  };
  const drawBarChart = () => {
    const svg = d3
      .select("#bar_chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    let x = d3
      .scaleLinear()
      //@ts-ignore
      .domain([
        0,
        d3.max(data, (d) => {
          //@ts-ignore
          return isCase ? +d.cases : d.deaths;
        }),
      ])
      .range([4, width]);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    let y = d3
      .scaleBand()
      .range([0, height])
      //@ts-ignore
      .domain(data.map((d) => d.country))
      .padding(0.1);

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    const bars = svg.selectAll("rect").data(data);

    bars
      .enter()
      .append("rect")
      .attr("x", x(0))
      //@ts-ignore
      .attr("y", (d) => y(d.country))
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", isCase ? "steelblue" : "red")
      .attr("transform", "translate(0, 0)")
      .transition()
      .duration(500)
      //@ts-ignore
      .attr("width", (d) => x(isCase ? +d.cases : d.deaths));

    bars.exit().transition().duration(500).attr("width", 0).remove();
    //@ts-ignore
    bars
      .transition()
      .duration(500)
      .attr("x", x(0))
      //@ts-ignore
      .attr("y", (d) => y(d.country))
      //@ts-ignore
      .attr("width", (d) => x(isCase ? +d.cases : d.deaths))
      .attr("height", y.bandwidth());

    svg
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d: any) => x(isCase ? +d.cases : d.deaths) + 15)
      //@ts-ignore
      .attr("y", (d: any) => y(d.country) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text((d: any) => (isCase ? d.cases + " cases" : d.deaths + " deaths"))
      .style("font-size", "16px")
      .style("fill", "black");

    d3.select("#select-country").on("change", (e) => {
      const { value } = e.target;
      updateData(value);
    });

    d3.select("#data-type-select").on("change", (e) => {
      const { value } = e.target;
      handleType(value);
    });

    d3.select("#sort-select").on("change", (e) => {
      const { value } = e.target;
      handleSorting(value);
    });

    d3.select("#clearButton").on("click", (e) => {
      handleRemoveAll();
    });
  };

  return (
    <div>
      <div>
        <select
          id="data-type-select"
          style={{ marginLeft: "80px", height: "40px" }}
        >
          <option selected value="type">
            Type Of Data
          </option>
          <option value="case">Cases</option>
          <option value="death">Deaths</option>
        </select>
        <select id="sort-select" style={{ marginLeft: "10px", height: "40px" }}>
          <option selected value="type">
            Sorting
          </option>
          <option value="alphabetical ">Alphabetical </option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
        <select
          id="select-country"
          style={{ height: "40px", marginLeft: "10px" }}
        >
          <option value="" selected>
            Select Country
          </option>
          {dataset.map((element: any) => (
            <option
              selected
              value={element.country}
              style={{
                backgroundColor: data.find(
                  (item: any) => item.country === element.country
                )
                  ? "lightgray"
                  : "white",
              }}
            >
              {element.country}
            </option>
          ))}
        </select>
        <button
          id="clearButton"
          style={{
            padding: "10px",
            border: "1px solid",
            marginLeft: "10px",
          }}
        >
          Remove All
        </button>
        <div className="country-tags-container">
          {data.map((element: any) => (
            <span className="country-tag">
              <p>{element.country}</p>
              <button onClick={() => handleRemoveCountry(element.country)}>
                X
              </button>
            </span>
          ))}
        </div>
      </div>
      <div id="bar_chart"></div>
    </div>
  );
};

export default BarChartTest;
