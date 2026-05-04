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