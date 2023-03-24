const data = d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function(data) {
    console.log(data);

    //BAR CHART -------------------------
    //Extract data
    const samples = data.samples;
    const sampleIDs = data.names;
    const otuIds = samples.map(sample => sample.otu_ids);
    const sampleValues = samples.map(sample => sample.sample_values);
    const otuLabels = samples.map(sample => sample.otu_labels);
    
    // Set up dropdown menu
    const dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
        .data(sampleIDs)
        .enter()
        .append("option")
        .text(function(d) { return d; })
        .attr("value", function(d) { return d; });

    // Set up initial chart
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
    }

    // Set up event listener for dropdown change
    dropdownMenu.on("change", function() {
        optionChanged(d3.select(this).property("value"));
    });










    
});
