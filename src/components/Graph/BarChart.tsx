import React, { memo, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import ToolTipContainer from "../ToolTipContainer/ToolTipContainer";
import { Tooltip } from "react-tooltip";
type Props = {
  width: number;
  height: number;
  data: Array<Object>;
};

const BarChart: React.FC<Props> = ({ width, height, data }) => {
  const [dataset, setData] = useState<any[]>([]);
  const mydata = data;
  const [choice, setChoice] = useState<any[]>([]);
  const [countries, setCountries] = useState([]);
  const [content, setTooltipContent] = useState("");

  useEffect(() => {
    if (countries.length > 0) {
      filldata(mydata);
      d3.select("#bar-chart").select("svg").remove();
      drawChart();
    } else {
      getCountry();
    }
  }, [countries, choice]);

  const filldata = (items: any) => {
    setData([]);
    items.map((item: any) => {
      choice.map((d) => {
        if (item.country === d.value) {
          if (!dataset.includes(item)) {
            dataset.push(item);
          }
        }
      });
    });
  };

  const getCountry = () => {
    setCountries(
      // @ts-ignore
      data.map((d: any) => {
        return { label: d.country, value: d.country };
      })
    );
  };

  const drawChart = () => {
    const margin = { top: 30, right: 50, bottom: 50, left: 80 };

    var x = d3
      .scaleBand()
      .domain(
        dataset.map((d) => {
          return d.country;
        })
      )
      .rangeRound([0, width]);

    const xScale = d3
      .scaleBand()
      // @ts-ignore
      .domain(d3.range(dataset.length))
      .rangeRound([0, width])
      .paddingInner(0.05);

    const yScale = d3
      .scaleLinear()
      // @ts-ignore
      .domain([
        d3.min(dataset, (d) => d.cases),
        d3.max(dataset, (d) => d.cases),
      ])
      .range([30, height]);

    const svg = d3
      .select("#bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    var y = d3
      .scaleLinear()
      .domain([0, Math.max(...dataset.map(({ cases }) => cases))])
      .range([height, 0]);

    svg
      .append("g")
      .attr("class", "x-axis")
      .transition()
      .delay(function (d, i) {
        return i * 500;
      })

      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg
      .append("g")
      .attr("class", "y-axis")
      .transition()
      .delay(function (d, i) {
        return i * 500;
      })
      .call(d3.axisLeft(y).ticks(17));
    var opacityrange = d3
      .scaleLinear()
      .domain([0, Math.max(...dataset.map(({ cases }) => cases))])
      .range([0.5, 1]);
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .transition()
      .delay(function (d, i) {
        return i * 500;
      })
      .duration(1000)
      // @ts-ignore
      .attr("x", function (d, i) {
        // @ts-ignore
        return xScale(i);
      })
      .attr("y", function (d) {
        return height - yScale(d.cases);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function (d) {
        return yScale(d.cases);
      })
      .attr("fill", "#55165e")
      .style("opacity", function (d) {
        return opacityrange(d.cases);
      });
    svg
      .selectAll("rect")
      .on("mouseover", (event, d) => {
        // @ts-ignore
        // prettier-ignore
        setTooltipContent(<ToolTipContainer cases={d.cases} country={d.country} todayCases={d.todayCases} deaths={d.deaths} flag={d.countryInfo.flag} casesPerOneMillion={d.casesPerOneMillion}/>)
      })
      .on("mouseleave", (d) => {
        setTooltipContent("");
      });

    svg
      .selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function (d) {
        return d.cases;
      })
      .attr("x", function (d, i) {
        //@ts-ignore
        return xScale(i) + xScale.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return height - yScale(d.cases) - 5;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  };
  return (
    <div>
      <Tooltip float anchorId="bar-chart" content={content} />
      <h3> Barchart</h3>
      <p>Choose list countries to display </p>
      <MultiSelect
        className="select"
        options={countries}
        value={choice}
        onChange={setChoice}
        labelledBy="Select"
      />

      <div id="bar-chart" />
    </div>
  );
};

export default BarChart;
