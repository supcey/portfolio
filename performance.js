// Performance optimization utilities

// Preload critical images
function preloadCriticalImages() {
    const criticalImages = [
        'assets/w_1_portfolyo.webp',
        'assets/w_2_logo.webp',
        'assets/w_3_kartvizit.webp'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Optimize image loading
function optimizeImageLoading() {
    // Add loading="lazy" to non-critical images
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        if (!img.classList.contains('critical')) {
            img.loading = 'lazy';
        }
    });
}

// Optimize video loading
function optimizeVideoLoading() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        // Add loading="lazy" to iframes
        iframe.loading = 'lazy';
        
        // Store original src in data-src for lazy loading
        if (iframe.src && !iframe.hasAttribute('data-src')) {
            iframe.setAttribute('data-src', iframe.src);
            iframe.removeAttribute('src');
        }
    });
}

// Debounce scroll events
function debounceScroll(func, wait) {
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

// Optimize scroll performance
function optimizeScrollPerformance() {
    const scrollHandler = debounceScroll(() => {
        // Handle scroll events efficiently
        requestAnimationFrame(() => {
            // Update scroll-dependent elements
            updateScrollElements();
        });
    }, 16); // ~60fps
    
    window.addEventListener('scroll', scrollHandler, { passive: true });
}

// Update scroll-dependent elements
function updateScrollElements() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }
}

// Optimize animations
function optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    const animate = (callback) => {
        requestAnimationFrame(callback);
    };
    
    // Optimize marquee animations
    const marqueeTracks = document.querySelectorAll('.marquee-track');
    marqueeTracks.forEach(track => {
        track.style.willChange = 'transform';
    });
}

// Memory management
function optimizeMemoryUsage() {
    // Clean up observers when elements are removed
    const cleanupObservers = () => {
        if (window.marqueeObserver) {
            window.marqueeObserver.disconnect();
        }
        if (window.videoObserver) {
            window.videoObserver.disconnect();
        }
        if (window.imageObserver) {
            window.imageObserver.disconnect();
        }
    };
    
    // Clean up on page unload
    window.addEventListener('beforeunload', cleanupObservers);
}

// Initialize all performance optimizations
function initializePerformanceOptimizations() {
    preloadCriticalImages();
    optimizeImageLoading();
    optimizeVideoLoading();
    optimizeScrollPerformance();
    optimizeAnimations();
    optimizeMemoryUsage();
}

// Export for use in main script
window.initializePerformanceOptimizations = initializePerformanceOptimizations; 