// Performance optimizations
let marqueeObserver;
let videoObserver;
let imageObserver;

// Initialize all observers
function initializeObservers() {
    // Marquee observer
    marqueeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const trackId = entry.target.id;
                const word = getMarqueeWord(trackId);
                createMarqueeContent(trackId, word, 20);
                marqueeObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Video observer for lazy loading
    videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const src = iframe.getAttribute('data-src');
                if (src) {
                    iframe.src = src;
                    iframe.removeAttribute('data-src');
                }
                videoObserver.unobserve(iframe);
            }
        });
    }, {
        rootMargin: '100px'
    });

    // Image observer for progressive loading
    imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe marquee elements
    document.querySelectorAll('.marquee-track').forEach(track => {
        marqueeObserver.observe(track);
    });

    // Observe video iframes
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
        videoObserver.observe(iframe);
    });

    // Observe images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Get marquee word based on track ID
function getMarqueeWord(trackId) {
    const wordMap = {
        'marquee1': 'Logo',
        'marquee2': 'Kartivizt',
        'marquee3': 'Sosyal Medya',
        'marquee4': 'Ambalaj',
        'marquee5': 'Menü',
        'marquee6': 'Poster',
        'marquee7': 'Desen',
        'marquee8': 'Hareketli Grafik',
        'marquee9': 'İllüstrasyon',
        'marquee10': 'Çocuk Kitabı',
        'marquee11': 'NFT'
    };
    return wordMap[trackId] || 'Design';
}

const slider = document.querySelector('.slider');
const container = document.querySelector('.slider-container');

function createMarqueeContent(trackId, word, count = 20) {
    let svgSize = 24;
    if (window.innerWidth <= 600) {
        svgSize = 10;
    } else if (window.innerWidth <= 1024) {
        svgSize = 14;
    }
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" width="${svgSize}" height="${svgSize}" style="vertical-align:middle; margin: 0 12px;">
            <path fill="#ff8095" d="M17.57,8.28c2.26,4.92,5.9,7.6,9.27,9.05-4.75,2.21-7.67,5.52-9.37,8.91-2.15-4.52-5.65-7.22-8.95-8.83,4.82-2.05,7.53-5.7,9.05-9.13M17.5,0s0,16.79-17.5,17.05c0,0,16.65.76,17.5,17.84-.05-1.36-.12-15.28,17.5-17.84,0,0-.07,0-.21,0-1.86,0-15.72-.56-17.29-17.05h0ZM17.5,34.89c0,.07,0,.11,0,.11,0-.04,0-.07,0-.11h0Z"/>
        </svg>
    `;
    let html = '';
    for (let i = 0; i < count; i++) {
        html += `<span>${word}</span>`;
        if (i !== count - 1) html += svgIcon;
    }
    const el = document.getElementById(trackId);
    if (el) el.innerHTML = html + html;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized resize handler
const debouncedResize = debounce(() => {
    // Recreate marquee content only for visible elements
    document.querySelectorAll('.marquee-track').forEach(track => {
        if (track.innerHTML) {
            const trackId = track.id;
            const word = getMarqueeWord(trackId);
            createMarqueeContent(trackId, word, 20);
        }
    });
    
    // Update slider calculations
    totalWidth = calculateTotalWidth();
    updateSliderPosition();
}, 250);

document.addEventListener("DOMContentLoaded", function () {
    // Initialize performance optimizations
    if (window.initializePerformanceOptimizations) {
        window.initializePerformanceOptimizations();
    }
    
    // Initialize observers
    initializeObservers();
    
    // Add resize listener
    window.addEventListener('resize', debouncedResize);
});

// Slider functionality
let isDragging = false;
let currentTranslate = 0;
let prevTranslate = 0;
let lastPos = 0;
const speed = -10;
let animationFrameId;
let totalWidth;

function calculateTotalWidth() {
    const boxCount = slider ? slider.querySelectorAll('.box-illustration').length : 0;
    const boxWidth = window.innerWidth <= 768 ? 150 : 300;
    const gap = 20;
    return (boxWidth * boxCount) + (gap * (boxCount - 1));
}

totalWidth = calculateTotalWidth();

if (slider) {
    slider.addEventListener('mousedown', startDragging);
    slider.addEventListener('mouseup', stopDragging);
    slider.addEventListener('mouseleave', stopDragging);
    slider.addEventListener('mousemove', drag);
    slider.addEventListener('touchstart', startDragging);
    slider.addEventListener('touchend', stopDragging);
    slider.addEventListener('touchmove', drag);
}

function startDragging(e) {
    isDragging = true;
    lastPos = getPositionX(e);
    cancelAnimationFrame(animationFrameId);
    e.preventDefault();
}

function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const currentPos = getPositionX(e);
    const diff = currentPos - lastPos;
    currentTranslate += diff;
    updateSliderPosition();
    lastPos = currentPos;
}

function stopDragging() {
    if (!isDragging) return;
    isDragging = false;
    prevTranslate = currentTranslate;
    startAnimation();
}

function getPositionX(e) {
    return e.type && e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function updateSliderPosition() {
    if (!slider) return;
    if (currentTranslate <= -totalWidth) {
        currentTranslate += totalWidth;
        prevTranslate += totalWidth;
    } else if (currentTranslate > 0) {
        currentTranslate -= totalWidth;
        prevTranslate -= totalWidth;
    }
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function animate() {
    if (!isDragging) {
        currentTranslate += speed / 60;
        updateSliderPosition();
    }
    animationFrameId = requestAnimationFrame(animate);
}

function startAnimation() {
    animationFrameId = requestAnimationFrame(animate);
}

startAnimation();

window.addEventListener('resize', () => {
    totalWidth = calculateTotalWidth();
    updateSliderPosition();
});

const menuToggle = document.querySelector('.menu-toggle');
const contactIcons = document.querySelector('.contact-icons');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && contactIcons) {
    menuToggle.addEventListener('click', () => {
        contactIcons.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                contactIcons.classList.remove('active');
            }
        }
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        contactIcons.classList.remove('active');
    }
});

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        if (window.pageYOffset >= (sectionTop - navbarHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

let sliderDragging = false;
let sliderMoved = false;

if (slider) {
    slider.addEventListener('mousedown', function() {
        sliderDragging = true;
        sliderMoved = false;
    });
    slider.addEventListener('mousemove', function() {
        if (sliderDragging) sliderMoved = true;
    });
    slider.addEventListener('mouseup', function() {
        sliderDragging = false;
    });
    slider.addEventListener('mouseleave', function() {
        sliderDragging = false;
    });

    slider.addEventListener('touchstart', function() {
        sliderDragging = true;
        sliderMoved = false;
    });
    slider.addEventListener('touchmove', function() {
        if (sliderDragging) sliderMoved = true;
    });
    slider.addEventListener('touchend', function() {
        sliderDragging = false;
    });
}

document.querySelectorAll('.slider .box-illustration img').forEach(img => {
    img.style.cursor = 'pointer';

    img.addEventListener('click', function(e) {
        if (sliderMoved) {
            sliderMoved = false;
            return;
        }
        openModal(this.src);
    });

    img.addEventListener('touchend', function(e) {
        if (sliderMoved) {
            sliderMoved = false;
            return;
        }
        e.preventDefault();
        openModal(this.src);
    });
});

function openModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = src;
    modal.classList.add('active');
}

document.getElementById('closeModalBtn').onclick = function() {
    document.getElementById('image-modal').classList.remove('active');
};

document.getElementById('image-modal').onclick = function(e) {
    if (e.target === this) {
        this.classList.remove('active');
    }
};
