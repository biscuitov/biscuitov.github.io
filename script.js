document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.scroll-container');
    const footer = document.querySelector('footer');

    function adjustHeights() {
        const viewportHeight = window.innerHeight;
        scrollContainer.style.height = `${viewportHeight}px`;

        const contentHeight = Array.from(document.body.children[0].children)
            .reduce((total, element) => {
                if (element !== footer && !element.classList.contains('back-to-top') &&
                    !element.classList.contains('cursor')) {
                    return total + element.offsetHeight;
                }
                return total;
            }, 0);

        const totalHeight = contentHeight + (footer ? footer.offsetHeight : 0);

        if (totalHeight < viewportHeight) {
            const footerSpace = viewportHeight - contentHeight;
            if (footer) {
                footer.style.marginTop = `${footerSpace}px`;
            }
        } else {
            if (footer) {
                footer.style.marginTop = '0';
            }
        }
    }

    adjustHeights();
    window.addEventListener('resize', adjustHeights);

    const cursor = document.querySelector('.cursor');

    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    const interactiveElements = document.querySelectorAll('a, button, .tech-icon, .project-card, .social-icon');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.className = 'mouse-particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        document.body.appendChild(particle);

        setTimeout(() => {
            particle.style.opacity = '0';
            particle.style.transform = 'scale(2)';
            setTimeout(() => {
                particle.remove();
            }, 300);
        }, 10);
    }

    let throttled = false;
    document.addEventListener('mousemove', e => {
        if (!throttled) {
            createParticle(e.clientX, e.clientY);
            throttled = true;
            setTimeout(() => {
                throttled = false;
            }, 50);
        }
    });

    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const cardRect = card.getBoundingClientRect();
            const x = e.clientX - cardRect.left;
            const y = e.clientY - cardRect.top;

            const centerX = cardRect.width / 2;
            const centerY = cardRect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            const shine = card.querySelector('.tilt-card-shine');
            if (shine) {
                shine.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    const skillBars = document.querySelectorAll('.skill-progress-bar');

    function animateSkillBars() {
        skillBars.forEach(bar => {
            const target = bar.parentElement.previousElementSibling.querySelector('.skill-level').textContent;
            bar.style.width = target;
        });
    }

    const techCategories = document.querySelectorAll('.tech-category');
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.closest('.skill-bars')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    techCategories.forEach(category => {
        observer.observe(category);
    });

    const skillBarsSection = document.querySelector('.skill-bars');
    if (skillBarsSection) {
        observer.observe(skillBarsSection);
    }

    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const navBar = document.querySelector('.nav-bar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (lastScrollY < window.scrollY) {
            navBar.classList.add('hidden');
        } else {
            navBar.classList.remove('hidden');
        }

        lastScrollY = window.scrollY;
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    function blinkCursor() {
        const cursors = document.querySelectorAll('.terminal-cursor');
        cursors.forEach(cursor => {
            if (cursor.style.opacity === '0') {
                cursor.style.opacity = '1';
            } else {
                cursor.style.opacity = '0';
            }
        });
    }

    setInterval(blinkCursor, 500);

    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0; i < this.queue.length; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="text-scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const originalText = highlight.innerText;
        const textScramble = new TextScramble(highlight);

        highlight.addEventListener('mouseenter', () => {
            textScramble.setText(originalText);
        });
    });

    const copyBtn = document.querySelector('.code-copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const codeContent = Array.from(document.querySelectorAll('.line-content'))
                .map(line => line.textContent)
                .join('\n');

            navigator.clipboard.writeText(codeContent).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = 'Copy';
                }, 2000);
            });
        });
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true
        });
    }
});