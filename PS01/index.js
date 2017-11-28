//Bar Chart Stuff!!!!!!!!!!!!!!!!!!!!!!!!!!!



var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 100;
var marginTop = 50;

var nestedData = [];

var svg1 = d3.select('#svg1')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var svg2 = d3.select('#svg2')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, width-2*marginLeft]).padding(0.1);
var scaleY = d3.scaleLinear().range([height-2*marginTop, 0]);
var scaleY2 = d3.scaleLinear().range([height-2*marginTop, 0]);


d3.csv('./Clean Energy.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2006'})[0].values;


    svg1.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg1.append("g")
        .attr('class', 'yaxis')
        .call(d3.axisLeft(scaleY));

    svg2.append("g")
        .attr('class','xaxis')
        .attr('transform','translate(0,' + (height-2*marginTop) + ')')  //move the x axis from the top of the y axis to the bottom
        .call(d3.axisBottom(scaleX));

    svg2.append("g")
        .attr('class', 'yaxis2')
        .call(d3.axisLeft(scaleY2));

    svg1.append('text')
        .text('Clean Energy Produced, in MWh')
        .attr('transform', 'translate(-30,100)rotate(270)')
        .style('text-anchor','middle')
        .style("font-size",'12px');

    svg2.append('text')
        .text('Clean Energy Over Total Energy Produced, in %')
        .attr('transform', 'translate(-30,100)rotate(270)')
        .style('text-anchor','middle')
        .style("font-size",'12px');

    $('#testCircle').tooltip();

    drawPoints(loadData);

});

function drawPoints(pointData) {

    scaleX.domain(pointData.map(function (d) {
        return d.name;
    }));
    scaleY.domain([0, d3.max(pointData.map(function (d) {
        return +d.clean
    }))]);
    scaleY2.domain([0, d3.max(pointData.map(function (d) {
        return +d.per
    }))]);

    d3.selectAll('.xaxis')
        .call(d3.axisBottom(scaleX));

    d3.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    d3.selectAll('.yaxis2')
        .call(d3.axisLeft(scaleY2));


    var rects = svg1.selectAll('.bars')
        .data(pointData, function (d) {
            return d.name;
        });

    rects.exit()
        .remove();

    rects
        .transition()
        .duration(200)
        .attr('x', function (d) {
            return scaleX(d.name);
        })
        .attr('y', function (d) {
            return scaleY(d.clean);
        })
        .attr('width', function (d) {
            return scaleX.bandwidth();
        })
        .attr('height', function (d) {
            return height - 2 * marginTop - scaleY(d.clean);
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function (d) {
            return d.clean;
        });

    rects
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('id', function (d) {
            return d.name;
        })
        .attr('fill', "lightgreen")
        .attr('x', function (d) {
            return scaleX(d.name);
        })
        .attr('y', function (d) {
            return scaleY(d.clean);
        })
        .attr('width', function (d) {
            return scaleX.bandwidth();
        })
        .attr('height', function (d) {
            return height - 2 * marginTop - scaleY(d.clean);  //400 is the beginning domain value of the y axis, set above
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function (d) {
            return d.clean;
        })
        .on('mouseover', function (d) {
            d3.select(this).attr('fill', 'orange');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill', 'orange')
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('fill', 'lightgreen');

            currentID = d3.select(this).attr('id');
            svg2.selectAll('#' + currentID).attr('fill', 'lightgreen')
        });


    var rects2 = svg2.selectAll('.bars')
        .data(pointData, function(d){return d.name;});


    rects2.exit()
        .remove();


    rects2
        .transition()
        .duration(200)
        .attr('x',function(d){
            return scaleX(d.name);
        })
        .attr('y',function(d){
            return scaleY2(d.per);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.per);  //400 is the beginning domain value of the y axis, set above
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d) {
            console.log(d.per, d.clean);
            return d.per;
        });


    rects2
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('id', function(d){return d.name;})
        .attr('fill', "lightgreen")
        .attr('x',function(d){
            return scaleX(d.name);
        })
        .attr('y',function(d){
            return scaleY2(d.per);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return height-2*marginTop - scaleY2(d.per);  //400 is the beginning domain value of the y axis, set above
        })
        .attr('data-toggle', 'tooltip')
        .attr('title', function(d) {
            return d.per;
        })
        .on('mouseover', function(d){
            d3.select(this).attr('fill','orange');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID).attr('fill','orange')
        })
        .on('mouseout', function(d){
            d3.select(this).attr('fill','lightgreen');

            currentID = d3.select(this).attr('id');
            svg1.selectAll('#' + currentID).attr('fill','lightgreen')
        });
    $('[data-toggle="tooltip"]').tooltip();
}


