import React, { memo, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";

type Props = {
  width: number;
  height: number;
  data: Array<Object>;
};

const TestChart: React.FC<Props> = ({ width, height, data }) => {
  const [dataset, setData] = useState<any[]>([]);
  const [dataUpdate, setDataUpdate] = useState<any[]>([]);
  const mydata = data;
  const [choice, setChoice] = useState<any[]>([]);
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (countries.length > 0) {
      filldata(mydata);
      d3.select("#bar-chart").select("svg").remove();
      drawChart();
    } else {
      getCountry();
    }
  }, [countries]);
  useEffect(() => {
    updatedata(mydata);
    d3.select("#bar-chart").select("svg").remove();
    drawChart();
    console.log(dataset)
  }, []);

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
  const updatedata = (items: any) => {
    setData(dataUpdate);
    setDataUpdate([]);
    items.map((item: any) => {
      choice.map((d) => {
        if (item.country === d.value) {
          if (!dataUpdate.includes(item)) {
            dataUpdate.push(item);
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

      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));
    //draw bar

    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")

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

      .attr("fill", (d) => "blue");
    //change and update
    d3.select(".select").on("change", function () {
      // @ts-ignore
      xScale.domain(d3.range(dataUpdate.length));
      yScale.domain([
        d3.min(dataUpdate, (d) => d.cases),
        d3.max(dataUpdate, (d) => d.cases),
      ]);
      // @ts-ignore
      svg.select(".x-axis").transition().duration(1000).call(d3.axisBottom(x));

      // update Y axis
      // @ts-ignore
      svg.select(".y-axis").transition().duration(1000).call(d3.axisLeft(y));
      //update bar
      let barsUpdate = svg.selectAll("rect").data(dataUpdate);

      barsUpdate
        .enter()
        .append("rect")
        // @ts-ignore
        .transition()
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
        .attr("fill", (d) => "blue")
        .attr("transform", `translate(10,0)`);
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

export default TestChart;
