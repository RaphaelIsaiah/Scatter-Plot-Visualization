document.addEventListener("DOMContentLoaded", function () {
  const padding = 40;
  let dataset;

  // Create tooltip element once
  const tooltip = d3
    .select("#chart-container")
    .append("div")
    .attr("id", "tooltip")
    .style("background-color", "#EBEBE8")
    .style("width", "20%")
    .style("color", "#31352E")
    .style("padding", "5px")
    .style("border", "1px solid #D1E2C4")
    .style("border-radius", "5px")
    .style("box-shadow", "2px 2px 5px #31352E")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("position", "absolute");

  // Fetch the data
  d3.json(
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
  ).then((data) => {
    dataset = data;
    renderChart();
    // Redraw chart on window resize
    window.addEventListener("resize", renderChart);
  });

  function renderChart() {
    // Remove any existing SVG
    d3.select("#chart-container").select("svg").remove();

    const container = d3.select("#chart-container");
    const { width, height } = container.node().getBoundingClientRect();

    // Create responsive SVG with viewBox and preserveAspectRatio
    const svg = container
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(dataset, (d) => d.Year - 1),
        d3.max(dataset, (d) => d.Year + 1),
      ]) // Include some padding
      .range([padding, width - padding]);

    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(dataset, (d) => new Date(d.Seconds * 1000)),
        d3.max(dataset, (d) => new Date(d.Seconds * 1000)),
      ])
      .range([height - padding, padding]);

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(4)
      .tickFormat(d3.format("d")); // Format as year only

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")); // Format as minutes:seconds

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Dots
    svg
      .selectAll(".dot")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(new Date(d.Seconds * 1000)))
      .attr("r", 5)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
      .attr("fill", (d) => (d.Doping ? "red" : "green"))
      .on("mouseover", function (e, d) {
        tooltip
          .attr("data-year", d.Year)
          .style("opacity", 1)
          .html(
            `Year: ${d.Year}<br>Time: ${d.Time}<br> ${
              d.Doping ? d.Doping : "No Doping Allegations"
            }`
          )
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY - 40}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    // Legend
    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${width - padding}, ${padding})`);

    // legend
    //   .append("rect")
    //   .attr("x", -70)
    //   .attr("y", 200)
    //   .attr("width", 150)
    //   .attr("height", 70)
    //   .style("fill", "none")
    //   .style("stroke", "#000");

    legend
      .append("rect")
      .attr("x", -10)
      .attr("y", 200)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", "green");

    legend
      .append("text")
      .attr("x", -150)
      .attr("y", 215)
      .text("No Doping Allegations")
      .style("font-size", "10px")


    legend
    .append("rect")
    .attr("x", -10)
    .attr("y", 235)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", "red");

    legend
      .append("text")
      .attr("x", -150)
      .attr("y", 250)
      .text("Riders with Doping Allegations")
      .style("font-size", "10px")

  }
});
