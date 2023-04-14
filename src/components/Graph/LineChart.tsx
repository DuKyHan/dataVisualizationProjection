import React, { memo, useEffect, useState } from "react";
import * as d3 from "d3";
import { svg } from "d3";
type Props = {
  width: number;
  height: number;
};
const LineChart: React.FC<Props> = ({ width, height }) => {
  let csvURL =
    "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv";

  const [data, setData] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      d3.select("svg").remove();
      drawChart();
    } else {
      getURLData();
    }
  }, [data]);

  // gets csv data from a random csv I found
  // ex. [{date: '2021-12-12', value: 1000}]
  const getURLData = async () => {
    let tempData: any[] = [];
    await d3.csv(
      csvURL,
      // @ts-ignore
      () => {},
      function (d: any) {
        //console.log(d);
        tempData.push({
          date: d3.timeParse("%Y-%m-%d")(d.date),
          value: parseFloat(d.value),
        });
      }
    );
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

    // Add X axis --> it is a date format
    var x = d3
      .scaleTime()
      // @ts-ignore
      .domain(d3.extent(data, (d: any) => d.date))
      .range([0, width]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d: any): any {
          return +d.value;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

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
      <h4> Time Series - http CSV response</h4>
      <div id="time_series" />
    </div>
  );
};

export default LineChart;
