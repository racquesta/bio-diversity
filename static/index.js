d3.json("/names", function(error, response) {

    if (error) return console.warn(error);

    console.log(response);

    var $dropDown = document.getElementById("sample_id")

    for (var i=0; i< response.length; i++){
        var $optionChoice = document.createElement("option");
        $optionChoice.innerHTML = response[i]
        $dropDown.appendChild($optionChoice)
    }
});