//The down arrow functionalities

const downBtn = document.getElementById('down-arrow-btn');

downBtn.addEventListener('click', () => {
    const projectSection = document.getElementById('projects');
    projectSection.scrollIntoView({ behavior: 'smooth' });
});

// The nav-linesfunctionalities

const navLines = document.querySelectorAll('.nav-lines hr');
const sections = document.querySelectorAll('.right section');
const rightContainer = document.getElementById('right-container');

navLines.forEach((line, index) => {
    line.addEventListener('click', () => {
    if(sections[index]) {
      sections[index].scrollIntoView({behavior: 'smooth'});
    }
  });
});

//Mobile functionalities
//
//The left collapse and expand


const leftBtn = document.getElementById('left');

//let flag = true;

leftBtn.addEventListener('click', () => {
   leftBtn.classList.toggle('expand');
   leftBtn.classList.toggle('collapse');
});
