const url="https://assets.codepen.io/1940996/gands_3.csv"
  
d3.csv(url, function(data) {
	
    const w = 1000;
    const h = 500;
    const xpad = 75;
    const ypad = 25;
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([1960, 2015])
      .range([xpad, w - xpad]);
    
    const yScale = d3.scaleLinear()
      .domain([-3000, 3000])
      .range([h - ypad, ypad]);
    
    // Create SVG
    const svg = d3.select("div")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
    
    // Create axes
    const xAxis = d3.axisBottom(xScale)
                  .tickFormat(d3.format("d"));
    
    const yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
       .attr("transform", "translate(0," + (h - ypad) + ")")
       .attr("id","x-axis")
       .call(xAxis);
    
    svg.append("g")
       .attr("transform", "translate(" + xpad  + ",0)")
       .attr("id","y-axis")
       .call(yAxis);
  
    svg.append("g")
       .attr("transform", "translate(25,250)")
       .append("text")
       .style("font-family", "arial")
       .attr("text-anchor", "middle")
       .attr("transform", "rotate(-90)")
       .text("Trade Amount in Billion $");
    
    // Create div for tooltip
    d3.select("body")
      .append("div")
      .attr("id", "tooltip");  
    
    // Add bars
    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", (d) => xScale(d.Year))
       .attr("y", (d) => h/2 - Math.max((d.Amount/1000)/(6000/(h - 2*ypad)), 0))
       .attr("width", 14)
       .attr("height", (d) => Math.abs((d.Amount/1000))/(6000/(h - 2*ypad)))
       .attr("class", function(d) {if (d.Type == "Ex") {return "exBar"} 
                                   else if (d.Type == "Im") {return "imBar"}
                                   else if (d.Type == "ExGoods") {return "exGoodsBar"}
                                   else {return "imGoodsBar"}})
       
       // Set tooltip behavior
       .on("mouseover", function(d) {
          d3.select('#tooltip')
            .html("Year: " + d.Year + "<br><br>Export Total: $" + d3.format(",.2f")(d.ExTotal/1000) + " B<br>"
                 + "Goods Exported: $" + d3.format(",.2f")(d.ExGoods/1000) + " B<br>"
                 + "Services Exported: $" + d3.format(",.2f")(d.ExServ/1000) + " B<br><br>"
                 + "Import Total: $" + d3.format(",.2f")(d.ImTotal/1000) + " B<br>"
                 + "Goods Imported: $" + d3.format(",.2f")(d.ImGoods/1000) + " B<br>"
                 + "Services Imported: $" + d3.format(",.2f")(d.ImServ/1000) + " B<br><br>"
                 + "Balance: $" + d3.format(",.2f")(d.BalTotal/1000) + " B<br>"
                 + "Goods Balance: $" + d3.format(",.2f")(d.BalGoods/1000) + " B<br>"
                 + "Services Balance: $" + d3.format(",.2f")(d.BalServ/1000) + " B<br><br>")
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("font-family", "arial")
            .style("background-color", "#ffffaa")
       })
       .on("mouseout", function() {
          d3.select("#tooltip")
            .transition()
            .style("opacity", 0)
       })
       .on("mousemove", function() {
          d3.select("#tooltip")
            .style("left", (d3.event.pageX+10) + "px")
            .style("top", (d3.event.pageY+10) + "px")
       });
    
    //Filter data used in lines
    let filteredData = data.filter(function(d) { 
        if( d.Type == "Ex") {return d;} 
    });
  
   // Total balance line
   svg.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x((d) => xScale(d.Year))
        .y((d) => h/2 - (d.BalTotal/1000)/(6000/(h - 2*ypad)))
        )
     .attr("transform", "translate(8,0)");
     
     // Goods balance line
     svg.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x((d) => xScale(d.Year))
        .y((d) => h/2 - (d.BalGoods/1000)/(6000/(h - 2*ypad)))
        )
     .attr("transform", "translate(8,0)");
     
     // Service balance line
     svg.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 2.5)
      .attr("d", d3.line()
        .x((d) => xScale(d.Year))
        .y((d) => h/2 - (d.BalServ/1000)/(6000/(h - 2*ypad)))
        )
     .attr("transform", "translate(8,0)");
     
    // Legend
    function legend(x, y, type, space, color, text) {
      if(type == 'bar') {
      
     svg.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("x", x + space)
        .attr("y", y)
        .attr("fill", color);
  
     svg.append("text")
        .attr("x", x)
        .attr("y", y + 15)
        .text(text)
        .attr("font-family", "arial");
      } else if (type = "line") {
      
        svg.append("rect")
        .attr("width", 15)
        .attr("height", 2.5)
        .attr("x", x + space)
        .attr("y", y)
        .attr("fill", color);
  
     svg.append("text")
        .attr("x", x)
        .attr("y", y + 8)
        .text(text)
        .attr("font-family", "arial");
      }
    }; 
  
    legend(100, 70, "bar", 175, "#66bbbb", "Goods Exported");
    legend(100, 100, "bar", 175, "#99eeee", "Services Exported");
    legend(100, 130, "bar", 175, "#ffaaaa", "Goods Imported");
    legend(100, 160, "bar", 175, "#ffdddd", "Services Imported");
  
    legend(100, 325, "line", 155, "green", "Total Balance");
    legend(100, 355, "line", 155, "blue", "Goods Balance");
    legend(100, 385, "line", 155, "red", "Services Balance");
  
});