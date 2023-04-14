import axios from "axios";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import compareObjects from "../../ultils/compareObjects";
import { useAppSelector } from "../../ultils/store";
import { formatDate } from "../../ultils/convertTimeFormat";

type Props = {
  width: number;
  height: number;
};
const LineChartCompare: React.FC<Props> = ({ width, height }) => {
  const [data, setData] = useState([]);
  const { seletedCountries, payloadCompare } = useAppSelector(
    (state) => state.lineChartState
  );
  useEffect(() => {
    if (seletedCountries.length > 0) {
      let formattedArray: any = [];
      const set1 = new Set(seletedCountries);
      const commonArray = payloadCompare.filter((country: any) =>
        //@ts-ignore
        set1.has(country.country)
      );
      setData(formattedArray);
      console.log(formattedArray);
    }
    if (data.length > 0) {
      // d3.select("#time_series").select("svg").remove();
      // drawChart();
    }
  }, [seletedCountries]);
  const drawChart = () => {
    const margin = { top: 20, right: 120, bottom: 50, left: 50 };
    const marginText = 15;

    const svg = d3
      .select("#time_series")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    svg.exit();

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
      //@ts-ignore
      .domain([
        0,
        d3.max(data, function (d: any): any {
          return d.cases;
        }),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

    // set line coordinates
    const lineCase = d3
      .line()
      .x(function (d: any) {
        return x(d.date);
      })
      .y(function (d: any) {
        return y(d.cases);
      });

    svg
      .append("g")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", function (d: any) {
        return x(d.date);
      })
      .attr("y", function (d: any) {
        return y(d.cases);
      })
      .attr("fill", "steelblue")
      .text(function (d: any) {
        if (compareObjects(data[data.length - 1], d)) {
          return "Confirmed Cases";
        }
        return "";
      });

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", lineCase);
  };
  return (
    <div>
      <h4> Time Series - Covid Cases Between Countries</h4>
      <div id="time-series"></div>
    </div>
  );
};

export default LineChartCompare;
