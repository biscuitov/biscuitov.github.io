class PortfolioApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentLang = localStorage.getItem('language') || 'en';
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.setupTheme();
        this.setupLanguage();
        this.bindEvents();
        this.initScrollObserver();
    }
    
    setupTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    setupLanguage() {
        const body = document.body;
        const langToggle = document.getElementById('langToggle');
        const langText = langToggle.querySelector('.lang-text');
        
        if (this.currentLang === 'ru') {
            body.setAttribute('data-current-lang', 'ru');
            langText.textContent = 'EN';
        } else {
            body.removeAttribute('data-current-lang');
            langText.textContent = 'RU';
        }
        
        this.updatePlaceholders();
    }
    
    toggleTheme() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.classList.add('theme-switch-animation');
        
        setTimeout(() => {
            if (this.currentTheme === 'light') {
                this.currentTheme = 'dark';
                document.documentElement.setAttribute('data-theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                this.currentTheme = 'light';
                document.documentElement.removeAttribute('data-theme');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            
            localStorage.setItem('theme', this.currentTheme);
        }, 100);
        
        setTimeout(() => {
            themeToggle.classList.remove('theme-switch-animation');
            this.isAnimating = false;
        }, 300);
    }
    
    toggleLanguage() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const body = document.body;
        const langToggle = document.getElementById('langToggle');
        const langText = langToggle.querySelector('.lang-text');
        
        if (this.currentLang === 'en') {
            this.currentLang = 'ru';
            body.setAttribute('data-current-lang', 'ru');
            langText.textContent = 'EN';
        } else {
            this.currentLang = 'en';
            body.removeAttribute('data-current-lang');
            langText.textContent = 'RU';
        }
        
        localStorage.setItem('language', this.currentLang);
        this.updatePlaceholders();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 300);
    }
    
    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        const langToggle = document.getElementById('langToggle');
        
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        langToggle.addEventListener('click', () => {
            this.toggleLanguage();
        });
        
        this.addScrollEffects();
    }
    
    addScrollEffects() {
        const header = document.querySelector('header');
        let lastScrollTop = 0;
        let ticking = false;
        
        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
    }
    
    initScrollObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll('.tech-category, .project-card, .tool-category, .timeline-item, .footer-section');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    updatePlaceholders() {
        const textareas = document.querySelectorAll('textarea[data-placeholder-en][data-placeholder-ru]');
        textareas.forEach(textarea => {
            if (this.currentLang === 'ru') {
                textarea.placeholder = textarea.getAttribute('data-placeholder-ru');
            } else {
                textarea.placeholder = textarea.getAttribute('data-placeholder-en');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});