function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}


function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}


//Map Stuff!!!!!!!!!!!!!!!!!!!!!!!!!!!!




var marginLeft = 800;
var marginTop = -1300;


var solar;
var wind;
var geothermal;

var clicked = true;


var albersProjection = d3.geoAlbersUsa()
    .scale(8000)
    .translate([(width), (height/50000)]);



path = d3.geoPath()
    .projection(albersProjection);

var svg3 = d3.select('#svg3')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');



d3.json('./cb_2016_15_bg_500k.json', function(dataIn){



    svg3.selectAll("path")
        .data(dataIn.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "feature")
        .attr('fill','gainsboro')
        .attr('stroke','black')
        .attr('stroke-width',.25);


    d3.csv('./Hawaii_Geothermal.csv', function(dataIn){

        svg3.selectAll('circle')
            .data(dataIn)
            .enter()
            .append('circle')
            .attr('cx', function (d){
                return albersProjection([d.long, d.lat])[0]
            })
            .attr('cy', function (d){
                return albersProjection([d.long, d.lat])[1]
            })
            .attr('r', 3)
            .attr('fill', function (d){
                return d.fill;
            })
            .attr('stroke','black')
            .attr('stroke-width',1)
            .attr('data-toggle', 'tooltip')
            .attr('title', function(d) {
                return d.site;
            });
        $('[data-toggle="tooltip"]').tooltip();
    });


});

//Pie Chart!!!!!!!!!!!!!!!!!!!!!!



console.log(width, height);

var marginLeft = 0;
var marginTop = 50;

var pieX = width/2;
pieY = height/2;


var svg4 = d3.select('#svg4')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var pieGroup = svg4.append('g')
    .attr('transform', 'translate(' + pieX + ',' + pieY + ')');



var scaleColor = d3.scaleOrdinal().domain(["Biomass", "Geothermal", "Solar", "Hydro", "Wind"])
    .range(["lightsalmon","salmon","darksalmon","lightcoral","indianred"]);


var nestedData = [];

var pieRadius = 220;

var makeArc = d3.arc()
    .innerRadius(50)
    .outerRadius(pieRadius);

var makePie = d3.pie()
    .sort(null) //organized pie stuff in an order, how to put in an order
    .value(function(d){
        return d.total
    });


var labelArc = d3.arc()
    .outerRadius(pieRadius-50)
    .innerRadius(pieRadius-50);


d3.csv('./Pie.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;

    g = pieGroup.selectAll('.arc')
        .data(makePie(loadData))
        .enter()
        .append('g')
        .attr('class','arc');

    g.append('path')
        .attr('d',makeArc)
        .attr('fill', function(d){ return scaleColor(d.data.type)})
        .attr('opacity',.5)
        .attr('stroke','black')
        .attr('stroke-width',3)
        .attr('stroke-opacity',.7);;

    g.append('text')
        .attr("transform", function(d) {
            return "translate(" + labelArc.centroid(d) + ")"; })
        .attr('dy', '.35em')
        .attr('text-anchor','middle')
        .text(function(d){
            return d.data.type
        });



});



