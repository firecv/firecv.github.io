window.onload = function() {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

window.onscroll = function() {shrinkHeader()};

function shrinkHeader() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    document.getElementById("header").style.padding = "5px";
  } else {
    document.getElementById("header").style.padding = "20px";
  }
}

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
    //window.scrollTo(0, document.body.scrollHeight);
    document.documentElement.style.scrollBehavior = "smooth";
  });
});