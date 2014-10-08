/**
    Custom binding for displaying a line graph
    Usage: data-bind="lineGraph: { data: data, width: width, height: height, padding: padding, paddingTop: paddingTop, paddingRight: paddingRight, paddingBottom: paddingBottom, paddingLeft: paddingLeft, animationSpeed: animationSpeed }"
*/
ko.bindingHandlers.lineGraph = {
    getXAxisDefinition: function (dataset) {
        // we want the x-axis to have nicely spaced out days, so we'll take the earliest and latest date in the dataset and interpolate the tick points
        var minX = new Date(new Date(d3.min(dataset, function (d) { return d.date; })));
        var maxX = new Date(new Date(d3.max(dataset, function (d) { return d.date; })));
        maxX = maxX.addDays(1);

        // strip off the hours, minutes and seconds for the day step calculation
        minX.setHours(0, 0, 0, 0);
        maxX.setHours(0, 0, 0, 0);

        // we want nicely spaced out tick values
        var dayStep;
        var daysBetween = app.utils.daysBetween(minX, maxX);
        dayStep = Math.ceil(daysBetween / 8);

        // create an array to hold the tick values
        var xAxisTickValues = [];
        var xAxisTickValue = minX.addDays(dayStep);
        while (xAxisTickValue < maxX) {
            xAxisTickValues.push(xAxisTickValue);
            xAxisTickValue = xAxisTickValue.addDays(dayStep);
        }
        maxX = xAxisTickValue;
        xAxisTickValues.push(maxX);

        return {
            min: minX,
            max: maxX,
            ticks: xAxisTickValues,
            tickDayStep: dayStep
        };
    },

    init: function (element, valueAccessor) {

        var binding = ko.unwrap(valueAccessor());

        // get the data
        var dataset = ko.unwrap(binding.data);
        if (app.utils.isNullOrUndefined(dataset) || dataset.length === 0) {
            return;
        }

        var goalLine = ko.unwrap(binding.goalLine);
        
        // get the animation speed
        element.animationSpeed = ko.unwrap(binding.animationSpeed) || 1000;

        // Define the resolution
        var width = ko.unwrap(binding.width) || 600;
        var height = ko.unwrap(binding.height) || 300;
        
        // Define the padding around the graph
        var padding = ko.unwrap(binding.padding) || 50;
        var paddingTop = ko.unwrap(binding.paddingTop) || padding;
        var paddingRight = ko.unwrap(binding.paddingRight) || padding;
        var paddingBottom = ko.unwrap(binding.paddingBottom) || padding;
        var paddingLeft = ko.unwrap(binding.paddingLeft) || padding;
        
        // Create the SVG 'canvas'
        var svg = d3.select(element)
            .append("svg")
            .attr("width", width + "px")
            .attr("height", height + "px");

        // Set the scales
        var xAxisDefinition = ko.bindingHandlers.lineGraph.getXAxisDefinition(dataset);
        element.xScale = d3.time.scale()
            .domain([xAxisDefinition.min, xAxisDefinition.max])
            .range([paddingLeft, width - paddingRight]);

        var yAxisMin = d3.min(dataset, function (d) { return d.value(); });
        var yAxisMax = d3.max(dataset, function (d) { return d.value(); });

        if (goalLine) {
            var goalLineMax = d3.max(goalLine, function(goal) { return goal.Value; } );
            yAxisMax = goalLineMax > yAxisMax ? goalLineMax : yAxisMax;

            //null date values in goal lines mean "forever" so set them to the edges of the x axis
            for (var i = 0; i < goalLine.length; i++ ) {
                if (app.utils.isNullOrUndefined(goalLine[i].startDate)) {
                    goalLine[i].startDate = xAxisDefinition.min;
                }
                if (app.utils.isNullOrUndefined(goalLine[i].endDate)) {
                    goalLine[i].endDate = xAxisDefinition.max;
                }
            }
        }

        var datasetHasNegatives = yAxisMin < 0;

        if (yAxisMin === 0 && yAxisMax === 0) { // if all zero, then default to 0 to 1 axis
            yAxisMax = 1;
        }

        var datasetIsAllNegative = yAxisMin < 0 && yAxisMax < 0;
        if (datasetIsAllNegative) { // push the axis up to zero if all negatives
            yAxisMax = 0;
            
            // temporary workaround for d3 not calculating the axis correctly when negatives are used, TODO: investigate further if this is a d3 bug or some missunderstanding
            dataset.push({ date: null, value: ko.observable(0) });
        }

        if (yAxisMin > 0) { // bring the axis down to zero if all positives
            yAxisMin = 0;
        }

        element.yScale = d3.scale.linear()
            .domain([yAxisMin, yAxisMax])
            .range([height - paddingTop, paddingBottom]);

        // draw the goal line if set
        var newGoals;
        if (goalLine) {
            newGoals = svg.selectAll(".goal-line")
                .data(goalLine)
                .enter();

            newGoals.append("rect")
                .attr("class", function(d, j) {
                    //need to check whether there is a goal line above this one
                    for (var i = 0; i < goalLine.length; i++) {
                        if (i !== j && d.Value < goalLine[i].Value) {
                            if (( goalLine[i].startDate <= d.startDate && goalLine[i].endDate >= d.startDate )
                                || ( goalLine[i].startDate <= d.endDate && goalLine[i].endDate >= d.endDate )) {

                                return "goal-shading lower";
                            }
                        }
                    }
                    return "goal-shading";
                });
        }

        // set rough # of ticks on y-axis (D3 makes a judgement still based on the data)
        var yAxisTicks = 7;

        // y-axis gridlines
        element.yAxisGridlines = d3.svg.axis()
            .scale(element.yScale)
            .orient("left")
            .tickFormat("")
            .tickSize(-width + paddingLeft + paddingRight, 0, 0)
            .ticks(yAxisTicks);

        svg.append("g")
            .attr("class", "axis y-axis-gridlines")
            .attr("transform", "translate(" + paddingLeft + ", 0)")
            .call(element.yAxisGridlines);

        // x-axis gridlines
        element.xAxisGridlines = d3.svg.axis()
            .scale(element.xScale)
            .orient("bottom")
            .tickFormat("")
            .tickValues(xAxisDefinition.ticks.map(function (d) { return d; }))
            .tickSize(-height + paddingTop + paddingBottom, 0, 0);

        svg.append("g")
            .attr("class", "axis y-axis-gridlines")
            .attr("transform", "translate(0," + (height - paddingTop) + ")")
            .call(element.xAxisGridlines);

        // y-axis
        var decimalPlacesOnYAxis = 1 + Math.ceil(Math.max(0, -Math.log10(Math.abs(yAxisMax - yAxisMin))));
        element.yAxis = d3.svg.axis()
            .scale(element.yScale)
            .orient("left")
            .tickFormat(function (d) { return app.utils.number.convertToSIUnitsUsingDecimalPlacePrecision(d, decimalPlacesOnYAxis, app.utils.number.getSIMultiplierFor(Math.max(Math.abs(yAxisMax), Math.abs(yAxisMin)))); }.bind(this))
            .tickSize(5, 5, 0)
            .ticks(yAxisTicks);

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(" + paddingLeft + ",0)")
            .call(element.yAxis);

        // x-axis
        var xAxisTickLength = 3; // px
        if (datasetHasNegatives) {
            element.xAxis = d3.svg.axis()
                .scale(element.xScale)
                .orient("bottom")
                .tickFormat(function (d) { return app.locale.format(d, "MMM d").toUpperCase(); })
                .tickValues(xAxisDefinition.ticks.map(function (d) { return d; }))
                .tickSize(xAxisTickLength, xAxisTickLength, 0);

            svg.append("g")
                .attr("class", "axis x-axis with-negatives")
                .attr("transform", "translate(0, " + (height - paddingTop) + ")")
                .call(element.xAxis);

            element.xAxisZeroLine = d3.svg.axis()
                .scale(element.xScale)
                .orient("bottom")
                .tickFormat("")
                .tickValues(xAxisDefinition.ticks.map(function (d) { return d; }))
                .tickSize(xAxisTickLength, xAxisTickLength, 0);

            svg.append("g")
                .attr("class", "axis x-axis-zeroline")
                .attr("transform", "translate(0, " + element.yScale(0) + ")")
                .call(element.xAxisZeroLine);
        } else {
            element.xAxis = d3.svg.axis()
                .scale(element.xScale)
                .orient("bottom")
                .tickFormat(function (d) { return app.locale.format(d, "MMM d").toUpperCase(); })
                .tickValues(xAxisDefinition.ticks.map(function (d) { return d; }))
                .tickSize(xAxisTickLength, xAxisTickLength, 0);

            svg.append("g")
                .attr("class", "axis x-axis")
                .attr("transform", "translate(0, " + element.yScale(0) + ")")
                .call(element.xAxis);
        }

        // tweak the x-axis ticks so that they cross the line
        svg.selectAll(".x-axis").selectAll(".tick").selectAll("line")
            .attr("y1", -xAxisTickLength);
        svg.selectAll(".x-axis-zeroline").selectAll(".tick").selectAll("line")
            .attr("y1", -xAxisTickLength);

        if (datasetIsAllNegative) {
            // see above: temporary workaround for d3 not calculating the axis correctly when negatives are used, TODO: investigate further if this is a d3 bug or some missunderstanding
            dataset.pop();
        }

        //draw the goal line after the grid so that is appears on top of grid lines
        if (newGoals) {
            newGoals.append("line")
                .attr("class", function(d, j) {
                    for (var i = 0; i < goalLine.length; i++) {
                        if (i !== j && d.Value < goalLine[i].Value) {
                            if (( goalLine[i].startDate <= d.startDate && goalLine[i].endDate >= d.startDate )
                                || ( goalLine[i].startDate <= d.endDate && goalLine[i].endDate >= d.endDate )) {

                                return "goal-line lower";
                            }
                        }
                    }
                    return "goal-line";
                });
        }

        // draw line graph
        element.line = d3.svg.line()
            .x(function (d) {
                return element.xScale(d.date);
            })
            .y(function (d) {
                return element.yScale(d.value());
            });

        svg.append("svg:path")
            .attr("class", "line-graph")
            .attr("d", element.line(dataset));

        // plot circles
        var circles = svg.selectAll("circle")
            .data(dataset);

        circles.enter()
            .append("circle")
            .attr("class", "data-point")
            .attr("cx", function (d) {
                return element.xScale(d.date);
            })
            .attr("cy", function (d) {
                return element.yScale(d.value());
            })
            .attr("r", 4)
            .attr("data-bind", (function(goalData) {
                return function (d) {
                    var goalInformation = "";
                    //figure out if the data point coincides with a goal
                    for (var i = 0; i < goalData.length; i++) {
                        if (d.date <= goalData[i].endDate && d.date >= goalData[i].startDate) {
                            goalInformation += "<div><span>" +
                                                    app.locale.localize("CampaignMetrics.Goal") +
                                                ": </span><strong>" +
                                                    app.utils.number.convertToSIUnits(goalData[i].Value) +
                                                "</strong></div>";
                        }
                    }
                    return "tooltip: { content: '" + app.locale.format(d.date, "dddd, MMMM d, yyyy HH:mm") + ": <strong>" + app.utils.number.convertToSIUnits(d.value()) + "</strong>" + goalInformation + "'}";
                };
            })(goalLine));
            
    },

    update: function (element, valueAccessor) {

        var binding = ko.unwrap(valueAccessor());

        // get the data
        var dataset = ko.unwrap(binding.data);
        if (app.utils.isNullOrUndefined(dataset) || dataset.length === 0) {
            return;
        }

        var goalLine = ko.unwrap(binding.goalLine);
        var svg = d3.select(element).select("svg");
        var xAxisDefinition = ko.bindingHandlers.lineGraph.getXAxisDefinition(dataset);
        // update the scales
        /*
            TODO: removed temporarily because of an issue with all negatives showing no scale;
            we're not using animations on this graph at the moment, need to investigate different animations, and fix the scales
        var xAxisDefinition = ko.bindingHandlers.lineGraph.getXAxisDefinition(dataset);
        element.xScale.domain([xAxisDefinition.min, xAxisDefinition.max]);

        var yAxisMin = d3.min(dataset, function (d) { return Math.min(d.value(), 0); });
        var yAxisMax = goalLine ? d3.max(dataset, function(d) { return Math.max(d.value(), goalLine); }) : d3.max(dataset, function(d) { return d.value(); });
        if (yAxisMin === 0 && yAxisMax === 0) {
            yAxisMax = 1;
        }
        element.yScale.domain([yAxisMin, yAxisMax]);
        */

        // update the goal line if set
        if (goalLine) {

            svg.selectAll(".goal-shading")
                .data(goalLine)
                .sort(function(a, b) { return b.Value - a.Value; })
                .transition()
                .duration(element.animationSpeed)
                .attr("x", function (goal) {
                    if (goal.startDate < xAxisDefinition.min) {
                        return element.xScale(xAxisDefinition.min);
                    }
                    return element.xScale(goal.startDate);
                })
                .attr("y", function (goal) {
                    return element.yScale(goal.Value);
                })
                .attr("width", function (goal) {
                    var start = goal.startDate,
                        end = goal.endDate;
                    if (goal.startDate < xAxisDefinition.min) {
                        start = xAxisDefinition.min;
                    }

                    if (goal.endDate > xAxisDefinition.max) {
                        end = xAxisDefinition.max;
                    }
                    return element.xScale(end) - element.xScale(start);
                })
                .attr("height", function (goal) {
                    return element.yScale(0) - element.yScale(goal.Value);
                });

            svg.selectAll(".goal-line")
                .data(goalLine)
                .transition()
                .duration(element.animationSpeed)
                .attr("x1", function (goal) {
                    if (goal.startDate < xAxisDefinition.min) {
                        return element.xScale(xAxisDefinition.min);
                    }
                    return element.xScale(goal.startDate);
                })
                .attr("y1", function (goal) {
                    return element.yScale(goal.Value);
                })
                .attr("x2", function (goal) {
                    if (goal.endDate > xAxisDefinition.max) {
                        return element.xScale(xAxisDefinition.max);
                    }
                    return element.xScale(goal.endDate);
                })
                .attr("y2", function (goal) {
                    return element.yScale(goal.Value);
                });

            //if the line crosses a goal, interpolate the point on the x axis that they crossed
            var intersectionPoints = [];
            for (var i = 1; i < dataset.length; i++) {
                for (var j = 0; j < goalLine.length; j++) {
                    //test if line intersection is possible with each goal line
                    if (dataset[i-1].date <= goalLine[j].endDate && dataset[i-1].date >= goalLine[j].startDate ||
                        dataset[i].date <= goalLine[j].endDate && dataset[i].date >= goalLine[j].startDate) {

                        //determine if an intersection occurs. See http://en.wikipedia.org/wiki/Line-line_intersection for info on the calculation
                        var x1 = element.xScale(dataset[i].date);
                        var y1 = element.yScale(dataset[i].value());
                        var x2 = element.xScale(dataset[i - 1].date);
                        var y2 = element.yScale(dataset[i - 1].value());
                        var x3 = element.xScale(goalLine[j].startDate);
                        var y3 = element.yScale(goalLine[j].Value);
                        var x4 = element.xScale(goalLine[j].endDate);
                        var y4 = y3;    //goal lines are always fixed (horizontal) on the y scale

                        //get the coordinates of the intersection
                        var xIntersection = ((x1*y2 - y1*x2)*(x3 - x4) - (x1 - x2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));
                        var yIntersection = ((x1*y2 - y1*x2)*(y3 - y4) - (y1 - y2)*(x3*y4 - y3*x4)) / ((x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4));

                        //check that the intersection point is on both line segments
                        if (xIntersection >= x1 && xIntersection <= x2 && xIntersection >= x3 && xIntersection <= x4 &&
                            (yIntersection >= y1 && yIntersection <= y2 || yIntersection <= y1 && yIntersection >= y2)) {

                            //we have an intersection point!
                            intersectionPoints.push({
                                intersectionX: xIntersection,
                                intersectionY: yIntersection
                            });
                        }
                    }
                }
            }

            //add a point with tooltip at each intersection point
            var intersections = svg.selectAll(".intersection")
                .data(intersectionPoints);

            intersections.enter().append("circle")
                .attr("class", "intersection")
                .attr("cx", function (d) {
                    return d.intersectionX;
                })
                .attr("cy", function (d) {
                    return d.intersectionY;
                })
                .attr("r", 4)
                .attr("data-bind", function (d) {
                        var intersectionDate = element.xScale.invert(d.intersectionX);
                        return "tooltip: { content: '" + app.locale.localize("CampaignMetrics.GoalReached") + ": <strong>" + app.locale.format(intersectionDate, "dddd, MMMM d, yyyy HH:mm") + "</strong>'}";
                    });
            

        }

        // update line graph
        svg.selectAll(".line-graph")
            .data(dataset)
            .transition()
            .duration(element.animationSpeed)
            .attr("d", element.line(dataset));

        // update circles
        svg.selectAll("circle")
            .data(dataset)
            .transition()
            .duration(element.animationSpeed)
            .attr("cx", function (d) {
                return element.xScale(d.date);
            })
            .attr("cy", function (d) {
                return element.yScale(d.value());
            });

        // update the x-axis
        svg.select(".x-axis")
            .transition()
            .duration(element.animationSpeed)
            .call(element.xAxis);
        
        // tweak the x-axis labels so that they have more spacing from the axis
        var xAxisLabelMargin = 12; // px
        svg.selectAll(".x-axis").selectAll(".tick").selectAll("text")
            .attr("dy", xAxisLabelMargin + "px");

        // add in the text "(today)" to the x-axis labels if it matches today's date
        var xAxisTicks = svg.selectAll(".x-axis").selectAll(".tick");
        xAxisTicks.each(function(d) {
            if (d.isToday()) {
                d3.select(this).append("svg:text")
                    .attr("y", "12")
                    .attr("x", "0")
                    .attr("dy", "18px")
                    .style("text-anchor", "middle")
                    .text("(" + app.locale.localize("CampaignMetrics.Today") + ")");
            }
        });
        
        // update the y-axis gridlines
        svg.select(".y-axis-gridlines")
            .transition()
            .duration(element.animationSpeed)
            .call(element.yAxisGridlines);

        // update the y-axis
        svg.select(".y-axis")
            .transition()
            .duration(element.animationSpeed)
            .call(element.yAxis);
    }
};