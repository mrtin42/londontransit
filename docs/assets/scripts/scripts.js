// --------------------------------------------------------------
// HOMEPAGE NAVBAR COLOUR
// --------------------------------------------------------------
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 320 || document.documentElement.scrollTop > 320) {
        document.getElementById("topnav").style.backgroundColor = "#0a1047";

    } else {
        document.getElementById("topnav").style.backgroundColor = "transparent";
    }
}

// --------------------------------------------------------------
// DOCUMENTATION SIDEBAR TOGGLE
// --------------------------------------------------------------
function openNav() {
    document.getElementById("sidenav").classList.toggle('active');
}
