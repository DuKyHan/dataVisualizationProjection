import React from "react";
import * as d3 from "d3";
function LineChartV2() {
  async function draw() {
    // Data
    const dataset = await d3.csv("data.csv");

    // Accessors
    const parseDate = d3.timeParse("%Y-%m-%d");
    const xAccessor = (d: any) => parseDate(d.date);
    const yAccessor = (d: any) => parseInt(d.close);

    // Dimensions
    let dimensions = {
      width: 1000,
      height: 500,
      margins: 50,
      containerWidth: 0,
      containerHeight: 0,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    // Draw Image
    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    // Selections
    const container = svg
      .append("g")
      .attr(
        "transform",
        `translate(${dimensions.margins}, ${dimensions.margins})`
      );

    const tooltip = d3.select("#tooltip");
    const tooltipDot = container
      .append("circle")
      .attr("r", 5)
      .attr("fill", "#fc8781")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Scales
    const yScale = d3
      .scaleLinear()
      // @ts-ignore
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.containerHeight, 0])
      .nice();

    const xScale = d3
      .scaleTime()
      // @ts-ignore
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.containerWidth]);

    // Line Generator
    const lineGenerator = d3
      .line()
      // @ts-ignore
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)));

    // Line
    container
      .append("path")
      .datum(dataset)
      // @ts-ignore
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "#30475e")
      .attr("stroke-width", 2);

    // Axis
    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `$${d}`);

    container.append("g").classed("yAxis", true).call(yAxis);

    const xAxis = d3.axisBottom(xScale);

    container
      .append("g")
      .classed("xAxis", true)
      .style("transform", `translateY(${dimensions.containerHeight}px)`)
      .call(xAxis);

    // Tooltip
    container
      .append("rect")
      .attr("width", dimensions.containerWidth)
      .attr("height", dimensions.containerHeight)
      .style("opacity", 0)
      .on("touchmouse mousemove", function (event) {
        const mousePos = d3.pointer(event, this);
        // x coordinate stored in mousePos index 0
        const date = xScale.invert(mousePos[0]);

        // Custom Bisector - left, center, right
        const dateBisector = d3.bisector(xAccessor).left;
        const bisectionIndex = dateBisector(dataset, date);
        // math.max prevents negative index reference error
        const hoveredIndexData = dataset[Math.max(0, bisectionIndex - 1)];

        // Update Image
        tooltipDot
          .style("opacity", 1)
          // @ts-ignore
          .attr("cx", xScale(xAccessor(hoveredIndexData)))
          .attr("cy", yScale(yAccessor(hoveredIndexData)))
          .raise();

        tooltip
          .style("display", "block")
          .style("top", `${yScale(yAccessor(hoveredIndexData)) - 50}px`)
          // @ts-ignore
          .style("left", `${xScale(xAccessor(hoveredIndexData))}px`);

        tooltip.select(".price").text(`$${yAccessor(hoveredIndexData)}`);

        const dateFormatter = d3.timeFormat("%B %-d, %Y");

        tooltip
          .select(".date")
          // @ts-ignore
          .text(`${dateFormatter(xAccessor(hoveredIndexData))}`);
      })
      .on("mouseleave", function () {
        tooltipDot.style("opacity", 0);
        tooltip.style("display", "none");
      });
  }
  return <div id="#chart"></div>;
}

export default LineChartV2;
