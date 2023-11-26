import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const forceBoundary = (width, height) => {
  return (node) => {
    if (node.x - node.radius < 0) node.x = node.radius;
    if (node.x + node.radius > width) node.x = width - node.radius;
    if (node.y - node.radius < 0) node.y = node.radius;
    if (node.y + node.radius > height) node.y = height - node.radius;
  };
}

function CircleLayoutComponent({ circles }) {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;
    const simulation = d3.forceSimulation(circles)
        .force("boundary", forceBoundary(width, height))
        // .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius(d => d.radius))

        .on("tick", ticked);

    function ticked() {
      svg.selectAll("image")
          .data(circles)
          .join("image")
          .attr("xlink:href", d => d.url)
          .attr("x", d => d.x - d.radius)
          .attr("y", d => d.y - d.radius)
          .attr("width", d => d.radius * 2)
          .attr("height", d => d.radius * 2)
          .attr("clip-path", "url(#circleClip)");
    }
  }, [circles]);

  return <svg ref={ref} width="100%" style={{ height: 'calc(100vh - 7rem)', backgroundColor: 'yellow' }}>
    <defs>
      <clipPath id="circleClip">
        <circle cx="50%" cy="50%" r="50%"></circle>
      </clipPath>
    </defs>
  </svg>;
}

export default CircleLayoutComponent;
