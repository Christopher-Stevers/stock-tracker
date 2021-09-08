import { useEffect } from 'react'
import * as d3 from "d3";
import styles from './lineGraph.module.css'
export default function LineGraph(props, propwidth, propheight) {
    const drawChart = () => {
        if (document.querySelector("#lineGraph>*")) { document.querySelector("#lineGraph>*").remove() }
        console.log("yeet")
        console.log(document.querySelector("#lineGraph>*"));
        console.log(props);
        //The next 8 lines are taken from https://www.d3-graph-gallery.com/graph/line_basic.html
        const margin = { top: 10, right: 30, bottom: 30, left: 60 };
        const width = propwidth - margin.left - margin.right;
        const height = propheight - margin.top - margin.bottom;
        const svg = d3.select("#lineGraph")
            .append("svg")
            .attr("background-color", "yellow")
            .attr("class", styles.chart)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom).append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        const xScale = d3.scaleTime()
            .domain([new Date(props.values[props.values.length - 1].datetime), new Date(props.values[0].datetime)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        const closeArr = props.values.map(elem => elem.close);
        const yMin = (d3.min(closeArr) - d3.min(closeArr)/10 > 0) ? parseFloat(d3.min(closeArr)) - d3.min(closeArr)/10 : - 0;

        const yMax = (d3.max(closeArr) + d3.max(closeArr)*10 > 0) ? parseFloat(d3.max(closeArr)) + d3.max(closeArr)/10 : - 0;
        console.log(d3.min(closeArr));
        console.log(d3.max(closeArr));
        console.log(d3.min(closeArr));
        console.log(yMax);
        const yScale = d3.scaleLinear()


            .domain([yMin, yMax])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(yScale));
        svg.append("path")
            .datum(props.values)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line().x(function (d) {
                return xScale(new Date(d.datetime))
            })
                .y(function (d) { return yScale(d.close) }))
    }
    return drawChart();



}