// Mobile Menu Toggle
function toggleMenu() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  const nav = document.getElementById('nav');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (nav && menuToggle) {
    if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
      nav.classList.remove('active');
    }
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
  });
});

// Console message
console.log('%c재성의 개발 블로그에 오신 것을 환영합니다! 🚀', 
  'color: #22d3ee; font-size: 16px; font-weight: bold;');
