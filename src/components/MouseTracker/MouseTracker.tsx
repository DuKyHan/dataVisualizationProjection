import React, { ReactNode, useEffect, useRef, useState } from "react";
import "./MouseTracker.scss";
import * as d3 from "d3";

interface Props {
  children?: ReactNode;
  hoverCountry: String | null | undefined;
  countryCode: number | null | undefined;
  isHover: boolean;
}

function MouseTracker({ children, hoverCountry, countryCode, isHover }: Props) {
  let tooltipWidth = 150;
  let tooltipHeight = 40;
  type Coordinate = {
    [key: string]: string | number;
    x: number;
    y: number;
  };
  const [pos, setPos] = useState<Coordinate>({
    x: 0,
    y: 0,
  });
  const svgRef = React.useRef<SVGSVGElement>(null);
  const tooltipRef = React.useRef<SVGSVGElement>(null);

  let accessRef = d3.select(svgRef.current).on("mousemove", (event) => {
    let coords = d3.pointer(event);
    setPos({ x: coords[0], y: coords[1] });
  });
  return (
    <svg ref={svgRef} width="100%" viewBox="0 0 1200 700" className="world-map">
      {children}
      {isHover && (
        <foreignObject
          className="tooltip-container"
          ref={tooltipRef}
          width={tooltipWidth}
          height={tooltipHeight}
          x={
            pos.x < tooltipWidth
              ? pos.x + tooltipWidth - 130
              : pos.x - tooltipWidth + 130
          }
          y={
            pos.y < tooltipHeight
              ? pos.y + tooltipHeight + 10
              : pos.y - tooltipHeight - 10
          }
        >
          {hoverCountry}
        </foreignObject>
      )}
    </svg>
  );
}
export default MouseTracker;
