let originalWeight
let desiredWeight



init();

function init(){
    
    $(document).ready(function () {
        $(".program-selection").hide();
    })


    document.getElementsByClassName("save-button")[0].addEventListener("click", function(){
        originalWeight = document.getElementsByClassName("weight")[0].value;
        document.getElementsByClassName("original-weight")[0].innerHTML = originalWeight;
        $(".program-selection").show();
        $(".main").hide();
    })

    document.getElementsByClassName("basic")[0].addEventListener("click", function () {
        desiredWeight = document.getElementsByClassName("desired-weight")[0].value;
        console.log(desiredWeight);
    })
}