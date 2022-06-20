//Give the Json an easily recallable name
const url = "./samples.json"
//Put the raw data on the console
d3.json(url).then(function(data) {
    console.log(data);
  });
  
// Create init function for starup plot

function init(){
    buildPlot()
};

// Everytime a different option is selected, it'll make a new plot based on the new data

function optionChanged(){
    //Build a new chart with every change
    buildPlot()
}

//Create the function to build the actual plot

function buildPlot(){
    d3.json(url).then((data) => {
        // Give names, a way to call for it later
        d3.json("samples.json").then((data) => {
            const samples = data.samples;
            const names = data.names;
            //Create the dropdown menu by going to the ID, the onchange, then the text itself
            names.forEach(option => d3.select('#selDataset').append('option').text(option).property('value', option))
            //Select an ID and store it
            const ID = d3.selectAll('#selDataset').node().value;
            //Filter the data to recieve only the information from the chosen ID 
            filtID = samples.filter(entry => entry.id == ID);
            //Prep the trace for the first chart, the horizontal chart
            const trace1 = {
                x: filtID[0].sample_values.slice(0,10).reverse(),
                y: filtID[0].otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
                text: filtID[0].otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: 'h'
            };
            const dataPlot = [trace1];
            //Create the layout of the bar chart 
            const layout = {
                title : 'Top 10 OTU',
                xaxis: {
                    tickangle: 0,
                    zeroline: true
                },
                yaxis: {
                    zeroline: 1,
                    gridwidth: 1
                },
                height:370,
                width:750,
                margin : {
                    l:90,
                    r:30,
                    t:50,
                    b:45
                }
            };
            //Make the actual graph with the data
            Plotly.newPlot("bar", dataPlot, layout);
            //Make the demographics panel
            filtMeta = data.metadata.filter(entry => entry.id == ID)
            //Make the demographic panel by choosing each single object in the metadata set
            const demographics = {
                'ID ': filtMeta[0].id,
                'Ethnicity ': filtMeta[0].ethnicity,
                'Gender ': filtMeta[0].gender,
                'Age ': filtMeta[0].age,
                'Location ': filtMeta[0].location,
                'BB Type ': filtMeta[0].bbtype,
                'W Freq ' : filtMeta[0].wfreq
            }
            //Select what value from the chart and connect it to the demographics chart
            panelBody = d3.select("#sample-metadata")
            //Empty the panel to choose another dataset
            panelBody.html("")
            //Connect the data from the demographics dict and connect it and update the chart
            Object.entries(demographics).forEach(([key, value]) => {
                panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
            
        });
        //Prep the trace for the second chart, the bubble chart 
        const trace2 ={
            x: filtID[0].otu_ids,
            Y: filtID[0].sample_values,
            text: filtID[0].otu_labels,
            mode: 'markers',
            marker: {
                color: filtID[0].otu_ids,
                size : filtID[0].sample_values
            }
        }
        const data2 = [trace2]
        //Make the layout for the bubble chart 
        const layout2 ={
            title : 'Marker Size',
            showlegend : false,
        }
        //Make the actual graph with the data
        Plotly.newPlot('bubble', data2, layout2)
        
    });
});

};

//Run init to set up the page


init();

