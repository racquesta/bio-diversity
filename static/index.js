// create dropdown from Flask API
d3.json("/names", function(error, response) {

    if (error) return console.warn(error);

    // console.log(response);

    var $dropDown = document.getElementById("selDataset")

    for (var i=0; i< response.length; i++){
        var $optionChoice = document.createElement("option");
        $optionChoice.innerHTML = response[i];
        $optionChoice.setAttribute("value", response[i]);
        $dropDown.appendChild($optionChoice);
    }
});

// set intial values and graphs on the page
var defaultSample = "BB_940"

function init(sample){
    // sample metadata panel
    d3.json("/metadata/" + sample, function(error, response){
        if (error) return console.warn(error);

        // get list of keys from response
        var responseKeys = Object.keys(response);

        // identify correct div
        var $sampleInfoPanel = document.querySelector("#sample-metadata");
       
        // reset HTML to be nothing
        $sampleInfoPanel.innerHTML = null;

        // loop through response keys and create a P element for each including
        // response key and value
        for (var i=0; i<responseKeys.length; i++){
            var $dataPoint = document.createElement('p');
            $dataPoint.innerHTML = responseKeys[i] + ": " + response[responseKeys[i]];
            $sampleInfoPanel.appendChild($dataPoint)
        };

    });

    // pie chart
    //  get response for default sample
    d3.json("/samples/" + sample, function(error, sampleResponse){

        if (error) return console.warn(error);
        console.log(sampleResponse)
        
        // parse repsonse data and take sice of first ten
        // data returnes sorted from schalchemy/flask
        resLabels = sampleResponse[0]["otu_ids"].slice(0,10)
        resValues = sampleResponse[1]["sample_values"].slice(0,10)

        for (var i=0; i<10; i++){
            if (resLabels[i] == 0){
                resLabels = resLabels.slice(0,i)
            }
            if (resValues[i] == 0){
                resValues[i] = resValues.slice(0,i)
            }
        }
        // console.log(resLabels)
        // console.log(resValues)

        // get matching decriptions for the top ten bacteria and create a list
        d3.json("/otu_descriptions", function(error, response){

            if (error) return console.warn(error);

            console.log(response)
            var bacteriaNamesPie = []
            for (var i=0; i< resLabels.length; i++){
                bacteriaNamesPie.push(response[resLabels[i]])
            }
            // console.log(bacteriaNames)
            
            //  list of names for Bubble Chart
            var bacteriaNamesBub = []
            for (var i =0; i<sampleResponse[0]["otu_ids"].length; i++){
                bacteriaNamesBub.push(response[sampleResponse[0]["otu_ids"][i]])
            }
            console.log(bacteriaNamesBub)

            // set up data for pie chart
            var data = [{
            values: resValues,
            labels: resLabels,
            hovertext: bacteriaNamesPie,
            hoverinfo: {bordercolor: 'black'},
            type: 'pie'
            }];

        //   set up layout for plot

          var layout = {
                    // width: 675,
                    margin: 
                    {
                        top: 10,
                        bottom: 10,
                        right: 10,
                        left: 10
                    },
                    height: 500,
                    title: "Top Sample Counts for " + sample
                  };
        // plot defauly value
          Plotly.newPlot('piePlot', data, layout);

        console.log(sampleResponse);
        //    bubble plot 

        
        
        
        var trace1 = {
            x: sampleResponse[0]["otu_ids"],
            y: sampleResponse[1]["sample_values"],
            mode: 'markers',
            marker: {
                colorscale: 'Earth',
                color: sampleResponse[0]["otu_ids"],
                size: sampleResponse[1]["sample_values"]
            },
            text: bacteriaNamesBub,
            type: "scatter"
          };
          
          var bubData = [trace1];
          
          var bubLayout = {
            title: 'Sample Values for ' + sample,
            hovermode: 'closest',
            showlegend: false,
            height: 600,
            // width: 1200
            margin: 
                {
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10
                }
    
          };
          
          Plotly.newPlot('bubblePlot', bubData, bubLayout);
        });
    
        

    });

    d3.json("/wfreq/" + sample, function(error, washResponse){

        if (error) return console.warn(error);

        // 
        
        // determines level
        var level =washResponse*20;

        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 15, color:'850000'},
            showlegend: false,
            name: 'Number of Washes',
            // text: washResponse,
            hoverinfo: 'name'
        },
        { values: [50/5, 50/5, 50/5, 50/5, 50/5, 50],
        rotation: 90,
        text: ['8-9', '6-7', '4-5', '2-3',
                    '0-1', " "],
        textinfo: 'text',
        textposition:'inside',	  
        marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                'rgba(210, 206, 145, .5)', 'rgba(255, 255, 255, 0)']},
        labels: ['8-9', '6-7', '4-5', '2-3',
                    '0-1', " "],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];

        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: "<b>Belly Button Washing Frequency</b> <br> Washes per Week",
        height: 500,
        // width: 600,
        margin: {
            top: 50,
            bottom: 10,
            right: 10,
            left: 10
        },
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };

        Plotly.newPlot('meter', data, layout);
            })
};
// end init


