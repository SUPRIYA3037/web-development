const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const particles = [];

const img = new Image();
img.src = './static/images/ekas.jpeg';

const PARTICLE_DIAMETER = 7;
img.addEventListener('load', function () {
  // ctx.canvas.width  = window.innerWidth;
  // ctx.canvas.height = window.innerHeight;
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0, img.width, img.height);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  const numRows = Math.round(img.height / PARTICLE_DIAMETER);
  const numCols = Math.round(img.width / PARTICLE_DIAMETER);

  for(let row = 0; row < numRows; row++) {
    for(let col = 0; col < numCols; col++) {
      const pixelIndex = (row * PARTICLE_DIAMETER * img.width + col * PARTICLE_DIAMETER) * 4;

      const red = imageData.data[pixelIndex];
      const green = imageData.data[pixelIndex + 1];
      const blue = imageData.data[pixelIndex + 2];
      const alpha = imageData.data[pixelIndex + 3];

      particles.push({
        x: Math.floor(Math.random() * canvas.width),
        y: Math.floor(Math.random() * canvas.height),
        // x: col * PARTICLE_DIAMETER + PARTICLE_DIAMETER / 2,
        // y: row * PARTICLE_DIAMETER + PARTICLE_DIAMETER / 2,
        originX: col * PARTICLE_DIAMETER + PARTICLE_DIAMETER / 2,
        originY: row * PARTICLE_DIAMETER + PARTICLE_DIAMETER / 2,
        color: `rgba(${red}, ${green}, ${blue}, ${alpha/255})`
      });
    }
  }
  drawParticles();
}, false);

function drawParticles() {
  updateParticles();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, PARTICLE_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.fillStyle = particle.color;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

let mouseX = Infinity;
let mouseY = Infinity;

canvas.addEventListener('mousemove', function (e) {
  mouseX = e.offsetX*1.5;
  mouseY = e.offsetY*1.5;
});

canvas.addEventListener('mouseleave', function (e) {
  mouseX = Infinity;
  mouseY = Infinity;
});

function updateParticles() {
  const REPEL_RADIUS = 50;
  const REPEL_SPEED = 8;
  const ATTRACTION_SPEED = 0.1;

  particles.forEach(particle => {
    const distanceFromMouseX = mouseX - particle.x;
    const distanceFromMouseY = mouseY - particle.y;
    const distanceFromMouse = Math.sqrt(distanceFromMouseX * distanceFromMouseX + distanceFromMouseY * distanceFromMouseY);

    if(distanceFromMouse < REPEL_RADIUS) {
      const angle = Math.atan2(distanceFromMouseY, distanceFromMouseX);
      const force = ( REPEL_RADIUS - distanceFromMouse ) / REPEL_RADIUS;
      const moveX = Math.cos(angle) * force * REPEL_SPEED;
      const moveY = Math.sin(angle) * force * REPEL_SPEED;

      particle.x -= moveX;
      particle.y -= moveY;
    }else if (
      particle.x !== particle.originX ||
      particle.y !== particle.originY
    ) {
      const distanceFromOriginX = particle.originX - particle.x;
      const distanceFromOriginY = particle.originY - particle.y;
      const distanceFromOrigin = Math.sqrt(distanceFromOriginX * distanceFromOriginX + distanceFromOriginY * distanceFromOriginY);
      const angle = Math.atan2(particle.originY - particle.y, particle.originX - particle.x);
      const moveX = Math.cos(angle) * distanceFromOrigin * ATTRACTION_SPEED;
      const moveY = Math.sin(angle) * distanceFromOrigin * ATTRACTION_SPEED;

      particle.x += moveX;
      particle.y += moveY;
    }
  });
}
