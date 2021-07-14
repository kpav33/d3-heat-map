let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

let values = [];
let baseTemperature;

let xScale;
let yScale;

let width = 1200;
let height = 600;
let padding = 80;

let svg = d3.select("svg");
let legend = d3.select("legend");
let tooltip = d3.select("#tooltip");

function drawCanvas() {
  svg.attr("width", width).attr("height", height);
}

function generateScales() {
  xScale = d3
    .scaleLinear()
    .domain([d3.min(values, (d) => d.year), d3.max(values, (d) => d.year)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
}

function drawCell() {
  svg
    .selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance)
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
    .attr("width", "3px")
    .attr("height", (height - 2 * padding) / 11)
    .attr("fill", (d) => {
      if (d.variance < -1) return "blue";
      if (d.variance < 0) return "lightblue";
      if (d.variance > 1) return "red";
      if (d.variance >= 0) return "lightcoral";
    })
    .on("mouseover", (d) => {
      let year = d.year;
      tooltip
        .attr("data-year", year)
        .style("left", d3.event.pageX - 35 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("visibility", "visible")
        .text(d.variance.toFixed(1) + "°C");
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));
}

function generateAxes() {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
}

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    values = data.monthlyVariance;
    baseTemperature = data.baseTemperature;
    console.log(values);
    console.log(baseTemperature);
    drawCanvas();
    generateScales();
    drawCell();
    generateAxes();
  });