// update pie chart function
function updatePie(newValues, newLabels, newNames, sample_name){
    Plotly.restyle("piePlot", "values", [newValues])
    Plotly.restyle("piePlot", "labels", [newLabels])
    Plotly.restyle("piePlot", "hovertext", [newNames])
    Plotly.relayout("piePlot", "title", "Top Sample Counts for " + sample_name)
    console.log("Success")
};

function updateBub(values, labels, names, sample_name){

    Plotly.restyle("bubblePlot", "x", [labels])
    Plotly.restyle("bubblePlot", "y", [values])
    Plotly.restyle("bubblePlot", "marker.size", [values])
    Plotly.restyle("bubblePlot", "text", [names])
    Plotly.relayout("bubblePlot", "title", "Sample Values for " + sample_name)
    console.log("Success2")
};

function updateMeter(newWashFreq){
    var level =newWashFreq*20;
    console.log("New Wash Freq: " + newWashFreq)
    
    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
    pathX = String(x),
    space = ' ',
    pathY = String(y),
    pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    Plotly.relayout("meter", "shapes[0].path", path);
    

    console.log("Success Meter")
};
// handle change in dropdown
function optionChanged(chosenSample){
   
    d3.json("/metadata/" + chosenSample, function(error, response){

        if (error) return console.warn(error);

        console.log(response);

        var responseKeys = Object.keys(response);

        console.log(responseKeys);

        var $sampleInfoPanel = document.querySelector("#sample-metadata");

        $sampleInfoPanel.innerHTML = null;

        for (var i=0; i<responseKeys.length; i++){
            var $dataPoint = document.createElement('p');
            $dataPoint.innerHTML = responseKeys[i] + ": " + response[responseKeys[i]];
            $sampleInfoPanel.appendChild($dataPoint)
        };
        


    })

    // handle new get request for choice
    d3.json("/samples/" + chosenSample, function(error, newResponse){
        
        if (error) return console.warn(error);


        console.log(newResponse)

        var newResLabels = newResponse[0]["otu_ids"].slice(0,10)
        var newResValues = newResponse[1]["sample_values"].slice(0,10)

        for (var i=0; i<10; i++){
            if (newResLabels[i] == 0){
                newResLabels = resLabels.slice(0,i)
            }
            if (newResValues[i] == 0){
                newResValues[i] = resValues.slice(0,i)
            }
        }
        console.log(newResLabels)
        console.log(newResValues)

        d3.json("/otu_descriptions", function(error, otuResponse){

            if (error) return console.warn(error);

            console.log(otuResponse)

            var newBacteriaNames = []

            for (var i=0; i< newResLabels.length; i++){
                newBacteriaNames.push(otuResponse[newResLabels[i]])
            }
            //  all bacteria names for bubble hover
            var allBacteriaNames = []
            for (var i=0; i<newResponse[0]["otu_ids"].length; i++){
                allBacteriaNames.push(otuResponse[newResponse[0]["otu_ids"][i]])
            }
            // console.log(allBacteriaNames)
          
            
            // new vars for updateBub function
            var newValuesBub = newResponse[1]['sample_values']
            var newLabelsBub = newResponse[0]['otu_ids']
            console.log(newValuesBub)
            console.log(newLabelsBub)

        //  update meter
            
            updatePie(newResValues, newResLabels, newBacteriaNames, chosenSample);

            updateBub(newValuesBub, newLabelsBub, allBacteriaNames, chosenSample);
        })

        d3.json("/wfreq/" + chosenSample, function(error, washResponse){

            if (error) return console.warn(error);

            updateMeter(washResponse);
            console.log(washResponse);
        });
                
                  
                
                  
    
                
        
    })


}

init(defaultSample);