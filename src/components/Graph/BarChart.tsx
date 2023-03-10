import React, { memo, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

type Props = {
  width: number;
  height: number;
};

const BarChart: React.FC<Props> = ({ width, height }) => {
  // const [ata, stat] = useState([]);
  const [dataset, setData] = useState<any[]>([]);
  useEffect(() => {
    if (dataset.length > 0) {
      d3.select("#bar-chart").select("svg").remove();
      drawChart();
    } else {
      getData();
    }
  }, [dataset]);

  const getData = async () => {
    await axios.get("data/BarChart.json").then((response) => {
      // const data = d3.max(dataset, (d) => d.cases);
      // console.log(data);
      setData(
        response.data
          .sort((a: any, b: any) => d3.ascending(a.cases, b.cases))
          .slice(-10)
      );
    });
  };

  const drawChart = () => {
    const w = width;
    const h = height;

    const colorScale = d3
      .scaleLinear()
      //@ts-ignore
      .domain([
        d3.min(dataset, (d) => d.cases),
        d3.max(dataset, (d) => d.cases),
      ])
      //@ts-ignore
      .range(["#0e1014", "#0254f7"]);

    //create ordinal scale
    const xScale = d3
      .scaleBand()
      //@ts-ignore
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      //@ts-ignore
      .domain([
        d3.min(dataset, (d) => d.cases),
        d3.max(dataset, (d) => d.cases),
      ])
      .range([30, h]);

    //Create SVG element
    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    //build bars
    svg
      .selectAll("rect")
      //@ts-ignore
      .data(dataset, (dataset) => dataset)
      .enter()
      .append("rect")
      //@ts-ignore
      .attr("x", function (d, i) {
        //@ts-ignore
        return xScale(i);
      })
      .attr("y", function (d) {
        return h - yScale(d.cases);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return yScale(d.cases);
      })
      .attr("fill", (d) => "red");

    //text labels on bars
    svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function (d) {
        return d.country;
      })
      .attr("x", function (d, i) {
        //@ts-ignore
        return xScale(i) + xScale.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return h - yScale(d.cases) + 14;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("text-anchor", "middle");
  };
  return (
    <div>
      <h3> Barchart</h3>
      <div id="bar-chart" />
    </div>
  );
};

export default BarChart;
