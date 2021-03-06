
import "./App.css";
import * as d3 from "d3";
import { useState, useEffect } from "react";

const App = () => {
  let [userInput, updateUserInput] = useState("TSLA");
  const [submittedInput, updateSubmittedInput] = useState("TSLA");
  
  const [currentPrice, updateCurrentPrice] = useState("");
  const [overlayClasses, updateOverlayClasses]=useState("overlay");
  const monthArr=["January", "February", "March","April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const newUserInput = (e) => {
    updateUserInput(e.target.value);
  };
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
      console.log(stonks);
      if (stonks.status === "error") {
        updateSubmittedInput( "Sorry, ticker not found");
        
      if(stonks.code){updateSubmittedInput( "Sorry, you've exceeded the api request limit, please wait a minute.");}
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

        console.log(document.querySelector("#chart").scrollLeft);
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
      .text((d, i) => {
        const date= new Date(d.datetime);
        const month=date.getMonth();
        console.log(date.getDate());
        const dayOfMonth=date.getDate();
        const monthStr=(dayOfMonth<8)?monthArr[month]+" 1": "";
        return monthStr})
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
    getData(userInput);
    console.log(document.querySelector("svg"));
    document.querySelector(".cornChart").scrollLeft = 1000;
    console.log(document.querySelector(".cornChart").scrollLeft);
  };
  useEffect(() => {
    getData(userInput);
      //eslint-disable-next-line
  },[]);

  return (
    <>
    
    <div onClick={()=>updateOverlayClasses("kick")} className={overlayClasses}><div class="modal" onClick={(e)=>e.stopPropagation()}><button aria="visually hide" onClick={()=>updateOverlayClasses("kick")}>{ 	
     '\u2716'}</button><h1>Stock Tracker</h1>
    <p>Want a bar chart for a common stock? Enter your ticker above and get a bar chart for that stock's value over the past 30 weeks. </p>
    <p>Data for this app is provided by the <a href="https://twelvedata.com/">twelvedata api</a>.</p></div></div>
      <form>
        <label>Stock Ticker:</label>
        <input value={userInput} onChange={newUserInput}></input>
        <button type="submit" onClick={submitInput}>Get Chart</button>
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
    </>
  );
};

export default App;
