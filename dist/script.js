const button = document.querySelector('.up');

button.addEventListener('click', () => {
  window.location.replace('#header');
});

window.addEventListener('scroll', () => {
  window.scrollY > 100
    ? button.classList.add('visible')
    : button.classList.remove('visible');
});

class Slide {
  container;
  slides;

  time;
  index;
  slide;
  paused;
  timeout;
  pausedTimeout;
  constructor(container, slides, time = 5000) {
    this.container = container;
    this.slides = slides;
    this.time = time;
    this.index = 0;
    this.slide = this.slides[this.index];
    this.paused = false;
    this.timeout = null;
    this.init();
  }
  hide(el) {
    el.classList.remove('active');
    el.classList.add('disabled');
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }
  show(index) {
    this.index = index;
    this.slide = this.slides[this.index];
    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add('active');
    this.slide.classList.remove('disabled');
    this.auto(this.time);
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }
  autoVideo(video) {
    video.muted = true;
    video.play();
    let firstPlay = true;
    video.addEventListener('playing', () => {
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }
  auto(time) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.slides[next].classList.remove('disabled');
  }
  prev() {
    if (this.paused) return;
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }
  next() {
    if (this.paused) return;
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.slides[next].classList.remove('disabled');
    this.show(next);
  }
  pause() {
    document.body.classList.add('paused');
    this.pausedTimeout = new Timeout(() => {
      this.timeout.pause();
      this.paused = true;
      this.thumb?.classList.add('paused');
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }
  continue() {
    document.body.classList.remove('paused');
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      this.thumb?.classList.remove('paused');
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }
  addControl() {
    const backButton = document.querySelectorAll('.back');
    const pauseButton = document.querySelectorAll('.pause');
    const playButton = document.querySelectorAll('.play');
    const nextButton = document.querySelectorAll('.next');
    pauseButton.forEach((button) =>
      button.addEventListener('pointerup', () => {
        this.pause();
        playButton.forEach((button) => button.classList.remove('played'));
        pauseButton.forEach((button) => button.classList.add('paused'));
      }),
    );
    playButton.forEach((button) =>
      button.addEventListener('pointerup', () => {
        this.continue();
        playButton.forEach((button) => button.classList.add('played'));
        pauseButton.forEach((button) => button.classList.remove('paused'));
      }),
    );
    nextButton.forEach((button) =>
      button.addEventListener('pointerup', () => this.next()),
    );
    backButton.forEach((button) =>
      button.addEventListener('pointerup', () => this.prev()),
    );
  }
  init() {
    this.show(this.index);
    this.addControl();
  }
}

class Timeout {
  id;
  handler;
  start;
  timeLeft;
  constructor(handler, time) {
    this.id = setTimeout(handler, time);
    this.handler = handler;
    this.start = Date.now();
    this.timeLeft = time;
  }
  clear() {
    clearTimeout(this.id);
  }
  pause() {
    const passed = Date.now() - this.start;
    this.timeLeft = this.timeLeft - passed;
    this.clear();
  }
  continue() {
    this.clear();
    this.id = setTimeout(this.handler, this.timeLeft);
    this.start = Date.now();
  }
}

const container = document.querySelectorAll('.projetos-lista');
const elements = document.querySelectorAll('.projetos-lista');
const containerDev = container[0];
const containerDesign = container[1];
const elementsDev = elements[0];
const elementsDesign = elements[1];

const elementsDevArray = Array.from(elementsDev.children);
elementsDevArray.pop();

if (containerDev && elementsDevArray && elementsDevArray.length) {
  new Slide(containerDev, elementsDevArray, 5000);
}
const elementsDesignArray = Array.from(elementsDesign.children);

if (containerDesign && elementsDesignArray && elementsDesignArray.length) {
  new Slide(containerDesign, elementsDesignArray, 5000);
}

const abdContainer = document.querySelector('.amigos-do-bem-project-slide');
const adbChildren = Array.from(abdContainer.children);

if (abdContainer && adbChildren) {
  console.log('test');
  new Slide(abdContainer, adbChildren, 5000);
}
const devButton = document.querySelector('.active-dev');
const designButton = document.querySelector('.active-design');
const devTitle = document.querySelector('.sub .dev');
const designTitle = document.querySelector('.sub .design');
const projectContainer = document.querySelector('.projetos');
const projectsContentDev = document.querySelector('.projetos-lista.dev');
const projectsContentDesign = document.querySelector('.projetos-lista.design');

devButton.addEventListener('click', () => {
  projectContainer.classList.add('dev');
  projectsContentDev.classList.add('active');
  devTitle.classList.add('active');
  devButton.classList.add('active');

  projectContainer.classList.remove('design');
  designTitle.classList.remove('active');
  designButton.classList.remove('active');
  projectsContentDesign.classList.remove('active');
});
designButton.addEventListener('click', () => {
  projectContainer.classList.add('design');
  projectsContentDesign.classList.add('active');
  designTitle.classList.add('active');
  designButton.classList.add('active');

  projectContainer.classList.remove('dev');
  devTitle.classList.remove('active');
  devButton.classList.remove('active');
  projectsContentDev.classList.remove('active');
});
