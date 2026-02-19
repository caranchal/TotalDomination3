document.addEventListener('DOMContentLoaded', function() {
    // ===== КАСТОМНЫЙ КУРСОР =====
    const cursor = document.getElementById('customCursor');
    const cursorGlow = document.getElementById('cursorGlow');

    if (cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }

    // ===== ИНТЕРАКТИВНЫЙ АРТБОРД =====
    const artboard = document.getElementById('artboard');
    const images = document.querySelectorAll('.floating-image');
    
    if (artboard && images.length > 0) {
        let isMouseDown = false;
        let startX, startY;
        let rotateX = 0, rotateY = 0;
        let targetRotateX = 0, targetRotateY = 0;

        artboard.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        document.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            targetRotateY = deltaX * 0.1;
            targetRotateX = -deltaY * 0.1;

            rotateX += (targetRotateX - rotateX) * 0.1;
            rotateY += (targetRotateY - rotateY) * 0.1;

            images.forEach((img, index) => {
                const depth = 0.5 + (index * 0.1);
                img.style.transform = `translate3d(${deltaY * 0.02}px, ${deltaX * 0.02}px, 0) rotateX(${rotateX * depth}deg) rotateY(${rotateY * depth}deg)`;
            });
        });

        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            images.forEach((img, index) => {
                const speed = 0.02 + (index * 0.01);
                const x = mouseX * 20 * speed;
                const y = mouseY * 20 * speed;
                img.style.transform += ` translate(${x}px, ${y}px)`;
            });
        });
    }

    // ===== 3D TILT ДЛЯ КАРТОЧЕК =====
    const cards = document.querySelectorAll('.service-card, .why-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            card.style.setProperty('--x', x + 'px');
            card.style.setProperty('--y', y + 'px');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // ===== АНИМАЦИИ ПОЯВЛЕНИЯ =====
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('section-header')) {
                    const grid = entry.target.nextElementSibling;
                    if (grid) {
                        const cards = grid.querySelectorAll('.service-card, .why-card');
                        cards.forEach(card => card.classList.add('visible'));
                    }
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(el => observer.observe(el));

    // CTA секция
    const ctaContent = document.querySelector('.cta-content');
    if (ctaContent) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        ctaObserver.observe(ctaContent);
    }

    // ===== ДИНАМИЧЕСКАЯ ШАПКА =====
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== ПРОГРЕСС-БАР СКРОЛЛА =====
    const progressBar = document.getElementById('scrollProgress');
    const progressCircle = document.querySelector('.progress-circle');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressCircle && progressText) {
        const circumference = 2 * Math.PI * 27;
        progressCircle.style.strokeDasharray = circumference;
        
        const updateProgress = function() {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (winScroll / height) * 100;
            
            const offset = circumference - (scrolled / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressText.textContent = Math.round(scrolled) + '%';
            
            if (winScroll > 200) {
                progressBar.classList.add('visible');
            } else {
                progressBar.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        updateProgress();
        
        progressBar.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== МОДАЛЬНОЕ ОКНО =====
    const modal = document.getElementById('modalOverlay');
    const openButtons = document.querySelectorAll('#openFormBtn, #heroCtaBtn, #finalCtaBtn, #openMasterBtn');
    const closeBtn = document.getElementById('modalClose');

    function openModal() {
        if (!modal) return;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    openButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ===== ОТПРАВКА ФОРМЫ =====
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.form-button');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
                showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
                
                setTimeout(() => {
                    orderForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    closeModal();
                }, 1500);
            }, 1500);
        });
    }

    // ===== ФОРМАТИРОВАНИЕ ТЕЛЕФОНА =====
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            let formatted = '+7';
            if (value.length > 0) formatted += ' (' + value.substring(0, 3);
            if (value.length > 3) formatted += ') ' + value.substring(3, 6);
            if (value.length > 6) formatted += '-' + value.substring(6, 8);
            if (value.length > 8) formatted += '-' + value.substring(8, 10);
            
            e.target.value = formatted;
        });
    });

    // ===== КУКИ БАННЕР =====
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    
    if (cookieBanner && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 2000);
        }

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('visible');
            setTimeout(() => {
                cookieBanner.style.display = 'none';
            }, 500);
        });
    }

    // ===== ПЛАВАЮЩАЯ КНОПКА МАСТЕРА =====
    const flyBtn = document.getElementById('masterFlyBtn');
    const dynamicBtn = document.querySelector('.dynamic-btn');
    if (flyBtn) {
        setTimeout(() => {
            flyBtn.classList.add('visible');
        }, 7000);

        if (dynamicBtn) {
            const texts = ['Подобрать мастера →', 'Нужна помощь?', 'Срочный выезд?', 'Задать вопрос'];
            let index = 0;
            setInterval(() => {
                index = (index + 1) % texts.length;
                dynamicBtn.textContent = texts[index];
            }, 3000);
        }
    }

    // ===== ПЛАВНЫЙ СКРОЛЛ =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== ЗАКРЫТИЕ МОДАЛКИ ПО ESC =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // ===== УВЕДОМЛЕНИЯ =====
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#34C759' : '#4F8FFF'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Стили для уведомлений (добавляются один раз)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ===== Анимация счетчиков =====
    const counters = document.querySelectorAll('.counter-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                const duration = 2000;
                const step = target / (duration / 16);
                
                const updateCounter = () => {
                    count += step;
                    if (count < target) {
                        counter.textContent = Math.floor(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                        counter.classList.add('counted');
                    }
                };
                updateCounter();
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));

    // ===== Подсветка активных разделов =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-section');
            if (link.getAttribute('data-target') === current) {
                link.classList.add('active-section');
            }
        });
    });

    // ===== Динамический текст в Hero =====
    const dynamicHero = document.getElementById('dynamicHeroText');
    if (dynamicHero) {
        const phrases = ['на который можно положиться', 'который не подведет', 'с гарантией 2 года', 'круглосуточно'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        const typeEffect = function() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                dynamicHero.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                dynamicHero.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 500);
            } else {
                setTimeout(typeEffect, isDeleting ? 50 : 100);
            }
        };
        typeEffect();
    }

    // ===== Слайдер отзывов =====
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dots = document.querySelectorAll('.dot');

    if (track && prevBtn && nextBtn && dots.length > 0) {
        let currentIndex = 0;
        const cards = document.querySelectorAll('.testimonial-card');
        let cardWidth = cards[0]?.offsetWidth + 24 || 344;
        
        const updateSlider = function() {
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        };
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - 3) {
                currentIndex++;
                updateSlider();
            }
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
        
        window.addEventListener('resize', () => {
            cardWidth = cards[0]?.offsetWidth + 24 || 344;
            updateSlider();
        });
    }
});

window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.style.opacity = '1';
});

document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
    }
}, true);

// ===== ОТКРЫТИЕ ЮРИДИЧЕСКИХ МОДАЛОК =====
document.querySelectorAll('.legal-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const modalType = this.getAttribute('data-modal');
        let modalId;
        
        if (modalType === 'privacy') {
            modalId = 'privacyModal';
        } else if (modalType === 'agreement') {
            modalId = 'agreementModal';
        }
        
        if (modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
    });
});

fetch('https://backendx-production-c33e.up.railway.app/api/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: "...", phone: "...", comment: "..."})
})

// Закрытие по кнопке × и по клику вне окна (для всех модалок, включая юридические)
document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay') || e.target.hasAttribute('data-close')) {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    });
});

