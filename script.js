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

        // Gatefold Opening Experience
        const enterBtn = document.getElementById('enterBtn');
        const overlay = document.getElementById('welcomeOverlay');

        if (overlay && enterBtn) {
            enterBtn.addEventListener('click', () => {
                // Return if already active
                if (overlay.classList.contains('opened')) return;

                // 1. Trigger Open Animation (CSS handles the sliding)
                overlay.classList.add('opened');

                // 2. Play music immediately for effect
                bgMusic.play().then(() => {
                    updateMusicUI(true);
                    // Fade in volume nicely
                    bgMusic.volume = 0;
                    let vol = 0;
                    const interval = setInterval(() => {
                        if (vol < 0.6) {
                            vol += 0.05;
                            bgMusic.volume = vol;
                        } else {
                            clearInterval(interval);
                        }
                    }, 200);
                }).catch(e => console.log('Audio play failed:', e));

                // 3. Start fading in main content as gates begin to open
                setTimeout(() => {
                    document.body.classList.add('intro-complete');
                }, 300);

                // 4. Cleanup overlay after gates fully open
                setTimeout(() => {
                    overlay.classList.add('hidden');
                }, 1500);
            });
        }
    }

    // Transportation "Other" toggle
    const transportationSelect = document.getElementById('transportation');
    const transportationOtherGroup = document.getElementById('transportationOtherGroup');
    const transportationOtherInput = document.getElementById('transportation_other');

    if (transportationSelect && transportationOtherGroup) {
        transportationSelect.addEventListener('change', () => {
            if (transportationSelect.value === 'other') {
                transportationOtherGroup.style.display = 'block';
                transportationOtherInput.required = true;
            } else {
                transportationOtherGroup.style.display = 'none';
                transportationOtherInput.required = false;
                transportationOtherInput.value = '';
            }
        });
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
                'common_friend': '同事',
                'parents_friend': '父母的親朋好友'
            };
            submissionData.append('entry.476014869', relationshipMap[formData.get('relationship')] || '朋友');

            // entry.1923962083 = Transportation
            const transportMap = {
                'driving': '自行開車',
                'public_transport': '大眾交通工具',
                'carpool': '共乘',
                'other': '__other_option__'
            };
            const transportValue = formData.get('transportation');
            const transportText = transportMap[transportValue] || '';
            submissionData.append('entry.1923962083', transportText);

            // If "other" is selected, send the custom text to the other_option_response field
            if (transportValue === 'other' && formData.get('transportation_other')) {
                submissionData.append('entry.1923962083.other_option_response', formData.get('transportation_other'));
            }

            // entry.160528149 = Diet (Main)
            // entry.1121186166 = Diet (Special)
            const diet = formData.get('diet');
            if (diet === 'vegetarian') {
                submissionData.append('entry.160528149', '素');
            } else {
                submissionData.append('entry.160528149', '葷');
            }

            // Special dietary requirements
            const dietSpecial = formData.get('diet_special');
            if (dietSpecial && dietSpecial.trim() !== '') {
                submissionData.append('entry.1121186166', dietSpecial.trim());
            } else {
                submissionData.append('entry.1121186166', '無');
            }

            // entry.1854135250 = Seating Preference (座位安排需求)
            const seatingPref = formData.get('seating');
            if (seatingPref && seatingPref.trim() !== '') {
                submissionData.append('entry.1854135250', seatingPref.trim());
            } else {
                submissionData.append('entry.1854135250', '無');
            }

            // entry.1846393893 = Message
            submissionData.append('entry.1846393893', formData.get('message'));

            // entry.1618896703 = Ceremony Attendance (是否參加證婚儀式)
            const ceremonyMap = {
                'yes': '會',
                'no': '不會',
                'undecided': '尚未確定'
            };
            const ceremonyValue = formData.get('ceremony');
            submissionData.append('entry.1618896703', ceremonyMap[ceremonyValue] || '尚未確定');

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
