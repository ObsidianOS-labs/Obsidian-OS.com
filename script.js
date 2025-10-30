// ===================================
// Navigation & Mobile Menu
// ===================================
const navbar = document.querySelector('.navbar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect (optimized with throttle)
let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
    if (lastScrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isExpanded = navMenu.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Close mobile menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll with offset for fixed navbar
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Scroll Animations (Fade In)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all fade-in elements
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));

// ===================================
// Feature Tabs
// ===================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        const targetPanel = document.querySelector(`[data-tab="${targetTab}"].tab-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
    });
});

// Keyboard navigation for tabs
tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
        let newIndex;
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            newIndex = (index + 1) % tabButtons.length;
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            newIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (e.key === 'Home') {
            e.preventDefault();
            newIndex = 0;
        } else if (e.key === 'End') {
            e.preventDefault();
            newIndex = tabButtons.length - 1;
        }
        
        if (newIndex !== undefined) {
            tabButtons[newIndex].focus();
            tabButtons[newIndex].click();
        }
    });
});

// ===================================
// Carousel
// ===================================
const carousel = document.querySelector('.carousel');
const carouselTrack = document.querySelector('.carousel-track');
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const indicators = document.querySelectorAll('.indicator');

let currentSlide = 0;
const totalSlides = slides.length;

function updateCarousel() {
    const offset = -currentSlide * 100;
    carouselTrack.style.transform = `translateX(${offset}%)`;
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
            indicator.setAttribute('aria-current', 'true');
        } else {
            indicator.classList.remove('active');
            indicator.setAttribute('aria-current', 'false');
        }
    });
    
    // Update slide active state
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

// Event listeners
if (prevBtn) {
    prevBtn.addEventListener('click', prevSlide);
}

if (nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
});

// Auto-play carousel
let autoplayInterval;

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Start autoplay when page loads
startAutoplay();

// Stop autoplay when user interacts
if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('touchstart', stopAutoplay, { passive: true });
}

// Keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoplay();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoplay();
    }
});

// Cleanup carousel on page unload
window.addEventListener('beforeunload', () => {
    stopAutoplay();
});

// ===================================
// Pillar Cards Hover Effects
// ===================================
const pillarCards = document.querySelectorAll('.pillar-card');

pillarCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        // Add subtle tilt effect
        card.style.transform = 'translateY(-8px) rotateX(2deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

// ===================================
// CTA Button Ripple Effect
// ===================================
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ===================================
// Parallax Effect on Hero (Optimized with RAF)
// ===================================
const heroBackground = document.querySelector('.hero-background');
const geometricShapes = document.querySelectorAll('.shape');
const heroElement = document.querySelector('.hero');
let parallaxTicking = false;
let lastParallaxScrollY = 0;

function updateParallax() {
    const scrolled = lastParallaxScrollY;
    const heroHeight = heroElement ? heroElement.offsetHeight : 0;
    
    if (scrolled < heroHeight) {
        const parallaxSpeed = scrolled * 0.5;
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${parallaxSpeed}px)`;
        }
        
        // Different parallax speeds for each shape
        geometricShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translate(-50%, -50%) translateY(${scrolled * speed}px)`;
        });
    }
    parallaxTicking = false;
}

if (heroElement) {
    window.addEventListener('scroll', () => {
        lastParallaxScrollY = window.pageYOffset;
        if (!parallaxTicking) {
            window.requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    }, { passive: true });
}

// ===================================
// Performance Optimization
// ===================================

// Lazy load images (if you add real images later)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Debounce function for performance
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Removed redundant debounced scroll event (consolidated into navbar and parallax handlers)

// ===================================
// Accessibility Enhancements
// ===================================

// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#hero';
skipLink.textContent = 'Skip to main content';
skipLink.className = 'skip-link';
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-accent-blue);
    color: var(--color-bg-primary);
    padding: 8px;
    text-decoration: none;
    z-index: 10000;
