/* 
========================================================================
   Narsingdi District Student Council, MBSTU - Official Script File
========================================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // --- Dom Elements Cache ---
    const body = document.body;
    const backToTopBtn = document.getElementById("backToTop");
    const mobileMenuToggle = document.getElementById("mobileMenuToggle");
    const mobileDrawer = document.getElementById("mobileDrawer");
    const menuIcon = document.getElementById("menuIcon");
    const navLinks = document.querySelectorAll(".nav-link");
    const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
    const scrollSections = document.querySelectorAll(".scroll-section");
    const navLogoBtn = document.getElementById("navLogoBtn");

    // ==================== NAVIGATION & STICKY NAV ====================

    // Toggle Mobile Drawer
    if (mobileMenuToggle && mobileDrawer) {
        mobileMenuToggle.addEventListener("click", () => {
            mobileDrawer.classList.toggle("open");
            const isOpen = mobileDrawer.classList.contains("open");
            
            // Toggle hamburger icon to X
            if (isOpen) {
                menuIcon.setAttribute("data-lucide", "x");
            } else {
                menuIcon.setAttribute("data-lucide", "menu");
            }
            if (typeof lucide !== "undefined") {
                lucide.createIcons();
            }
        });
    }

    // Close mobile drawer when link is clicked
    const allNavLinks = [...navLinks, ...mobileNavLinks];
    allNavLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            // Close Drawer if open
            if (mobileDrawer) {
                mobileDrawer.classList.remove("open");
                if (menuIcon) {
                    menuIcon.setAttribute("data-lucide", "menu");
                    if (typeof lucide !== "undefined") {
                        lucide.createIcons();
                    }
                }
            }

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    if (navLogoBtn) {
        navLogoBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Scrollspy: Highlight Active Nav Links
    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY + 250; // offset for triggers
        
        let currentSectionId = "home";
        scrollSections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Update Desktop
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });

        // Update Mobile Drawer
        mobileNavLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });

        // Back to Top Visibility
        if (window.scrollY > 600) {
            backToTopBtn.classList.remove("hidden");
        } else {
            backToTopBtn.classList.add("hidden");
        }
    });

    // Back to Top Action
    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    // ==================== SCROLL REVEAL ANIMATIONS ====================
    scrollSections.forEach(section => {
        section.classList.add("reveal");
    });
    // Add reveal to home section elements
    document.querySelector(".badge")?.classList.add("reveal");
    document.querySelector(".main-title")?.classList.add("reveal");
    document.querySelector(".sub-title")?.classList.add("reveal");
    document.querySelector(".intro-text")?.classList.add("reveal");
    document.querySelector(".hero-actions")?.classList.add("reveal");
    document.querySelector(".stats-grid")?.classList.add("reveal");
    document.querySelector(".notice-ticker-banner")?.classList.add("reveal");
    document.querySelectorAll(".leadership-card")?.forEach(c => c.classList.add("reveal"));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll(".reveal").forEach(el => {
        revealObserver.observe(el);
    });


    // ==================== 2. ABOUT JOURNEY TIMELINE ====================
    document.querySelectorAll(".timeline-item").forEach(item => {
        item.classList.add("reveal");
        revealObserver.observe(item);
    });


    // ==================== 4. MEMBER DIRECTORY SEARCH & FILTER ====================
    const memberSearchInput = document.getElementById("memberSearchInput");
    const filterUpazila = document.getElementById("filterUpazila");
    const filterDepartment = document.getElementById("filterDepartment");
    const filterSession = document.getElementById("filterSession");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");
    const memberCountText = document.getElementById("memberCountText");
    const noResultsText = document.getElementById("noResultsText");
    const membersGrid = document.getElementById("membersGrid");
    const membersEmptyState = document.getElementById("membersEmptyState");
    const emptyStateResetBtn = document.getElementById("emptyStateResetBtn");
    let memberCards = document.querySelectorAll(".member-card");

    // Auto-sort members by session descending (newest first) on load
    if (membersGrid && memberCards.length > 0) {
        const sortedCards = Array.from(memberCards).sort((a, b) => {
            const sessionA = a.getAttribute("data-session") || "";
            const sessionB = b.getAttribute("data-session") || "";
            return sessionB.localeCompare(sessionA);
        });
        // Clear grid and re-append sorted cards
        membersGrid.innerHTML = "";
        sortedCards.forEach(card => {
            membersGrid.appendChild(card);
        });
        // Update memberCards to reflect the sorted elements in the DOM
        memberCards = document.querySelectorAll(".member-card");
    }

    // Dynamic Select Option Populator (Ensures dropdown options sync with DOM members)
    function populateFilters() {
        const upazilas = new Set();
        const depts = new Set();
        const sessions = new Set();

        memberCards.forEach(card => {
            const upazila = card.getAttribute("data-upazila");
            const dept = card.getAttribute("data-department");
            const session = card.getAttribute("data-session");

            if (upazila) upazilas.add(upazila);
            if (dept) depts.add(dept);
            if (session) sessions.add(session);
        });

        // Helper to update dropdown options
        function updateSelect(selectEl, valuesSet, placeholder) {
            if (!selectEl) return;
            const currentVal = selectEl.value;
            selectEl.innerHTML = `<option value="">${placeholder}</option>`;
            [...valuesSet].sort().forEach(val => {
                selectEl.innerHTML += `<option value="${val}">${val}</option>`;
            });
            selectEl.value = currentVal;
        }

        updateSelect(filterUpazila, upazilas, "All Upazilas");
        updateSelect(filterDepartment, depts, "All Departments");
        updateSelect(filterSession, sessions, "All Sessions");
    }

    // Main Filtering Logic
    function filterMembers() {
        const query = memberSearchInput.value.toLowerCase().trim();
        const upazilaVal = filterUpazila.value;
        const deptVal = filterDepartment.value;
        const sessionVal = filterSession.value;

        // Check if any filter is active to show the Reset Button
        const isFilterActive = query || upazilaVal || deptVal || sessionVal;
        if (isFilterActive) {
            resetFiltersBtn.classList.remove("hidden");
        } else {
            resetFiltersBtn.classList.add("hidden");
        }

        let visibleCount = 0;

        memberCards.forEach(card => {
            const name = card.getAttribute("data-name").toLowerCase();
            const upazila = card.getAttribute("data-upazila");
            const dept = card.getAttribute("data-department").toLowerCase();
            const session = card.getAttribute("data-session");

            const matchesSearch = 
                name.includes(query) || 
                upazila.toLowerCase().includes(query) || 
                dept.includes(query) || 
                session.includes(query);

            const matchesUpazila = !upazilaVal || upazila === upazilaVal;
            const matchesDept = !deptVal || dept.toUpperCase() === deptVal.toUpperCase();
            const matchesSession = !sessionVal || session === sessionVal;

            if (matchesSearch && matchesUpazila && matchesDept && matchesSession) {
                card.classList.remove("hide");
                visibleCount++;
            } else {
                card.classList.add("hide");
            }
        });

        // Update counts
        memberCountText.textContent = `Showing ${visibleCount} of ${memberCards.length} members`;

        // Toggle Empty state
        if (visibleCount === 0) {
            noResultsText.classList.remove("hidden");
            membersGrid.classList.add("hidden");
            membersEmptyState.classList.remove("hidden");
        } else {
            noResultsText.classList.add("hidden");
            membersGrid.classList.remove("hidden");
            membersEmptyState.classList.add("hidden");
        }
    }

    // Reset filters
    function resetMemberFilters() {
        memberSearchInput.value = "";
        filterUpazila.value = "";
        filterDepartment.value = "";
        filterSession.value = "";
        filterMembers();
    }

    // Register Member Directory Listeners
    if (memberSearchInput) memberSearchInput.addEventListener("input", filterMembers);
    if (filterUpazila) filterUpazila.addEventListener("change", filterMembers);
    if (filterDepartment) filterDepartment.addEventListener("change", filterMembers);
    if (filterSession) filterSession.addEventListener("change", filterMembers);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener("click", resetMemberFilters);
    if (emptyStateResetBtn) emptyStateResetBtn.addEventListener("click", resetMemberFilters);

    // Initial setup
    populateFilters();


    // ==================== 5. EVENTS TAB FILTER ====================
    const tabBtnUpcoming = document.getElementById("tabBtnUpcoming");
    const tabBtnCompleted = document.getElementById("tabBtnCompleted");
    const eventCards = document.querySelectorAll("[data-event-status]");
    const eventsEmptyState = document.getElementById("eventsEmptyState");
    const eventsGrid = document.getElementById("eventsGrid");

    function filterEvents(status) {
        let visibleCount = 0;
        eventCards.forEach(card => {
            if (card.getAttribute("data-event-status") === status) {
                card.classList.remove("hide");
                card.classList.add("reveal");
                revealObserver.observe(card);
                visibleCount++;
            } else {
                card.classList.add("hide");
                card.classList.remove("reveal");
            }
        });

        // Toggle empty state
        if (visibleCount === 0) {
            eventsGrid.classList.add("hidden");
            eventsEmptyState.classList.remove("hidden");
        } else {
            eventsGrid.classList.remove("hidden");
            eventsEmptyState.classList.add("hidden");
        }
    }

    if (tabBtnUpcoming && tabBtnCompleted) {
        tabBtnUpcoming.addEventListener("click", () => {
            tabBtnUpcoming.classList.add("active");
            tabBtnCompleted.classList.remove("active");
            filterEvents("Upcoming");
        });

        tabBtnCompleted.addEventListener("click", () => {
            tabBtnCompleted.classList.add("active");
            tabBtnUpcoming.classList.remove("active");
            filterEvents("Completed");
        });
    }


    // ==================== 6. PHOTO GALLERY LIGHTBOX ====================
    const galleryItems = document.querySelectorAll(".gallery-item-card");
    const lightboxModal = document.getElementById("lightboxModal");
    const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
    const lightboxOverlayClose = document.getElementById("lightboxOverlayClose");
    const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
    const lightboxNextBtn = document.getElementById("lightboxNextBtn");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxMetaText = document.getElementById("lightboxMetaText");

    let currentGalleryIndex = null;

    function openLightbox(index) {
        currentGalleryIndex = index;
        lightboxModal.classList.remove("hidden");
        body.style.overflow = "hidden"; // disable scroll
        updateLightboxContent();
    }

    function closeLightbox() {
        lightboxModal.classList.add("hidden");
        body.style.overflow = ""; // restore scroll
        currentGalleryIndex = null;
    }

    const lightboxImg = document.getElementById("lightboxImg");

    function updateLightboxContent() {
        if (currentGalleryIndex === null) return;
        const currentItem = galleryItems[currentGalleryIndex];
        
        const title = currentItem.getAttribute("data-title");
        const date = currentItem.getAttribute("data-date");
        const img = currentItem.querySelector("img");
        
        if (img && lightboxImg) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || title;
        }
        
        lightboxTitle.textContent = title;
        lightboxMetaText.textContent = `Uploaded: ${date} • Photo ${currentGalleryIndex + 1} of ${galleryItems.length}`;
    }

    function navigateGallery(direction) {
        if (currentGalleryIndex === null) return;
        if (direction === "next") {
            currentGalleryIndex = (currentGalleryIndex === galleryItems.length - 1) ? 0 : currentGalleryIndex + 1;
        } else {
            currentGalleryIndex = (currentGalleryIndex === 0) ? galleryItems.length - 1 : currentGalleryIndex - 1;
        }
        updateLightboxContent();
    }

    galleryItems.forEach((item) => {
        item.addEventListener("click", () => {
            const index = parseInt(item.getAttribute("data-gallery-index"));
            openLightbox(index);
        });
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
    if (lightboxOverlayClose) lightboxOverlayClose.addEventListener("click", closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", () => navigateGallery("prev"));
    if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", () => navigateGallery("next"));

    // Keyboard controls for Lightbox
    window.addEventListener("keydown", (e) => {
        if (lightboxModal.classList.contains("hidden")) return;
        if (e.key === "ArrowRight") {
            navigateGallery("next");
        } else if (e.key === "ArrowLeft") {
            navigateGallery("prev");
        } else if (e.key === "Escape") {
            closeLightbox();
        }
    });


    // ==================== 7. NEWS & NOTICES SEARCH & DETAILS ====================
    const newsSearchInput = document.getElementById("newsSearchInput");
    const newsCards = document.querySelectorAll(".news-card");
    const newsEmptyState = document.getElementById("newsEmptyState");
    const newsGrid = document.getElementById("newsGrid");
    const newsCategoryBtns = document.querySelectorAll("[data-news-category]");
    
    // Details Modal elements
    const newsDetailsModal = document.getElementById("newsDetailsModal");
    const newsModalCloseBtn = document.getElementById("newsModalCloseBtn");
    const newsModalBackdropClose = document.getElementById("newsModalBackdropClose");
    const modalTypeTag = document.getElementById("modalTypeTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalDate = document.getElementById("modalDate");
    const modalContent = document.getElementById("modalContent");
    const modalCloseActionBtn = document.getElementById("modalCloseActionBtn");

    let activeNewsCategory = "ALL";

    // Dynamic ticker sync (grabs first notice in html and puts it in notice ticker)
    const firstNoticeCard = document.querySelector('[data-news-type="NOTICE"]');
    const tickerNoticeText = document.getElementById("tickerNoticeText");
    if (firstNoticeCard && tickerNoticeText) {
        const title = firstNoticeCard.querySelector(".news-title").textContent;
        const text = firstNoticeCard.querySelector(".news-snippet").textContent.trim();
        tickerNoticeText.textContent = `${title} — ${text}`;
    }

    function filterNews() {
        const query = newsSearchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        newsCards.forEach(card => {
            const title = card.querySelector(".news-title").textContent.toLowerCase();
            const snippet = card.querySelector(".news-snippet").textContent.toLowerCase();
            const type = card.getAttribute("data-news-type");

            const matchesCategory = activeNewsCategory === "ALL" || type === activeNewsCategory;
            const matchesSearch = title.includes(query) || snippet.includes(query);

            if (matchesCategory && matchesSearch) {
                card.classList.remove("hide");
                card.classList.add("reveal");
                revealObserver.observe(card);
                visibleCount++;
            } else {
                card.classList.add("hide");
                card.classList.remove("reveal");
            }
        });

        // Toggle Empty state
        if (visibleCount === 0) {
            newsGrid.classList.add("hidden");
            newsEmptyState.classList.remove("hidden");
        } else {
            newsGrid.classList.remove("hidden");
            newsEmptyState.classList.add("hidden");
        }
    }

    // Category button hooks
    newsCategoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            newsCategoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeNewsCategory = btn.getAttribute("data-news-category");
            filterNews();
        });
    });

    if (newsSearchInput) newsSearchInput.addEventListener("input", filterNews);

    // Expand News/Notices Details Modal
    function openNewsDetailsModal(id) {
        const targetCard = document.querySelector(`.news-card[data-news-id="${id}"]`);
        if (!targetCard) return;

        const type = targetCard.getAttribute("data-news-type");
        const date = targetCard.getAttribute("data-date");
        const title = targetCard.querySelector(".news-title").textContent;
        const content = targetCard.querySelector(".news-snippet").textContent.trim();

        // Update Modal elements
        modalTypeTag.textContent = type;
        if (type === "NOTICE") {
            modalTypeTag.className = "modal-type-tag badge-notice";
        } else {
            modalTypeTag.className = "modal-type-tag badge-news";
        }
        modalTitle.textContent = title;
        modalDate.textContent = `Published on: ${date}`;
        modalContent.textContent = content;

        newsDetailsModal.classList.remove("hidden");
        body.style.overflow = "hidden";
    }

    function closeNewsDetailsModal() {
        newsDetailsModal.classList.add("hidden");
        body.style.overflow = "";
    }

    // Add listeners to "Read Details" links
    document.querySelectorAll(".read-details-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-trigger-notice-id");
            openNewsDetailsModal(id);
        });
    });

    if (newsModalCloseBtn) newsModalCloseBtn.addEventListener("click", closeNewsDetailsModal);
    if (newsModalBackdropClose) newsModalBackdropClose.addEventListener("click", closeNewsDetailsModal);
    if (modalCloseActionBtn) modalCloseActionBtn.addEventListener("click", closeNewsDetailsModal);


    // ==================== 8. CONTACT SUBMISSION & COPY TO CLIPBOARD ====================
    const contactForm = document.getElementById("contactForm");
    const contactFormSuccess = document.getElementById("contactFormSuccess");
    const formSubmitBtn = document.getElementById("formSubmitBtn");
    const formLoadingSpinner = document.getElementById("formLoadingSpinner");
    
    const copyBtns = document.querySelectorAll(".copy-btn");
    const copyToast = document.getElementById("copyToast");
    const toastText = document.getElementById("toastText");

    // Form Simulation
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Show loading state
            formSubmitBtn.setAttribute("disabled", "true");
            formLoadingSpinner.classList.remove("hidden");

            // Mock network latency (1.2s)
            setTimeout(() => {
                formSubmitBtn.removeAttribute("disabled");
                formLoadingSpinner.classList.add("hidden");
                
                // Show Success Message
                contactFormSuccess.classList.remove("hidden");
                contactForm.reset();

                // Scroll success message into view inside form container
                contactFormSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });

                // Hide success message after 5 seconds
                setTimeout(() => {
                    contactFormSuccess.classList.add("hidden");
                }, 5000);

            }, 1200);
        });
    }

    // Clipboard Copy Action
    function triggerToast(message) {
        if (!copyToast) return;
        toastText.textContent = message;
        copyToast.classList.remove("hidden");
        
        setTimeout(() => {
            copyToast.classList.add("hidden");
        }, 3000);
    }

    copyBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const textToCopy = btn.getAttribute("data-copy-text");
            const label = btn.getAttribute("data-copy-label");

            if (navigator.clipboard && textToCopy) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        triggerToast(`Copied ${label} to clipboard!`);
                    })
                    .catch(err => {
                        console.error("Failed to copy text: ", err);
                    });
            }
        });
    });


});
