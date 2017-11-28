var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');


//these are the size that the axes will be on the screen; set the domain values after the data loads.
var scaleX = d3.scaleTime().range([0, width-2*marginLeft]);
var scaleY = d3.scaleLinear().range([(height-2*marginTop), 0]).domain([0,200]);

// Add the x Axis
svg.append("g")
    .attr('class','x-axis')
    .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the axis to the bottom of the screen
    .call(d3.axisBottom(scaleX));


var parser = d3.timeParse("%m/%d/%Y");

//import the data from the .csv file
d3.csv('./daca_timeline.csv', function(dataIn){

    dataIn.forEach(function(d){
        d.date = parser(d.start_date);
    });

    scaleX.domain([d3.min(dataIn.map(function(d){return d.date})), d3.max(dataIn.map(function(d){return d.date}))]);

    d3.select('.x-axis')
        .call(d3.axisBottom(scaleX).ticks(d3.timeYear.every(2)));

    var lines = svg.selectAll('.date-lines')
        .data(dataIn)
        .enter();

    lines
        .append('line')
        .attr('class', 'date-lines')
        .attr('x1',function(d){
            return scaleX (d.date);
        })
        .attr('x2', function(d){
            return scaleX (d.date);
        })
        .attr('y1', scaleY(0))
        .attr('y2', scaleY(200))
        .attr('stroke-width',1)
        .attr('stroke','gray');

    lines.append('text')
        .attr('x', function(d){
            return scaleX (d.date);
        })
        .attr('y', scaleY(200))
        .text(function(d){return d.text});

});


//from http://stackoverflow.com/questions/24784302/wrapping-text-in-d3
function wrap(text, wordList, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.datum().text.split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.15, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                .append("tspan")
                .attr("x", x)
                .attr("y", y)
                .attr("glass",'textbox')
                .attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", ++lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
    });
}