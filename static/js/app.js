// The url with data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//fetch the data and log it 
d3.json(url).then(function(data){
    console.log(data);
});

//display the plots
function init() {

    // Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data);

        // assign names to array
        let names = data.names;

        // Iterate through the names 
        names.forEach((name) => {
            // Append each name as an option to the drop down menu
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // Assign the first name to name variable
        let name1 = names[0];

        // Call the functions to make the demographic panel, bar chart, and bubble chart
        metadata(name1);
        bar(name1);
        bubble(name1);
        gauge(name1);
    });
};

function metadata(selected) {
    d3.json(url).then((data)=>{
        
        let metadata = data.metadata;
        //filter based on value 
        let filteredData  = metadata.filter((meta)=>meta.id ==selected);
        //assign the first result to variable 
        let result = filteredData[0]
        //clear out meta data 
        d3.select('#sample-metadata').html("");

        //add each pair to the panel 
        let entries = Object.entries(result);
        //iterate through
        entries.forEach(([key,value])=>{
            d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);
        });
        
        console.log(entries);
        
    });
};                          

//make the bar chart
function bar(selected) {
    //fetch the JSON data and log it 
    d3.json(url).then((data)=>{
        console.log(data);
        //an array of sample objs
        let samples = data.samples;
        //filter data to selected value 
        let filteredData = samples.filter((sample)=>sample.id==selected);
        // assign the first obj variable
        let obj = filteredData[0];
        //trace for data for bar chart 
        let trace = [{
            //slice the top 10 
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text :obj.otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation:'h'
        }];
        //plot the data using plotly
        Plotly.newPlot('bar',trace); 
    });
};

function bubble(selected) {
    //fetch JSON data and console log it
    d3.json(url).then((data)=> {
        //an array of sample objects
        let samples = data.samples;
        //filter data where id = selected value 
        let filteredData = samples.filter((sample)=>sample.id == selected);
        //assign the first object to variable 
        let obj = filteredData[0];
        //trace for th bubble chart 
        let trace = [{
            x: obj.otu_ids,
            y:obj.sample_values,
            text: obj.otu_lables,
            mode:'markers',
            marker:{
                color:obj.otu_ids,
                size:obj.sample_values,
                colorscale:'Jet'
            }

        }];
        //apply the x asis legend to layout 
        let layout = {
            xaxis:{title:"OTU ID"}
        };
        //use Potly to plot the data 
        Plotly.newPlot("bubble",trace,layout);
    });
};

// Make the gauge chart 
function gauge(selectedValue) {
    // Fetch the JSON data and console log it 
    d3.json(url).then((data) => {
        // An array of metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value after converting their types 
        // (bc meta.id is in integer format and selectValue from is in string format)
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]

        // Trace for the data for the gauge chart
        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            // texposition:'inside',
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [0, 10],tickmode:'linear',tick0:2,dtick:2},
                bar: {color: "rgb(68,166,198)"},
                steps: [
                    { range: [0, 1], color: "rgb(233,245,248)" },
                    { range: [1, 2], color: "rgb(218,237,244)" },
                    { range: [2, 3], color: "rgb(203,230,239)" },
                    { range: [3, 4], color: "rgb(188,223,235)" },
                    { range: [4, 5], color: "rgb(173,216,230)" },
                    { range: [5, 6], color: "rgb(158,209,225)" },
                    { range: [6, 7], color: "rgb(143,202,221)" },
                    { range: [7, 8], color: "rgb(128,195,216)" },
                    { range: [8, 9], color: "rgb(113,187,212)" },
                    { range: [9, 10], color: "rgb(98,180,207)" }
                ]
            }
        }];

         // Use Plotly to plot the data 
         Plotly.newPlot("gauge", trace);
    });
}

function optionChanged(selected){
    metadata(selected);
    bar(selected);
    bubble(selected);
    gauge(selected);
}

init();