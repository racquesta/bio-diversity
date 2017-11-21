// create dropdown from Flask API
d3.json("/names", function(error, response) {

    if (error) return console.warn(error);

    console.log(response);

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
    d3.json("/samples/" + sample, function(error, response){

        if (error) return console.warn(error);
        // console.log(response)
        
        // parse repsonse data and take sice of first ten
        // data returnes sorted from schalchemy/flask
        resLabels = response[0]["otu_ids"].slice(0,10)
        resValues = response[1]["sample_values"].slice(0,10)

        // console.log(resLabels)
        // console.log(resValues)

        // get matching decriptions for the top ten bacteria and create a list
        d3.json("/otu_descriptions", function(error, response){

            if (error) return console.warn(error);

            // console.log(response)
            var bacteriaNames = []
            for (var i=0; i< resLabels.length; i++){
                bacteriaNames.push(response[resLabels[i]])
            }
            // console.log(bacteriaNames)
            
            // set up data for plot
            var data = [{
            values: resValues,
            labels: resLabels,
            hovertext: bacteriaNames,
            hoverinfo: {bordercolor: 'black'},
            type: 'pie'
            }];
        //   set up layout for plot
          var layout = {
                    width: 675,
                    height: 500,
                    title: "Sample Counts for " + sample
                  };
        // plot defauly value
          Plotly.newPlot('piePlot', data, layout);
        });
    
        

    });
     
};
// end init


// update pie chart function
function updatePie(newValues, newLabels, newNames, revisedTitle){
    Plotly.restyle("piePlot", "values", [newValues])
    Plotly.restyle("piePlot", "labels", [newLabels])
    Plotly.restyle("piePlot", "hovertext", [newNames])
    Plotly.relayout("piePlot", "title", revisedTitle)
    console.log("Success")
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

    d3.json("/samples/" + chosenSample, function(error, newResponse){
        
        if (error) return console.warn(error);


        console.log(newResponse)

        var newResLabels = newResponse[0]["otu_ids"].slice(0,10)
        var newResValues = newResponse[1]["sample_values"].slice(0,10)

        console.log(newResLabels)
        console.log(newResValues)

        d3.json("/otu_descriptions", function(error, otuResponse){

            if (error) return console.warn(error);

            console.log(otuResponse)

            var newBacteriaNames = []

            for (var i=0; i< newResLabels.length; i++){
                newBacteriaNames.push(otuResponse[newResLabels[i]])
            }

            console.log(newBacteriaNames)

            var newTitle = "Sample Values for " + chosenSample
            
            updatePie(newResValues, newResLabels, newBacteriaNames, newTitle);
        })
                
                  
                
                  
    
                
        
    })


}

init(defaultSample);