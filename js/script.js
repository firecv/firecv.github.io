//window.onscroll = function() {shrinkHeader()};
/*
function shrinkHeader() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementById("header").style.height = "10vh";
    document.getElementById("header").style.top = "-1.5vh";
    document.getElementById("subheader").style.width = "calc(375px - 5vw)";
    document.getElementById("title").style.fontSize = "0px";
    document.getElementById("subtitle").style.fontSize = "5.6vh";
    document.getElementById("pfp").style.width = "5.6vh";
    document.getElementById("pfp").style.minWidth = "10px";
    document.getElementById("under-header").style.marginTop = "25vh";
    document.getElementById("under-header").style.marginBottom = "2vh";
  } else {
    document.getElementById("header").style.height = "75vh";
    document.getElementById("header").style.top = "0px";
    document.getElementById("subheader").style.width = "50vw";
    document.getElementById("title").style.fontSize = "calc(36px + 5.5vw)";
    document.getElementById("subtitle").style.fontSize = "calc(24px + 3.5vw)";
    document.getElementById("pfp").style.width = "12.3vw";
    document.getElementById("pfp").style.minWidth = "80px";
    document.getElementById("under-header").style.marginTop = "80vh";
    document.getElementById("under-header").style.marginBottom = "5vh";
  }

}*/

var splashScreen = document.getElementById("splash");
var splashButton = document.getElementById('splash-button');
splashButton.addEventListener('click', enableScroll);

function enableScroll() {
  splashScreen.classList.add('disappear');
  document.body.classList.remove("no-scroll"); 
}

const acc = document.querySelectorAll('.accordion');
const panels = document.querySelectorAll('.panel');

acc.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    panels.forEach((panel, j) => {
      if (i === j && !panel.classList.contains('open')) {
        panel.classList.add('open');
        acc[j].classList.add('active');
      } else if (i != j && panel.classList.contains('open')) {
        panel.classList.remove('open');
        acc[j].classList.remove('active');
      }
    });
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.body.scrollHeight);
    document.documentElement.style.scrollBehavior = "smooth";
  });
});