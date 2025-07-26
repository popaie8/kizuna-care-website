// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    // Handle video background
    const video = document.getElementById('hero-video');
    if (video) {
        let videoLoaded = false;
        
        console.log('Video element found, attempting to load:', video.src);
        
        // Force load the video
        video.load();
        
        // Force autoplay on mobile
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('playsinline', 'true');
        
        // Try to play video immediately
        const playVideo = () => {
            video.play().then(() => {
                console.log('Video started playing');
            }).catch(err => {
                console.log('Auto-play was prevented:', err);
                // Try again on user interaction
                document.addEventListener('touchstart', () => {
                    video.play();
                }, { once: true });
            });
        };
        
        playVideo();
        
        // Check if video file exists
        video.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
            video.style.cssText = 'display: block !important; opacity: 1 !important; z-index: 10 !important; visibility: visible !important; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;';
            video.classList.add('video-visible');
            document.getElementById('home').classList.add('video-loaded');
            console.log('Video style completely replaced and classes added');
            console.log('Video computed style:', window.getComputedStyle(video).display);
            videoLoaded = true;
            // Try to play again after loaded
            playVideo();
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video can start playing');
            if (!videoLoaded) {
                video.style.cssText = 'display: block !important; opacity: 1 !important; z-index: 10 !important; visibility: visible !important; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;';
                video.classList.add('video-visible');
                document.getElementById('home').classList.add('video-loaded');
                console.log('Video style completely replaced and classes added in canplay');
                console.log('Video computed style:', window.getComputedStyle(video).display);
                videoLoaded = true;
            }
        });
        
        video.addEventListener('error', function(e) {
            console.error('Video failed to load:', e);
            console.error('Video error details:', e.target.error);
            video.style.display = 'none';
        });
        
        // Add loading timeout - if video doesn't load in 10 seconds, give up
        setTimeout(function() {
            if (!videoLoaded) {
                console.log('Video loading timeout - using gradient background');
                video.style.display = 'none';
            }
        }, 10000);
        
        // Try to play video after a short delay
        setTimeout(function() {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log('Video autoplay started');
                    if (!videoLoaded) {
                        video.style.display = 'block';
                        videoLoaded = true;
                    }
                }).catch(function(error) {
                    console.log('Video autoplay failed:', error);
                    // Try to play on user interaction
                    document.addEventListener('click', function playVideo() {
                        video.play().then(function() {
                            console.log('Video started after user interaction');
                            video.style.display = 'block';
                        }).catch(function(err) {
                            console.error('Video play failed even after user interaction:', err);
                        });
                        document.removeEventListener('click', playVideo);
                    }, { once: true });
                });
            }
        }, 500);
    }
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // Create backdrop element
        const backdrop = document.createElement('div');
        backdrop.id = 'mobile-menu-backdrop';
        backdrop.className = 'hidden';
        document.body.appendChild(backdrop);
        
        // Toggle menu function
        function toggleMenu() {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                // Close menu
                mobileMenu.classList.add('hidden');
                backdrop.classList.add('hidden');
                document.body.classList.remove('menu-open');
            } else {
                // Open menu
                mobileMenu.classList.remove('hidden');
                backdrop.classList.remove('hidden');
                document.body.classList.add('menu-open');
            }
        }
        
        // Menu button click
        mobileMenuButton.addEventListener('click', toggleMenu);
        
        // Backdrop click to close
        backdrop.addEventListener('click', toggleMenu);
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                backdrop.classList.add('hidden');
                document.body.classList.remove('menu-open');
            });
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                } else {
                    field.classList.remove('border-red-500');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('必須項目を入力してください。');
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.card, section h2, section p').forEach(el => {
        observer.observe(el);
    });
});