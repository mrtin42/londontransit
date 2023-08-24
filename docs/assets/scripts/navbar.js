// trigger function on scroll
window.onscroll = function() {scrollFunction()};

// function to change navbar on scroll
function scrollFunction() {
    //check if scroll is greater than 300px
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        // make navbar background solid #333
        document.getElementById("topnav").style.backgroundColor = "#333";

    } else {
        // return to transparent background
        document.getElementById("topnav").style.backgroundColor = "transparent";
    }
}