`;
skipLink.addEventListener('focus', function() {
    this.style.top = '0';
});
skipLink.addEventListener('blur', function() {
    this.style.top = '-40px';
});
document.body.insertBefore(skipLink, document.body.firstChild);

// Announce page changes for screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// Announce tab changes
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.textContent.trim();
        announceToScreenReader(`${tabName} tab selected`);
    });
});

// ===================================
// Theme Preference Detection
// ===================================

// Detect user's theme preference (in case you want to add a light mode toggle later)
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

prefersDarkScheme.addEventListener('change', (e) => {
    if (e.matches) {
        console.log('User prefers dark mode');
        // Apply dark theme (already default)
    } else {
        console.log('User prefers light mode');
        // Optionally implement light theme toggle
    }
});

// ===================================
// Mouse Glow Effect (Optional Enhancement)
// ===================================
const heroSection = document.querySelector('.hero');
let mouseGlow;

if (heroSection) {
    mouseGlow = document.createElement('div');
    mouseGlow.className = 'mouse-glow';
    mouseGlow.style.cssText = `
        position: absolute;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.2) 0%, transparent 70%);
        pointer-events: none;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 5;
    `;
    heroSection.appendChild(mouseGlow);
    
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouseGlow.style.left = x + 'px';
        mouseGlow.style.top = y + 'px';
        mouseGlow.style.opacity = '1';
    });
    
    heroSection.addEventListener('mouseleave', () => {
        mouseGlow.style.opacity = '0';
    });
}

// ===================================
// Feature Visual Animations Trigger
// ===================================
const featureVisuals = document.querySelectorAll('.feature-visual');

const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

featureVisuals.forEach(visual => {
    featureObserver.observe(visual);
});

// ===================================
// Testimonial Card Rotation
// ===================================
const testimonialCards = document.querySelectorAll('.testimonial-card');

testimonialCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ===================================
// Performance Monitoring
// ===================================
if ('PerformanceObserver' in window) {
    const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
            }
        }
    });
    
    perfObserver.observe({ entryTypes: ['navigation'] });
}

// ===================================
// Console Easter Egg
// ===================================
console.log(
    '%c🔷 Obsidian OS 🔷',
    'color: #00d4ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);'
);
console.log(
    '%cFortify Your Digital Frontier',
    'color: #7b2ff7; font-size: 14px; font-style: italic;'
);
console.log(
    '%cInterested in joining our development team? Check out our careers page!',
    'color: #10b981; font-size: 12px;'
);

// ===================================
// Initialize
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Obsidian OS website loaded successfully');
    
    // Trigger initial animations
    updateCarousel();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
});

// ===================================
// Service Worker Registration (for PWA capabilities)
// ===================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when you create a service worker file
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(error => console.log('SW registration failed:', error));
    });
}

// ===================================
// Waitlist Form Handling
// ===================================
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');

if (waitlistForm) {
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable form during submission
        const submitBtn = waitlistForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Joining...';
        
        try {
            // Simulate API call (replace with actual endpoint)
            await simulateAPICall(email);
            
            // Success
            showFormMessage('🎉 Success! You\'re on the waitlist. Check your email for confirmation.', 'success');
            emailInput.value = '';
            
            // Track successful signup
            trackEvent('Waitlist', 'Signup', 'Success');
            
            // Update stats (optional - in real app, fetch from server)
            updateWaitlistStats();
            
        } catch (error) {
            // Error
            showFormMessage('Oops! Something went wrong. Please try again later.', 'error');
            trackEvent('Waitlist', 'Signup', 'Error');
        } finally {
            // Re-enable form
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalBtnText;
        }
    });
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = 'form-message show ' + type;
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

function simulateAPICall(email) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                // Store in localStorage for demo purposes
                const waitlist = JSON.parse(localStorage.getItem('waitlist') || '[]');
                if (!waitlist.includes(email)) {
                    waitlist.push(email);
                    localStorage.setItem('waitlist', JSON.stringify(waitlist));
                }
                resolve();
            } else {
                reject(new Error('API Error'));
            }
        }, 1500);
    });
}

function updateWaitlistStats() {
    const statNumber = document.querySelector('.stat-item:first-child .stat-number');
    if (statNumber) {
        const currentCount = parseInt(statNumber.textContent.replace(/,/g, ''));
        const newCount = currentCount + 1;
        statNumber.textContent = newCount.toLocaleString();
        
        // Animate the number change
        statNumber.style.transform = 'scale(1.2)';
        statNumber.style.color = 'var(--color-accent-green)';
        setTimeout(() => {
            statNumber.style.transform = 'scale(1)';
            statNumber.style.color = '';
        }, 500);
    }
}

// ===================================
// Roadmap Scroll Animations
// ===================================
const roadmapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
        }
    });
}, { threshold: 0.3 });

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    roadmapObserver.observe(item);
});

// ===================================
// Community Cards Enhanced Hover
// ===================================
const communityCards = document.querySelectorAll('.community-card');

communityCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===================================
// Analytics (Placeholder)
// ===================================
function trackEvent(category, action, label) {
    // Privacy-focused analytics placeholder
    // Only implement if user consents
    console.log('Event tracked:', { category, action, label });
}

// Track CTA clicks
const ctaButtons = document.querySelectorAll('.btn-primary');
ctaButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Don't track form submissions (handled separately)
        if (btn.type !== 'submit') {
            trackEvent('CTA', 'Click', 'Join Waitlist Button');
        }
    });
});

// Track community link clicks
const communityLinks = document.querySelectorAll('.community-link');
communityLinks.forEach(link => {
    link.addEventListener('click', () => {
        const linkText = link.querySelector('span').textContent;
        trackEvent('Community', 'Click', linkText);
    });
});
