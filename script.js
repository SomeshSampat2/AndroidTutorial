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
    const totalChapters = 7;
    // Hide all chapter contents
    const allChapters = document.querySelectorAll('.chapter-content');
    allChapters.forEach(chapter => {
        chapter.style.display = 'none';
    });
    
    // Show the selected chapter
    let targetChapter;
    if (chapterNumber > 0 && chapterNumber <= totalChapters) {
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
    const totalAvailableChapters = 6; // Chapters 1-6 are available

    chapterCards.forEach(card => {
        const chapterNum = parseInt(card.dataset.chapter);
        
        // Remove all state classes
        card.classList.remove('active', 'available', 'coming-soon');
        
        if (chapterNum === activeChapter) {
            card.classList.add('active');
            card.querySelector('.chapter-status').textContent = 'Current Chapter';
        } else if (chapterNum <= totalAvailableChapters) {
            card.classList.add('available');
            card.querySelector('.chapter-status').textContent = 'Available';
        } else {
            card.classList.add('coming-soon');
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
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateX(100%);
        transition: opacity 0.5s ease, transform 0.5s ease;
    `;
    notification.textContent = 'This chapter is coming soon! 🚀';
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add mobile-specific interactions
function addMobileInteractions() {
    const hero = document.querySelector('.hero');
    let touchStartX = 0;
    
    hero.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    hero.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        if (touchEndX < touchStartX - 50) { // Swipe left
            showChapter(2);
        }
    });
}

// Easter egg functionality
function activateEasterEgg() {
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let keySequence = [];
    
    document.addEventListener('keydown', (e) => {
        keySequence.push(e.key);
        keySequence = keySequence.slice(-konamiCode.length);
        
        if (JSON.stringify(keySequence) === JSON.stringify(konamiCode)) {
            const easterEgg = document.createElement('div');
            easterEgg.innerHTML = `
                <div style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:9998; display:flex; align-items:center; justify-content:center; flex-direction:column; color:lime; font-family: 'Courier New', monospace;">
                    <h1 style="font-size:3rem; margin-bottom:1rem;">CODE MASTER!</h1>
                    <p style="font-size:1.5rem;">You found the secret key!</p>
                    <pre style="margin-top: 2rem; background: #111; padding: 1rem; border-radius: 8px; border: 1px solid lime;">
/\\_/\\
( o.o )
 > ^ <
                    </pre>
                </div>
            `;
            document.body.appendChild(easterEgg);
            
            setTimeout(() => {
                document.body.removeChild(easterEgg);
            }, 4000);
        }
    });
}

// Create and manage scroll progress bar
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 5px;
        background: linear-gradient(90deg, #8b5cf6, #ec4899);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollableHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });
}

// Celebration animation
function celebrate() {
    const confettiColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#3b82f6'];
    for (let i = 0; i < 100; i++) {
        createConfetti(confettiColors[i % confettiColors.length]);
    }
    
    const celebrationMessage = document.createElement('div');
    celebrationMessage.textContent = '🎉 You are awesome! 🎉';
    celebrationMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        font-size: 2.5rem;
        font-weight: bold;
        z-index: 10001;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transition: transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    `;
    document.body.appendChild(celebrationMessage);
    
    setTimeout(() => {
        celebrationMessage.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    setTimeout(() => {
        celebrationMessage.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => {
            document.body.removeChild(celebrationMessage);
        }, 500);
    }, 3000);
}

function createConfetti(color) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * -100}px;
        width: ${Math.random() * 15 + 5}px;
        height: ${Math.random() * 10 + 5}px;
        background-color: ${color};
        transform: rotate(${Math.random() * 360}deg);
        animation: fall ${Math.random() * 4 + 3}s linear infinite;
        z-index: 10000;
        opacity: ${Math.random()};
    `;
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        document.body.removeChild(confetti);
    }, 7000);
}

// Add keyframes for confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.innerHTML = `
    @keyframes fall {
        to {
            transform: translateY(110vh) rotate(${Math.random() * 720}deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle); 