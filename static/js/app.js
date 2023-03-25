const data = d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    console.log(data);

    //Extract data
    const samples = data.samples;
    const sampleIDs = data.names;
    const otuIds = samples.map(sample => sample.otu_ids);
    const sampleValues = samples.map(sample => sample.sample_values);
    const otuLabels = samples.map(sample => sample.otu_labels);
    const metadata = data.metadata;

    // Set up dropdown menu
    const dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
        .data(sampleIDs)
        .enter()
        .append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // Set up initial charts and metadata
    // ID metadata
    const metadataList = d3.select("#sample-metadata");
    Object.entries(metadata[0]).forEach(([key, value]) => {
        metadataList.append("p").text(`${key}: ${value}`);
    });

    // Bar Chart
    const defaultID = sampleIDs[0];
    const defaultIndex = sampleIDs.indexOf(defaultID);
    const defaultOtuIds = otuIds[defaultIndex].slice(0, 10).reverse();
    const defaultSampleValues = sampleValues[defaultIndex].slice(0, 10).reverse();
    const defaultOtuLabels = otuLabels[defaultIndex].slice(0, 10).reverse();

    const trace = {
        x: defaultSampleValues,
        y: defaultOtuIds.map(id => `OTU ${id}`),
        text: defaultOtuLabels,
        type: "bar",
        orientation: "h"
    };

    const barData = [trace];

    Plotly.newPlot("bar", barData);
    
    //Bubble chart
    const otuIdsBubble = otuIds[defaultIndex];
    const sampleValuesBubble = sampleValues[defaultIndex];
    const otuLabelsBubble = otuLabels[defaultIndex];
    
    var colorscale = [[0, 'blue'],
        [0.5, 'green'],
        [0.8, 'brown'],
        [1, 'red']
    ];
    
    var trace1 = {
        x: otuIdsBubble,
        y: sampleValuesBubble,
        text: otuLabelsBubble,
        mode: 'markers',
        marker: {
            color: otuIdsBubble,
            opacity: 0.7,
            size: sampleValuesBubble.map(value => value * 1.05),
            colorscale: colorscale,
            cmin: 0,
            cmax: Math.max(...otuIdsBubble)
        }
    };
    
    var data = [trace1];
    
    var layout = {
        showlegend: false,
        xaxis: {
            title: "OTU ID"
        },
        height: 600,
        width: 1500
    };
    
    Plotly.newPlot('bubble', data, layout);

    //change bar-chart and metadata when new ID selected
    function optionChanged(selectedID) {
        const selectedIndex = sampleIDs.indexOf(selectedID);
        const selectedOtuIds = otuIds[selectedIndex].slice(0, 10).reverse();
        const selectedSampleValues = sampleValues[selectedIndex].slice(0, 10).reverse();
        const selectedOtuLabels = otuLabels[selectedIndex].slice(0, 10).reverse();

        const updatedTrace = {
            x: selectedSampleValues,
            y: selectedOtuIds.map(id => `OTU ${id}`),
            text: selectedOtuLabels,
            type: "bar",
            orientation: "h"
        };

        const updatedData = [updatedTrace];

        Plotly.newPlot("bar", updatedData);
        const selectedMetadata = metadata.find(item => item.id == selectedID);
        const metadataList = d3.select("#sample-metadata");

        // Clear existing metadata
        metadataList.html("");

        // Add metadata for selected ID
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataList.append("p").text(`${key}: ${value}`);
        });
    }

    // Set up event listener for dropdown change
    dropdownMenu.on("change", function() {
        optionChanged(d3.select(this).property("value"));
    });
});
