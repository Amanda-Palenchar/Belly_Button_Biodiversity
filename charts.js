function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    console.log(data)
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    let sampleIds = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let newSample = sampleIds.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metaSample = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // 5. Create a variable that holds the first sample in the array.
    let firstSample = newSample[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    let metaDataFirst = metaSample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = firstSample.otu_ids;
    let otuLabels = firstSample.otu_labels;
    let sampleValues = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    let washingFrequency = metaDataFirst.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIds.slice(0, 10).reverse().map(element => `OTU ${element}`);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      orientation: 'h',
      text: otuLabels.slice(0, 10).reverse()
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b> Top Ten Bacteria Cultures Found </b>",
      paper_bgcolor: "pink",
      marker: {
        color: 'rgb(255,255,255)',
        opacity: 0.7
      }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        hovertext: otuLabels,
        mode: 'markers',
        marker: {
          color: otuIds,
          size: sampleValues,
          colorscale: "Pinks"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "<b> Bacteria Cultures Per Sample </b>",
      xaxis: { title: "OTU ID" },
      hovermode: "closest",
      paper_bgcolor: "pink"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
        // 4. Create the trace for the gauge chart.
        var gaugeData = [
          {value: washingFrequency,
          domain: { x: [0, 1], y: [0, 1] },
          type: "indicator",
          mode: "gauge+number",
          title: { text: "<b> Bellybutton Washing Frequency </b><br>Scrubs Per Week" }, 
          gauge: {
            axis: { range: [null, 10]},
            bar: { color: "dimgrey" },
            steps: [
              { range: [0, 2], color: "lightgrey" },
              { range: [2, 4], color: "papayawhip" },
              { range: [4, 6], color: "moccasin" },
              { range: [6, 8], color: "salmon" },
              { range: [8, 10], color: "indianred" },
            ],
          }}
        ];

        // 5. Create the layout for the gauge chart.
        var gaugeLayout = { 
          width: 600, 
          height: 500, 
          margin: { t: 0, b: 0 },
          paper_bgcolor: "pink",
        };

        // 6. Use Plotly to plot the gauge data and layout.
        Plotly.newPlot('gauge', gaugeData, gaugeLayout); 
  });
}