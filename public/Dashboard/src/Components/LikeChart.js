import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';

//Stacked Bar Chart
class LikeChart extends React.Component {
  constructor(props){
    super(props)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.componentDidUpdate = this.componentDidUpdate.bind(this)
  }

  //First draw
  componentDidMount() {
    //Data
    let size = this.props.data.length
    let data = this.props.data.filter((obj) => {
      return obj.likes + obj.dislikes + obj.superlikes > 0
    })
    data.sort(this._sortLikes);
    data = data.slice(data.length - 5, data.length);

    //Graph's dimensions
    var margin = {
      top: window.innerHeight*0.07,
      right: window.innerWidth*0.07,
      bottom: window.innerHeight*0.07,
      left: window.innerWidth*0.07
      };
    var navbar = document.getElementById("navbar").clientHeight
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight - navbar - margin.top - margin.bottom;

    //Draw canvas
    var svg = d3.select(".wrapper").append("svg")
        .attr("width", width + margin.left)
        .attr("height", height + margin.top)
        .attr("align", "center")
        .append("g")
        //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var colors = ["#D32F2F", "#388E3C", "#1976D2"]
    //Scales and axis
    var x = d3.scaleLinear().range([0, width*(3/4)]);
    var y = d3.scaleBand().range([height, 0]);
    var xAxis = d3.axisTop(x).ticks(10);
    var yAxis = d3.axisLeft(y)

    //Define domains
    x.domain([0, d3.max(data, function(d) { return d.likes + d.dislikes + d.superlikes; })]);
    y.domain(data.map(function(d) { return d.label; }))
      .paddingInner(0.1)
      .paddingOuter(0.5);

    //draw axis
  /*  svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(" + width*(1/4) + "," + 0 + ")");*/
    svg.append("g")
        .attr("class", "y axis")
        .attr("fill", "#212121")
        .call(yAxis)
        .attr("transform", "translate(" + width*(1/4) + "," + 0 + ")")
    //Insert initial data
    this.insert(svg, data, width, x, y)
    this.setState({svg: svg});

    svg.append("text")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .style("font-size", "1.7em")
      .style("font-family", "'Fira Mono', Times New Roman")
      .text("Top 5")

    var legend = svg.selectAll(".legend")
      .data(["Dislike", "Like", "Megalike"])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + i*Math.sqrt(i)*100 + "," + height + ")"; })
      .style("font", "1.3em 'Fira Mono'");

    let icons = ['\uf165', '\uf164','\uf004']

    legend.append("text")
      .attr("x", width/2 + 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '1.3em' )
      .style("fill", function(d, i){return colors[i]})
      .text(function(d, i) { return icons[i] });

    legend.append("text")
      .attr("x", width/2)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("fill", "#212121")
      .text(function(d) { return d; });

  }

  //Animation step
  componentDidUpdate() {
    //Data
      let data = this.props.data.filter((obj) => {
        return obj.likes + obj.dislikes + obj.superlikes > 0
      })
      data.sort(this._sortLikes);
      if(data.length > 5){
        data = data.slice(data.length - 5, data.length);
      }
      data = data.map((obj) => {
        if(obj.label.length > 20){
          let t = obj.label.split(" ")
          let nt = t[0]
          let i = 1
          while(true){
            let tmp = nt + " " + t[i]
            if(tmp.length > 20){
              break;
            }
            nt = tmp
            i += 1
          }
          obj.label = nt
        }
        return obj
      })

      //Graph's dimensions
      var margin = {
          top: window.innerHeight*0.07,
          right: window.innerWidth*0.07,
          bottom: window.innerHeight*0.07,
          left: window.innerWidth*0.07
        };
      let svg = this.state.svg
      var navbar = document.getElementById("navbar").clientHeight
      var width = window.innerWidth - margin.left - margin.right;
      var height = window.innerHeight - navbar - margin.top - margin.bottom;

      //Scales and axis
      var x = d3.scaleLinear().range([0, width*(3/4)]);
      var y = d3.scaleBand().range([height, 0]);
      x.domain([0, d3.max(data, function(d) { return d.likes + d.dislikes + d.superlikes; })]);
      y.domain(data.map(function(d) { return d.label; })).paddingInner(0.1).paddingOuter(0.5);
      //var xAxis = d3.axisTop(x).ticks(10);
      var yAxis = d3.axisLeft(y);

      //Update Axis
      //svg.select('.x.axis').transition().duration(300).call(xAxis);
      svg.select(".y.axis").transition().duration(300).call(yAxis)
      /*svg.selectAll(".tick text")
        .each(function(d,i) {
          let no = d3.select(this)
          let words = d.split(" ").reverse();
          let word;
          let line = []
          let x = no.attr("x")
          let li = 0
          let lh = 1.1
          let y = no.attr("y")
          let dy = 0
          let tspan = no
            .text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em")
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width*(1/4)) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = no.append("tspan")
                  .attr("x", x)
                  .attr("y", y)
                  .attr("dy", ++li * lh + dy + "em")
                  .text(word);
            }
        }
        })*/
      //Insert new entries
      this.insert(svg, data, width, x, y);
      //Update old entries
      this.updateGraph(svg, data, width, x, y);
      svg.exit().remove();

  }

  //Function that draws new data entries to the graph
  insert(svg, data, width, x, y) {
    //Draw dislike bar
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.dislikes); })
        .attr("transform", "translate(" + width*(1/4) + "," + 0 + ")")
        .attr("fill", "#D32F2F")
    //Draw like bar
    svg.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar2")
        .attr("x", function(d) { return x(d.dislikes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.likes); })
        .attr("transform", "translate(" + width*(1/4) + "," + 0 + ")")
        .attr("fill", "#388E3C")
    //Draw superlike bar
    svg.selectAll(".bar3")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar3")
        .attr("x", function(d) { return x(d.dislikes) + x(d.likes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.superlikes); })
        .attr("transform", "translate(" + width*(1/4) + "," + 0 + ")")
        .attr("fill", "#1976D2 ")
  }

  //Updates the graph by animating the transition
  updateGraph(svg, data, width, x, y) {
    //Animate dislike bar
    svg.selectAll(".bar")
        .data(data)
        .transition()
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.dislikes); })

    //Animate like bar
    svg.selectAll(".bar2")
        .data(data)
        .transition()
        .attr("x", function(d) { return x(d.dislikes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.likes); })

    //Animate superlike bar
    svg.selectAll(".bar3")
        .data(data)
        .transition()
        .attr("x", function(d) { return x(d.dislikes) + x(d.likes); })
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.label); })
        .attr("width", function(d) { return x(d.superlikes); })
  }

  //Sorting algorithm for graph
  _sortLikes(a, b) {
    return (a.likes + 2*a.superlikes - a.dislikes) - (b.likes + 2*b.superlikes - b.dislikes);
  }

  render() {
    return (
      <div className="section">
        <div className="wrapper" style={{textAlign:'center'}}>
        </div>
      </div>
    )
  }
}

export default LikeChart;
