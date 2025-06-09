// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeNavigation();
    initializeCodeCopying();
    initializeScrollAnimations();
    initializeChapterCards();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = ['home', 'chapters'];
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Scroll to chapters section
function scrollToChapters() {
    const chaptersSection = document.getElementById('chapters');
    if (chaptersSection) {
        chaptersSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Code copying functionality
function initializeCodeCopying() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            copyCode(this);
        });
    });
}

// Copy code to clipboard
function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const codeText = codeBlock.textContent;
    
    // Create a temporary textarea to copy text
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = codeText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    
    try {
        document.execCommand('copy');
        
        // Update button text temporarily
        const originalText = button.textContent;
        button.textContent = '✅ Copied!';
        button.style.background = '#22c55e';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
        
    } catch (err) {
        console.error('Failed to copy code:', err);
        
        // Fallback for modern browsers
        navigator.clipboard.writeText(codeText).then(() => {
            const originalText = button.textContent;
            button.textContent = '✅ Copied!';
            button.style.background = '#22c55e';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(() => {
            button.textContent = '❌ Failed';
            setTimeout(() => {
                button.textContent = '📋 Copy';
            }, 2000);
        });
    }
    
    document.body.removeChild(tempTextarea);
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.chapter-card, .code-example, .explanation-box, .analogy-box, .tip-box, .challenge-box'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Chapter card interactions
function initializeChapterCards() {
    const chapterCards = document.querySelectorAll('.chapter-card');
    
    chapterCards.forEach(card => {
        card.addEventListener('click', function() {
            const chapterNumber = this.dataset.chapter;
            showChapter(parseInt(chapterNumber));
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px)';
        });
    });
}

// Show specific chapter content
function showChapter(chapterNumber) {
    // Hide all chapter contents
    const allChapters = document.querySelectorAll('[id$="-content"]');
    allChapters.forEach(chapter => {
        chapter.style.display = 'none';
    });
    
    // Show the selected chapter
    let targetChapter;
    if (chapterNumber === 1) {
        targetChapter = document.getElementById('chapter-content');
    } else {
        targetChapter = document.getElementById(`chapter-${chapterNumber}-content`);
    }
    
    if (targetChapter) {
        targetChapter.style.display = 'block';
        targetChapter.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update chapter card states
        updateChapterStates(chapterNumber);
    }
}

// Update chapter card active states
function updateChapterStates(activeChapter) {
    const chapterCards = document.querySelectorAll('.chapter-card');
    
    chapterCards.forEach((card, index) => {
        const chapterNum = parseInt(card.dataset.chapter);
        
        // Remove all state classes
        card.classList.remove('active', 'available', 'upcoming');
        
        if (chapterNum === activeChapter) {
            card.classList.add('active');
            card.querySelector('.chapter-status').textContent = 'Current Chapter';
        } else if (chapterNum <= 5) { // All chapters are available now
            card.classList.add('available');
            card.querySelector('.chapter-status').textContent = 'Available';
        } else {
            card.classList.add('upcoming');
            card.querySelector('.chapter-status').textContent = 'Coming Soon';
        }
    });
}

// Show coming soon message
function showComingSoonMessage() {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = '🚧 This chapter is coming soon! Stay tuned! 🚀';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add some interactive effects for mobile
function addMobileInteractions() {
    if (window.innerWidth <= 768) {
        const phoneScreen = document.querySelector('.phone-screen');
        if (phoneScreen) {
            phoneScreen.addEventListener('click', function() {
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            });
        }
    }
}

// Easter egg: Konami code
let konamiCode = '';
const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';

document.addEventListener('keydown', function(e) {
    konamiCode += e.code;
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode = konamiCode.slice(-konamiSequence.length);
    }
    
    if (konamiCode === konamiSequence) {
        activateEasterEgg();
        konamiCode = '';
    }
});

function activateEasterEgg() {
    // Add rainbow animation to the hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.animation = 'rainbow 2s linear infinite';
        
        // Add rainbow keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // Show easter egg message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            background-size: 400% 400%;
            animation: rainbow-bg 2s ease infinite;
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        message.innerHTML = '🎉 You found the secret code! <br>You are a true developer! 🚀';
        
        const rainbowBgStyle = document.createElement('style');
        rainbowBgStyle.textContent = `
            @keyframes rainbow-bg {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(rainbowBgStyle);
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
            heroTitle.style.animation = '';
        }, 5000);
    }
}

// Initialize mobile interactions on load
window.addEventListener('load', addMobileInteractions);

// Handle window resize
window.addEventListener('resize', function() {
    addMobileInteractions();
});

// Add smooth hover effects for buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button, .chapter-card');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #10b981);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress on load
window.addEventListener('load', createScrollProgress);

// Celebration function for completing all chapters
function celebrate() {
    // Create confetti effect
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfetti(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 100);
    }
    
    // Show celebration message
    const celebrationMessage = document.createElement('div');
    celebrationMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #ef4444);
        background-size: 400% 400%;
        animation: rainbow-bg 2s ease infinite;
        color: white;
        padding: 3rem;
        border-radius: 20px;
        text-align: center;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        max-width: 500px;
        font-size: 1.2rem;
    `;
    celebrationMessage.innerHTML = `
        <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">🎉 CONGRATULATIONS! 🎉</h2>
        <p style="margin: 0 0 1rem 0;">You've mastered the fundamentals of Android development!</p>
        <p style="margin: 0 0 1rem 0;">🏆 You're now ready to build amazing apps! 🏆</p>
        <p style="margin: 0; font-size: 1rem; opacity: 0.9;">Keep coding and creating awesome things!</p>
    `;
    
    document.body.appendChild(celebrationMessage);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (celebrationMessage.parentNode) {
            celebrationMessage.style.opacity = '0';
            celebrationMessage.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                celebrationMessage.parentNode.removeChild(celebrationMessage);
            }, 500);
        }
    }, 8000);
}

// Create confetti particles
function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${color};
        top: -10px;
        left: ${Math.random() * 100}vw;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: confettiFall 3s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, 3000);
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle); 