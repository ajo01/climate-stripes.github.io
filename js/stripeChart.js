class StripeChart {
  /**
   * Class constructor with initial configuration
   * @param {Object}
   */
  constructor(_config, data, selectedCountry, width, height) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: width || 1300,
      containerHeight: height || 500,
      margin: {
        top: 50,
        right: 50,
        bottom: 100,
        left: 0,
      },
    };
    this.data = data;
    this.selectedCountry = selectedCountry || "Canada";
    this.initVis();
  }

  //  Create SVG area, initialize scales and axes
  initVis() {
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight)
      .attr("id", "bar-chart");

    // create chart
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.xAxisG = vis.chart
      .append("g")
      .attr("transform", `translate(0,0)`)
      .attr("class", "x-axis");

    vis.xScale = d3.scaleLinear().domain([1961, 2023]).range([0, vis.width]);

    vis.colorScale = d3
      .scaleDiverging(d3.interpolateRdBu)
      .domain([2.5, 0, -2.5]);

    vis.xAxis = d3
      .axisBottom(vis.xScale)
      .tickSize(vis.height)
      .ticks(5)
      .tickPadding(20)
      .tickFormat(d3.format("d"));
  }

  // Prepare data and scales
  updateVis(newSelectedCountry) {
    let vis = this;

    vis.selectedCountry = newSelectedCountry || vis.selectedCountry;

    vis.selectedCountryData = vis.data.filter(
      (d) => d.Country === vis.selectedCountry
    );
    vis.selectedCountryData = vis.selectedCountryData[0];
    delete vis.selectedCountryData.Country;

    vis.renderVis();
  }

  //Bind data to visual elements, update axes
  renderVis() {
    let vis = this;

    const yearRange = 2023 - 1961; // 62
    const barWidth = Math.ceil(vis.width / yearRange);

    vis.bar = vis.chart
      .selectAll(".bar")
      .data(Object.entries(vis.selectedCountryData))
      .join("rect")
      .attr("class", `bar`)
      .attr("x", (d, i) => vis.xScale(1961 + i))
      .attr("y", 0)
      .attr("width", barWidth)
      .attr("height", vis.height)
      .attr("fill", (d) => {
        const tempValue = d[1];
        return vis.colorScale(tempValue);
      });

    vis.chart
      .append("text")
      .attr("x", 0)
      .attr("y", -20)
      .text(vis.selectedCountry)
      .attr("class", "chart-title");

    // vis.bar
    //   .on("mouseover", (event, d) => {
    //     d3
    //       .select("#tooltip")
    //       .style("display", "block")
    //       .style("left", event.pageX + vis.config.tooltipPadding + "px")
    //       .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
    //   <div>${d[0]}</div>
    //   <div class="tooltip-cost">${d[1]}</div>
    // `);
    //   })
    //   .on("mouseleave", () => {
    //     d3.select("#tooltip").style("display", "none");
    //   });

    vis.xAxisG.call(vis.xAxis);
  }
}
