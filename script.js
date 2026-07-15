document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- Staggered reveal animations on scroll ---
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // Stagger project cards as a group for a cascading entrance
    document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
        card.style.setProperty('--reveal-delay', `${Math.min(i * 0.08, 0.5)}s`);
    });
    document.querySelectorAll('.excellence-grid .grid-card').forEach((card, i) => {
        card.style.setProperty('--reveal-delay', `${Math.min(i * 0.08, 0.4)}s`);
    });

    // --- Header scroll state ---
    const header = document.querySelector('.navbar');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
            }
        });
    });

    // --- Count-up animation for stats ---
    const animateCount = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) {
            el.textContent = `${prefix}${target}${suffix}`;
            return;
        }
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            el.textContent = `${prefix}${Math.round(eased * target)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => countObserver.observe(c));

    // --- 3D tilt + spotlight for bento cards ---
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.grid-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width;
                const py = (e.clientY - rect.top) / rect.height;
                const rotY = (px - 0.5) * 10;
                const rotX = (0.5 - py) * 10;
                card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
                card.style.setProperty('--mx', `${px * 100}%`);
                card.style.setProperty('--my', `${py * 100}%`);
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // --- Parallax on the hero phone ---
        const phone = document.querySelector('.hero-phone');
        const heroVisual = document.querySelector('.hero-visual');
        if (phone && heroVisual) {
            heroVisual.addEventListener('mousemove', (e) => {
                const rect = heroVisual.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                phone.style.transform = `translateY(-28px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
            });
            heroVisual.addEventListener('mouseleave', () => {
                phone.style.transform = '';
            });
        }

        // --- Magnetic effect for primary buttons ---
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // --- Project Showcase Selection ---
    const projectData = {
        guruchatra: {
            title: "GuruChatra",
            tags: ["ERP", "COLLEGE"],
            description: "A comprehensive College ERP Application streamlining campus administration and student management.",
            image: "assets/images/guruchatra.png",
            specs: [
                "<strong>Platforms:</strong> Android, iOS &amp; Web",
                "<strong>Tech Stack:</strong> Swift, SwiftUI, Kotlin, React, CoreData, REST APIs",
                "<strong>Target Audience:</strong> Students, Faculty, and Admin",
                "<strong>Core Features:</strong> Attendance tracking, timetable view, grading sheet, and fee payment portal."
            ]
        },
        strishakthi: {
            title: "Strishakthi",
            tags: ["SOCIAL"],
            description: "Dedicated Women Empowerment app focusing on community support, safety alert triggers, and helpful local resources.",
            image: "assets/images/strishakthi.png",
            specs: [
                "<strong>Platforms:</strong> Android",
                "<strong>Tech Stack:</strong> Kotlin, Jetpack Compose, Google Maps SDK, Firebase Authentication, Push Notifications",
                "<strong>Target Audience:</strong> Women's safety groups and local communities",
                "<strong>Core Features:</strong> Real-time SOS triggers, safety mapping, community support groups, and helpful guidelines."
            ]
        },
        medication: {
            title: "Medication App",
            tags: ["HEALTH"],
            description: "Intelligent tracking and scheduling for personal medication, pills, and general health management.",
            image: "assets/images/medication.png",
            specs: [
                "<strong>Platforms:</strong> Android",
                "<strong>Tech Stack:</strong> Kotlin, Jetpack Compose, WorkManager, Room (SQLite)",
                "<strong>Target Audience:</strong> General patients and medical caregivers",
                "<strong>Core Features:</strong> Dose schedule reminders, drug interaction log, medication history, and doctor contacts."
            ]
        },
        college_nav: {
            title: "College Navigation App",
            tags: ["NAVIGATION"],
            description: "Navigate the campus structures effortlessly. An AR-powered application helping students find classrooms, labs, and facilities instantly.",
            image: "assets/images/college_nav.png",
            specs: [
                "<strong>Platforms:</strong> Android",
                "<strong>Tech Stack:</strong> Kotlin, ARCore, Sceneform, Google Location Services",
                "<strong>Target Audience:</strong> Freshmen students, university visitors, and staff",
                "<strong>Core Features:</strong> Augmented Reality route mapping, indoor building directories, quick facility search, and audio guides."
            ]
        },
        tax: {
            title: "Tax App",
            tags: ["FINANCE"],
            description: "Simplifying tax estimations, calculations, deductions, and automated filing processes for professionals.",
            image: "assets/images/tax.png",
            specs: [
                "<strong>Platforms:</strong> Android, iOS &amp; Web",
                "<strong>Tech Stack:</strong> Swift, SwiftUI, Kotlin, React, Charts Framework, JSON Parser",
                "<strong>Target Audience:</strong> Individual taxpayers and professional accountants",
                "<strong>Core Features:</strong> Automatic tax bracket matching, deduction optimizer, visual chart history, and PDF invoice export."
            ]
        },
        timetable: {
            title: "Timetable App",
            tags: ["PRODUCTIVITY"],
            description: "Advanced scheduling tool optimizing class timings, assignments, exams, and calendar events for students and faculty.",
            image: "assets/images/timetable.png",
            specs: [
                "<strong>Platforms:</strong> Android, iOS &amp; Web",
                "<strong>Tech Stack:</strong> Swift, SwiftUI, Kotlin, React, EventKit, iCloud Sync",
                "<strong>Target Audience:</strong> School and college students, faculty teachers",
                "<strong>Core Features:</strong> Automated calendar imports, task checklist tracker, home widgets, and offline local cache."
            ]
        }
    };

    const projectCards = document.querySelectorAll('.project-card');
    const showcase = document.getElementById('project-showcase');
    const showcaseTitle = document.getElementById('showcase-title');
    const showcaseDesc = document.getElementById('showcase-desc');
    const showcaseTags = document.getElementById('showcase-tags');
    const showcaseImg = document.getElementById('showcase-img');
    const showcaseSpecs = document.getElementById('showcase-specs');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const projectId = card.getAttribute('data-project');
            const data = projectData[projectId];
            if (!data) return;

            if (e.target.closest('.case-study-link')) {
                e.preventDefault();
            }

            showcase.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
            showcase.style.opacity = '0.2';
            showcase.style.transform = 'scale(0.98)';

            setTimeout(() => {
                showcaseTitle.textContent = data.title;
                showcaseDesc.textContent = data.description;
                showcaseImg.src = data.image;
                showcaseImg.alt = data.title;

                showcaseTags.innerHTML = '';
                data.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = tag;
                    showcaseTags.appendChild(span);
                });

                showcaseSpecs.innerHTML = '';
                data.specs.forEach(spec => {
                    const li = document.createElement('li');
                    li.innerHTML = spec;
                    showcaseSpecs.appendChild(li);
                });

                showcase.style.opacity = '1';
                showcase.style.transform = 'scale(1)';

                showcase.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'center'
                });
            }, 250);
        });
    });
});
