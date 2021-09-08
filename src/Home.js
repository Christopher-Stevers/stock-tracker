import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import "./Home.css";
import * as Sample from"./sample.json"
import LineGraph from "./components/lineGraph"
import * as d3 from "d3";
import { useState, useEffect } from "react";

const Home = () => {
  console.log(Sample);
  let [userInput, updateUserInput] = useState("TSLA");
  const [submittedInput, updateSubmittedInput] = useState("TSLA");
  
  
  const [currentPrice, updateCurrentPrice] = useState("");
  const [ticker, updateTicker]=useState("TSLA");

  const newUserInput = (e) => {
    updateUserInput(e.target.value);
  };

async function fetchData(ticker){ 
    
    console.log(ticker);
    const response = await fetch(
      "https://api.twelvedata.com/time_series?symbol=" +
        ticker +
        "&interval=1week&apikey=c2133a76aac7496da1f8e1e4f62ba9a2"
    );
    let responseObj=await response.json();
    console.log(responseObj);
    
    if(responseObj.code===429){
      console.log(419);
    responseObj=Sample.default;}
 const width=600;
 const height=400;
     
     if(document.querySelectorAll(".chart")[1])document.getQuerySelector(".chart")[1].remove();
 LineGraph(responseObj, width, height);
    }
  
  useEffect(()=>{
        
  
    fetchData(ticker);

},[ticker]);
  //thank you to https://dmitripavlutin.com/javascript-fetch-async-await/ for explaing async await, some of the fetcshing was done with his code.
  function getData(userInput) {
    const ticker = userInput.toUpperCase();
    async function fetchStonksJSON() {
      const response = await fetch(
        "https://api.twelvedata.com/time_series?symbol=" +
          ticker +
          "&interval=1week&apikey=c2133a76aac7496da1f8e1e4f62ba9a2"
      );
      const stonks = await response.json();
      return stonks;
    }
    async function fetchCurrentJSON() {
      const response = await fetch(
        "https://api.twelvedata.com/time_series?symbol=" +
          ticker +
          "&interval=1min&outputsize=1&apikey=c2133a76aac7496da1f8e1e4f62ba9a2"
      );
      const stonks = await response.json();
      return stonks;
    }
    fetchCurrentJSON().then((stonks) => {
      if (stonks.status === "error") {
        updateCurrentPrice("");
        return false;
      } else {
        updateCurrentPrice("Current Price: "+stonks.values[0].high);
      }
    });

    fetchStonksJSON().then((stonks) => {
      if (stonks.status === "error") {
        updateSubmittedInput( "Sorry, ticker not found");
        document.querySelector(".cornChart").scrollLeft = 2000;
        return false;
      } else {
        document.getElementById("chart").remove();
        document.getElementById("scale").remove();
        drawChart(stonks.values, "corn", ".cornChart");
        updateSubmittedInput(stonks.meta.symbol);
        /*document.getElementById("chart").remove();
     document.getElementById("scale").remove();*/
        updateSubmittedInput(userInput);
        updateUserInput("");

        document.querySelector(".cornChart").scrollLeft = 2000;
      } // fetched movies
    });
  }
  function drawChart(data, name, holder) {
    const lowData = data.map((elem) => parseFloat(elem.low));

    const highData = data.map((elem) => parseFloat(elem.high));

    const padding = 0;
    const bottomPadding = 50;
    let iW = 50;
    let w = iW * data.length;
    let h = 400;
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(lowData), d3.max(highData)])
      .range([bottomPadding, h - bottomPadding]);
    const axisScale = d3
      .scaleLinear()
      .domain([d3.max(highData), d3.min(lowData)])
      .range([bottomPadding, h - bottomPadding]);
    let scaleHolder = d3
      .select(".soyChart")
      .append("svg")
      .attr("width", 61)
      .attr("height", h)
      .attr("id", "scale");
    let svg = d3
      .select(holder)
      .append("svg")
      .attr("width", w + padding)
      .attr("height", h)
      .attr("name", name)
      .attr("id", "chart");
    svg
      .selectAll("rect.low")
      .data(lowData)
      .enter()
      .append("rect")
      .attr("width", iW)
      .attr("height", (d, i) => {
        return yScale(d);
      })
      .attr("y", (d, i) => h - yScale(d))
      .attr("x", (d, i) => w - (i + 1) * iW + padding)
      .attr("class", "low");
    svg
      .selectAll("rect.high")
      .data(highData)
      .enter()
      .append("rect")
      .attr("width", iW)
      .attr("height", (d, i) => {
        return yScale(d);
      })
      .attr("y", (d, i) => h - yScale(d))
      .attr("x", (d, i) => w - (i + 1) * iW + padding)

      .attr("class", "high");
    svg
      .selectAll("text.bottom")
      .data(data)
      .enter()
      .append("text")
      .text((d, i) => d.datetime.slice(5))
      .attr("class", "bottom")
      .attr("y", h - 20)
      .attr("x", (d, i) => w - (i + 1) * iW + padding);
    const yAxis = d3.axisLeft(axisScale);

    scaleHolder
      .append("g")
      .attr("transform", "translate(" + 60 + ")")
      .attr("x", 0)

      .call(yAxis);
    /* document.getElementById("cornChart").scrollLeft=w;
     */
  }

  const submitInput = (e) => {
    e.preventDefault();
    updateTicker(userInput.toUpperCase());
    fetchData(userInput);
    getData(userInput);
    document.querySelector(".cornChart").scrollLeft = 1000;
  };
  useEffect(() => {
   getData(userInput);
      //alert(
      //  "Data is taken from https://twelvedata.com/ I cannot guarantee its accuracy."
    //  );
      //eslint-disable-next-line
  },[]);


  return (
    <>
      <form>
        <label>Stock Ticker:</label>
        <input value={userInput} onChange={newUserInput}></input>
        <input type="submit" onClick={submitInput}></input>
      </form>

      <div class="graphContainer">
        <figcaption for="stockChart" id="corn">
          <h1 class="centerText"> {submittedInput}</h1>
          <h2>{currentPrice}</h2>
          <h2 class="centerText">Past 30 Weeks</h2>
        </figcaption>
        <figure name="stockChart">
          <div class="soyChart">
            <div id="chart"></div>
          </div>
          <div class="cornChart">
            <div id="scale"></div>
          </div>
        </figure>
      </div>
      
      <figure id="lineGraph"></figure>
        
    </>

  );
};

export default Home;