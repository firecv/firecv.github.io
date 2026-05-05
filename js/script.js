window.onload = function() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

var splashScreen = document.getElementById("splash");
var splashButton = document.getElementById('splash-button');
splashButton.addEventListener('click', enableScroll);

function enableScroll() {
  splashScreen.classList.add('disappear');
  document.body.classList.remove("no-scroll"); 
}

var bioSection = document.getElementById("bio-section");
window.addEventListener("scroll", function(){
  if(window.scrollY < 300){
    bioSection.classList.add("bio-box");
    bioSection.classList.remove("bio-box-scroll");
  } else {
    bioSection.classList.remove("bio-box");
    bioSection.classList.add("bio-box-scroll");
  }
});

var cvChunks = document.getElementsByClassName("cv-chunk");
var cvBG = document.getElementById("cv-section");
window.addEventListener("mouseover", function() {
  cvBG.style.backgroundImage = "url(images/andrei-castanha.jpg)";
});


/* HIDE HEADER:

var previousScroll = window.pageYOffset;
window.onscroll = function() {
  var currentScroll = window.pageYOffset;
  if (previousScroll > currentScroll) {
    document.getElementById("header").style.top = "0";
  } else {
    document.getElementById("header").style.top = "-80px";
  }
  previousScroll = currentScroll;
};
*/