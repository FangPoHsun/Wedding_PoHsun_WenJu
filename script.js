document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling is handled by CSS, but we can add active state to nav links if we want

    // Parallax Effect for Hero (disabled on mobile for better performance)
    const hero = document.querySelector('.hero');
    const isMobile = window.innerWidth <= 768;

    if (hero && !isMobile) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        });
    }

    // ==========================================
    // Photo Collage - No slideshow needed
    // Lightbox handles viewing photos
    // ==========================================

    // ==========================================
    // Mobile Navigation (Hamburger Menu)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================
    // Lightbox Functionality
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleryImages = document.querySelectorAll('.collage-img');

    if (lightbox && galleryImages.length > 0) {
        let lightboxIndex = 0;

        // Open lightbox when clicking gallery image
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                lightboxIndex = index;
                openLightbox();
            });
        });

        function openLightbox() {
            lightboxImg.src = galleryImages[lightboxIndex].src;
            lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }

        function showPrevImage() {
            lightboxIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[lightboxIndex].src;
            lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
        }

        function showNextImage() {
            lightboxIndex = (lightboxIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[lightboxIndex].src;
            lightboxCounter.textContent = `${lightboxIndex + 1} / ${galleryImages.length}`;
        }

        // Event listeners
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation for lightbox
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        });

        // Touch/swipe support for lightbox
        let lightboxTouchStartX = 0;
        let lightboxTouchEndX = 0;

        lightboxImg.addEventListener('touchstart', (e) => {
            lightboxTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightboxImg.addEventListener('touchend', (e) => {
            lightboxTouchEndX = e.changedTouches[0].screenX;
            const diff = lightboxTouchStartX - lightboxTouchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    showNextImage();
                } else {
                    showPrevImage();
                }
            }
        }, { passive: true });
    }

    // ==========================================
    // Welcome Overlay & Background Music Control
    // ==========================================
    const welcomeOverlay = document.getElementById('welcomeOverlay');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const musicOnIcon = document.querySelector('.music-on');
    const musicOffIcon = document.querySelector('.music-off');

    if (bgMusic && musicBtn) {
        let isPlaying = false;

        // Set initial volume
        bgMusic.volume = 0.5;

        function updateMusicUI(playing) {
            isPlaying = playing;
            if (playing) {
                musicBtn.classList.add('playing');
                if (musicOnIcon) musicOnIcon.style.display = 'block';
                if (musicOffIcon) musicOffIcon.style.display = 'none';
            } else {
                musicBtn.classList.remove('playing');
                if (musicOnIcon) musicOnIcon.style.display = 'none';
                if (musicOffIcon) musicOffIcon.style.display = 'block';
            }
        }

        function toggleMusic() {
            if (isPlaying) {
                bgMusic.pause();
                updateMusicUI(false);
            } else {
                bgMusic.play().catch(e => console.log('Audio play failed:', e));
                updateMusicUI(true);
            }
        }

        musicBtn.addEventListener('click', toggleMusic);

        // Welcome overlay click handler - starts music and hides overlay
        if (welcomeOverlay) {
            welcomeOverlay.addEventListener('click', () => {
                welcomeOverlay.classList.add('hidden');
                bgMusic.play().then(() => {
                    updateMusicUI(true);
                }).catch(e => console.log('Audio play failed:', e));
            });
        }
    }

    // Form Submission Handler
    const form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Gather form data
            const formData = new FormData(form);
            // const data = Object.fromEntries(formData.entries()); // Not strictly needed with direct mapping

            // Google Form Submission URL
            const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdWLJUhc2OA8k8VObIteha7dm1AS-mckBLdpLdO3IdEjUM6-Q/formResponse';

            // Map form data to Google Form Entry IDs
            const submissionData = new FormData();

            // entry.1241854945 = Name
            submissionData.append('entry.1241854945', formData.get('name'));

            // entry.151973002 = Phone
            submissionData.append('entry.151973002', formData.get('phone'));

            // entry.663585314 = Email
            submissionData.append('entry.663585314', formData.get('email'));

            // entry.1521057408 = Attendance (Yes/No)
            const attendanceMap = {
                'attending': '是，我會參加',
                'declining': '抱歉無法出席 QQ'
            };
            submissionData.append('entry.1521057408', attendanceMap[formData.get('attendance')] || '');

            // entry.1716751534 = Count (Combine Adults + Children)
            const adults = formData.get('adults') || 0;
            const children = formData.get('children') || 0;
            submissionData.append('entry.1716751534', `${adults}大 ${children}小`);

            // entry.883503362 = Baby Seats
            submissionData.append('entry.883503362', formData.get('baby_seat') || '0');

            // entry.476014869 = Relationship
            const relationshipMap = {
                'groom_side': '家人/親戚',
                'bride_side': '朋友',
                'common_friend': '同事'
            };
            submissionData.append('entry.476014869', relationshipMap[formData.get('relationship')] || '朋友');

            // entry.1923962083 = Transportation
            const transportMap = {
                'driving': '自行開車',
                'public_transport': '大眾交通工具',
                'other': '共乘' // Mapping 'other' to Carpool/Other logic
            };
            submissionData.append('entry.1923962083', transportMap[formData.get('transportation')] || '');

            // entry.160528149 = Diet (Main)
            // entry.1121186166 = Diet (Special)
            const diet = formData.get('diet');
            if (diet === 'vegetarian') {
                submissionData.append('entry.160528149', '素');
            } else {
                submissionData.append('entry.160528149', '葷');
            }

            if (diet === 'no_beef' || diet === 'no_seafood' || diet === 'other') {
                submissionData.append('entry.1121186166', diet); // Using the value as the special request
            }

            // entry.1846393893 = Message
            submissionData.append('entry.1846393893', formData.get('message'));

            // entry.1618896703 = Ceremony Attendance (Default to "尚未確定" if not asked, or assume Yes if coming)
            if (formData.get('attendance') === 'attending') {
                submissionData.append('entry.1618896703', '會');
            }

            // UI Feedback
            const submitBtn = form.querySelector('.submit-button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            fetch(FORM_URL, {
                method: 'POST',
                body: submissionData,
                mode: 'no-cors' // Use no-cors for Google Forms
            })
                .then(() => {
                    submitBtn.innerText = 'Thank You! RSVP Sent.';
                    submitBtn.style.backgroundColor = '#D4AF37'; // Gold
                    form.reset();
                    setTimeout(() => {
                        submitBtn.innerText = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }, 3000);
                    alert('Thank you! Your response has been saved to the Google Form.');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Something went wrong. Please try again.');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
});
