import React, { memo, useEffect, useState } from "react";
import * as d3 from "d3";

type Props = {
  width: number;
  height: number;
};

const LineChart: React.FC<Props> = ({ width, height }) => {
  let URL = "https://disease.sh/v3/covid-19/historical/all?lastdays=all";
  const [hoveredData, setHoveredData] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      d3.select("#time_series").select("svg").remove();
      drawChart();
    } else {
      getURLData();
    }
  }, [data]);

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split("/");
    const year = parseInt(dateParts[2]) + 2000; // add 2000 to convert from yy to yyyy
    const month = parseInt(dateParts[0]) - 1; // subtract 1 to convert from 1-indexed to 0-indexed
    const day = parseInt(dateParts[1]);
    const dateObject = new Date(year, month, day);
    const formattedDate = dateObject.toISOString().slice(0, 10);

    return formattedDate;
  };

  const getURLData = async () => {
    let tempData: any[] = [];
    await d3.json(URL).then((response: any) => {
      console.log(
        Object.keys(response.cases).forEach((key) => {
          const formattedDate = formatDate(key);
          tempData.push({
            date: d3.timeParse("%Y-%m-%d")(formattedDate),
            value: response.cases[key],
          });
        })
      );
    });
    // @ts-ignore
    setData(tempData);
  };

  const drawChart = () => {
    // establish margins
    const margin = { top: 10, right: 50, bottom: 50, left: 50 };

    // create the chart area
    const svg = d3
      .select("#time_series")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    svg.exit();

    const tooltip = d3
      .select("#container")
      .append("div")
      .attr("class", "tooltip");

    // Add X axis --> it is a date format
    var x = d3
      .scaleTime()
      // @ts-ignore
      .domain(d3.extent(data, (d: any) => d.date))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d: any): any {
          return d.value;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    // set line coordinates
    const line = d3
      .line()
      .x(function (d: any) {
        return x(d.date);
      })
      .y(function (d: any) {
        return y(d.value);
      });

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  return (
    <div>
      <h4> Time Series - Covid Cases</h4>
      {data && <div id="time_series" />}
    </div>
  );
};

export default memo(LineChart);
