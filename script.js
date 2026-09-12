/**
 * Saad - Portfolio Interactive Engine (Vanilla JavaScript)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Drawer Menu ---
  const navToggleBtn = document.getElementById('navToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggleBtn) {
    navToggleBtn.addEventListener('click', openDrawer);
  }
  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeDrawer);
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // --- Contact / Inquiry Modal ---
  const contactModal = document.getElementById('contactModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-contact-modal');
  const contactForm = document.getElementById('contactForm');
  const formToast = document.getElementById('formToast');
  const projectScopeInput = document.getElementById('projectScope');

  function openContactModal(initialMessage = '') {
    if (!contactModal) return;
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (formToast) formToast.classList.remove('show');
    if (initialMessage && projectScopeInput) {
      projectScopeInput.value = initialMessage;
      projectScopeInput.focus();
    }
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeContactModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeContactModal();
      }
    });
  }

  // Handle Contact Form Submit
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        if (formToast) {
          formToast.classList.add('show');
          setTimeout(() => {
            closeContactModal();
            formToast.classList.remove('show');
          }, 2200);
        }
      }, 800);
    });
  }

  // ==========================================================================
  // HERO SECTION: 5-SECOND DYNAMIC IDENTITY ROTATOR
  // ==========================================================================
  const heroIdentityText = document.getElementById('heroIdentityText');
  const heroIdentityLine = document.getElementById('heroIdentityLine');
  const heroIdentityMeta = document.getElementById('heroIdentityMeta');
  const identityCategory = document.getElementById('identityCategory');
  const identityTimerProgress = document.getElementById('identityTimerProgress');
  const identityTimerTrack = document.getElementById('identityTimerTrack');
  const identityPipsNav = document.getElementById('identityPipsNav');

  const identities = [
    {
      title: 'Full-Stack Web Developer',
      category: 'MERN STACK'
    },
    {
      title: 'SaaS & MVP Product Builder',
      category: 'PRODUCT MVP'
    },
    {
      title: 'Modern Web Apps Architect',
      category: 'ARCHITECTURE'
    },
    {
      title: 'Business Systems Engineer',
      category: 'AUTOMATION'
    },
    {
      title: 'UI/UX & Frontend Specialist',
      category: 'USER EXPERIENCE'
    }
  ];

  let currentIdentityIndex = 0;
  let isRotating = true;
  let timerElapsedMs = 0;
  const ROTATE_INTERVAL_MS = 3000; // 3 seconds exactly
  const TICK_STEP_MS = 40;
  let rotationIntervalId = null;

  // Build navigation pips
  if (identityPipsNav) {
    identities.forEach((item, index) => {
      const pip = document.createElement('button');
      pip.type = 'button';
      pip.className = `identity-pip ${index === 0 ? 'active' : ''}`;
      pip.setAttribute('aria-label', `Switch identity to ${item.title}`);
      pip.title = `${item.title} (${item.category})`;
      pip.addEventListener('click', (e) => {
        e.stopPropagation();
        switchIdentity(index);
      });
      identityPipsNav.appendChild(pip);
    });
  }

  function updatePips(activeIndex) {
    if (!identityPipsNav) return;
    const pips = identityPipsNav.querySelectorAll('.identity-pip');
    pips.forEach((pip, idx) => {
      if (idx === activeIndex) {
        pip.classList.add('active');
      } else {
        pip.classList.remove('active');
      }
    });
  }

  function switchIdentity(targetIndex) {
    currentIdentityIndex = targetIndex;
    timerElapsedMs = 0;
    if (identityTimerProgress) identityTimerProgress.style.width = '0%';
    updatePips(currentIdentityIndex);

    if (!heroIdentityText) return;

    // 1. Exit stage (slide up with blur & 3D tilt)
    heroIdentityText.classList.remove('active', 'enter-prepare');
    heroIdentityText.classList.add('exit-up');

    // 2. Swap text and position below stage
    setTimeout(() => {
      const nextData = identities[currentIdentityIndex];
      heroIdentityText.textContent = nextData.title;
      if (identityCategory) {
        identityCategory.textContent = nextData.category;
      }

      heroIdentityText.classList.remove('exit-up');
      heroIdentityText.classList.add('enter-prepare');

      // 3. Smooth entrance to active position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heroIdentityText.classList.remove('enter-prepare');
          heroIdentityText.classList.add('active');
        });
      });
    }, 280);
  }

  function nextIdentity() {
    const nextIdx = (currentIdentityIndex + 1) % identities.length;
    switchIdentity(nextIdx);
  }

  // 5-second ticker loop
  function startIdentityTimer() {
    if (rotationIntervalId) clearInterval(rotationIntervalId);
    rotationIntervalId = setInterval(() => {
      if (!isRotating) return;

      timerElapsedMs += TICK_STEP_MS;
      const progressPercent = Math.min(100, (timerElapsedMs / ROTATE_INTERVAL_MS) * 100);
      if (identityTimerProgress) {
        identityTimerProgress.style.width = `${progressPercent}%`;
      }

      if (timerElapsedMs >= ROTATE_INTERVAL_MS) {
        nextIdentity();
      }
    }, TICK_STEP_MS);
  }

  startIdentityTimer();

  // Pause when hovering over the identity or meta controls
  const hoverContainers = [heroIdentityLine, heroIdentityMeta].filter(Boolean);
  hoverContainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
      isRotating = false;
    });
    container.addEventListener('mouseleave', () => {
      isRotating = true;
    });
  });

  // Clicking identity line or timer jumps immediately to next
  if (heroIdentityLine) {
    heroIdentityLine.style.cursor = 'pointer';
    heroIdentityLine.title = 'Click to switch identity';
    heroIdentityLine.addEventListener('click', () => {
      nextIdentity();
    });
  }

  if (identityTimerTrack) {
    identityTimerTrack.addEventListener('click', () => {
      nextIdentity();
    });
  }

  // Pause timer when browser tab is inactive to save battery and maintain sync
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRotating = false;
    } else {
      isRotating = true;
    }
  });

  // ==========================================================================
  // WHAT I BUILD (SERVICES) INTERACTIVITY & MODAL
  // ==========================================================================
  const serviceModal = document.getElementById('serviceModal');
  const serviceModalCloseBtn = document.getElementById('serviceModalCloseBtn');
  const openServiceCards = document.querySelectorAll('.open-service-modal');
  const smCategoryLabel = document.getElementById('smCategoryLabel');
  const smTitle = document.getElementById('serviceModalTitle');
  const smDesc = document.getElementById('smDescription');
  const smDeliverables = document.getElementById('smDeliverables');
  const smTimeline = document.getElementById('smTimeline');
  const smInquireCta = document.getElementById('smInquireCta');
  const smIconBox = document.getElementById('smIconBox');

  const serviceData = {
    web: {
      category: 'FULL-STACK DEVELOPMENT',
      title: 'Web Apps',
      iconClass: 'icon-blue',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      desc: 'Modern, responsive applications designed to solve real-world problems. Clean architecture, robust database models, and snappy performance for users on any device.',
      deliverables: [
        '✓ Responsive frontend with Next.js, React, or lightweight Vanilla JavaScript',
        '✓ High-speed RESTful & GraphQL backend APIs with Node.js / Express',
        '✓ Database architecture & query optimization (MongoDB / PostgreSQL)',
        '✓ Secure authentication flows (JWT, OAuth, RBAC permissions)',
        '✓ Automated deployments, SSL security, and CI/CD pipelines'
      ],
      timeline: '2 – 4 Weeks',
      inquirePrefill: 'Interested in building a custom Web Application. Looking for architecture consultation and delivery timeline.'
    },
    saas: {
      category: 'PRODUCT ENGINEERING & MVPs',
      title: 'SaaS Products',
      iconClass: 'icon-purple',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
      desc: 'From initial concept to rapid MVP launch and scalable production architecture. Built with monetization, multi-tenant isolation, and growth loops from Day 1.',
      deliverables: [
        '✓ Turnkey MVP development ready for initial customers and investors',
        '✓ Stripe billing engine (recurring subscriptions, meter tiers, customer portal)',
        '✓ Workspace isolation, invite links & multi-tenant user permissions',
        '✓ Real-time user updates via WebSockets, event feeds & activity logs',
        '✓ Production monitoring, error tracking, and scale-ready caching'
      ],
      timeline: '4 – 8 Weeks',
      inquirePrefill: 'Interested in building a SaaS Product / MVP. Would love to discuss project requirements, architecture, and timeline.'
    },
    business: {
      category: 'INTERNAL SYSTEMS & AUTOMATION',
      title: 'Business Systems',
      iconClass: 'icon-emerald',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M8 10h.01"></path><path d="M16 10h.01"></path><path d="M8 14h.01"></path><path d="M16 14h.01"></path></svg>',
      desc: 'Custom internal tools, dashboards, and automated pipelines that replace messy spreadsheets and streamline business operations for your team.',
      deliverables: [
        '✓ Custom admin management dashboards and unified reporting portals',
        '✓ Third-party API sync (CRMs, inventory systems, ERPs, accounting APIs)',
        '✓ Automated email, SMS, and webhook triggers for critical business events',
        '✓ Granular staff role-based access control (RBAC) & compliance audit trails',
        '✓ Automated data exports, PDF invoice generation, and scheduled backups'
      ],
      timeline: '3 – 6 Weeks',
      inquirePrefill: 'Interested in building custom Business Systems / Internal Tooling. Looking to streamline company operations and workflows.'
    }
  };

  let currentServiceKey = 'web';

  function openServiceDetailModal(serviceKey) {
    if (!serviceModal) return;
    const data = serviceData[serviceKey] || serviceData.web;
    currentServiceKey = serviceKey;

    if (smCategoryLabel) smCategoryLabel.textContent = data.category;
    if (smTitle) smTitle.textContent = data.title;
    if (smDesc) smDesc.textContent = data.desc;
    if (smTimeline) smTimeline.textContent = data.timeline;

    if (smIconBox) {
      smIconBox.className = `service-icon-box ${data.iconClass}`;
      smIconBox.innerHTML = data.iconSvg;
    }

    if (smDeliverables) {
      smDeliverables.innerHTML = data.deliverables.map(item => `<li>${item}</li>`).join('');
    }

    serviceModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openServiceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const key = card.getAttribute('data-service') || 'web';
      openServiceDetailModal(key);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = card.getAttribute('data-service') || 'web';
        openServiceDetailModal(key);
      }
    });
  });

  if (serviceModalCloseBtn) {
    serviceModalCloseBtn.addEventListener('click', closeServiceModal);
  }

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) {
        closeServiceModal();
      }
    });
  }

  if (smInquireCta) {
    smInquireCta.addEventListener('click', () => {
      closeServiceModal();
      const info = serviceData[currentServiceKey];
      openContactModal(info ? info.inquirePrefill : '');
    });
  }

  // ==========================================================================
  // MY WORK: CATEGORY FILTERING
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category') || '';
        if (filter === 'all' || category === filter) {
          card.classList.remove('filter-hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('filter-hidden');
        }
      });
    });
  });

  // ==========================================================================
  // MY WORK: PROJECT CASE STUDY MODAL
  // ==========================================================================
  const projectModal = document.getElementById('projectModal');
  const projectModalCloseBtn = document.getElementById('projectModalCloseBtn');
  const openProjectBtns = document.querySelectorAll('.open-project-modal, .project-title-link');
  const pmBadge = document.getElementById('pmBadge');
  const pmStatusText = document.getElementById('pmStatusText');
  const pmYear = document.getElementById('pmYear');
  const pmTitle = document.getElementById('projectModalTitle');
  const pmTagline = document.getElementById('pmTagline');
  const pmDescription = document.getElementById('pmDescription');
  const pmFeatures = document.getElementById('pmFeatures');
  const pmTechStack = document.getElementById('pmTechStack');
  const pmMetricVal = document.getElementById('pmMetricVal');
  const pmMetricLabel = document.getElementById('pmMetricLabel');
  const pmInquireBtn = document.getElementById('pmInquireBtn');
  const pmSimulateBtn = document.getElementById('pmSimulateBtn');
  const pmShowcase = document.getElementById('pmShowcase');

  const projectDetailsData = {
    devflw: {
      badge: 'SaaS / Collaboration',
      status: 'Shipped • Production',
      year: '2026',
      title: 'DevFlw',
      tagline: 'A unified workspace designed to eliminate client-developer communication gaps.',
      description: 'DevFlw bridges the gap between engineering teams and non-technical clients. By consolidating real-time progress pipelines, milestone sign-offs, and live UI review boards in one centralized interface, delivery cycles are shortened by 40% with zero email clutter.',
      features: [
        '✓ Real-time collaboration rooms with instant WebSocket sync',
        '✓ Live visual feedback pins directly on staging mockups',
        '✓ One-click milestone approvals & integrated Stripe invoices',
        '✓ Encrypted file vaults with role-based access control'
      ],
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
      metricVal: '99.8%',
      metricLabel: 'Client Satisfaction & System Uptime',
      inquirePrefill: 'Interested in building a collaboration SaaS platform similar to DevFlw. Let’s discuss scope and timeline.',
      showcaseHtml: `
        <div class="modal-showcase-img-wrap">
          <img src="/assets/images/project_devflw.jpg" alt="DevFlw Workspace Preview" class="modal-showcase-img" referrerPolicy="no-referrer" />
        </div>
      `
    },
    multitools: {
      badge: 'Web Utility / Productivity',
      status: 'Live • 12k+ Monthly Users',
      year: '2025',
      title: 'MultiTools',
      tagline: 'Clean, fast, and privacy-first web utilities in your pocket.',
      description: 'MultiTools is an open-access suite of developer utilities including JSON formatters, base64 encoders, regex validators, CSS generators, and hash calculators. Runs 100% in the browser via WebAssembly with zero telemetry or cookies.',
      features: [
        '✓ 40+ instant web developer tools with offline PWA support',
        '✓ Zero server telemetry: your data never leaves your browser',
        '✓ Keyboard shortcuts and fast fuzzy search indexing',
        '✓ Instant dark/light mode and custom snippet export'
      ],
      techStack: ['Vanilla JavaScript', 'TypeScript', 'Tailwind CSS', 'Web Workers', 'IndexedDB'],
      metricVal: '< 15ms',
      metricLabel: 'Average Tool Execution Speed',
      inquirePrefill: 'Interested in building a browser-based utility or developer tool suite like MultiTools. Let’s talk.',
      showcaseHtml: `
        <div class="modal-showcase-img-wrap">
          <img src="/assets/images/project_multitools.jpg" alt="MultiTools Preview" class="modal-showcase-img" referrerPolicy="no-referrer" />
        </div>
      `
    },
    tracker: {
      badge: 'Productivity / Analytics',
      status: 'Active • Open Beta',
      year: '2025',
      title: 'Dev Productivity Tracker',
      tagline: 'Data-driven productivity insights built specifically for software engineers.',
      description: 'Engineered to help software developers maintain healthy deep-work habits. Connects directly with Git repositories and terminal logs to visualize cognitive focus blocks, review throughput, and prevent late-night coding burnout.',
      features: [
        '✓ Deep work vs. administrative task automated categorization',
        '✓ Visual weekly telemetry charts with interactive drill-down',
        '✓ Burnout prevention warnings based on commit timestamp patterns',
        '✓ Privacy-first architecture: no keyloggers or screen captures'
      ],
      techStack: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Tailwind CSS'],
      metricVal: '38%',
      metricLabel: 'Reported Increase in Uninterrupted Focus',
      inquirePrefill: 'Interested in building an analytics dashboard or productivity platform like Dev Productivity Tracker.',
      showcaseHtml: `
        <div class="modal-showcase-img-wrap">
          <img src="/assets/images/project_tracker.jpg" alt="Dev Productivity Tracker Preview" class="modal-showcase-img" referrerPolicy="no-referrer" />
        </div>
      `
    },
    'productivity-tracker': {
      badge: 'Productivity / Analytics',
      status: 'Active • Open Beta',
      year: '2025',
      title: 'Dev Productivity Tracker',
      tagline: 'Data-driven productivity insights built specifically for software engineers.',
      description: 'Engineered to help software developers maintain healthy deep-work habits. Connects directly with Git repositories and terminal logs to visualize cognitive focus blocks, review throughput, and prevent late-night coding burnout.',
      features: [
        '✓ Deep work vs. administrative task automated categorization',
        '✓ Visual weekly telemetry charts with interactive drill-down',
        '✓ Burnout prevention warnings based on commit timestamp patterns',
        '✓ Privacy-first architecture: no keyloggers or screen captures'
      ],
      techStack: ['Next.js', 'TypeScript', 'D3.js', 'PostgreSQL', 'Tailwind CSS'],
      metricVal: '38%',
      metricLabel: 'Reported Increase in Uninterrupted Focus',
      inquirePrefill: 'Interested in building an analytics dashboard or productivity platform like Dev Productivity Tracker.',
      showcaseHtml: `
        <div class="modal-showcase-img-wrap">
          <img src="/assets/images/project_tracker.jpg" alt="Dev Productivity Tracker Preview" class="modal-showcase-img" referrerPolicy="no-referrer" />
        </div>
      `
    },
    amanahflow: {
      badge: 'Mobile / FinTech',
      status: 'Completed • Production',
      year: '2024',
      title: 'AmanahFlow',
      tagline: 'Modern community finance, dues tracking, and transparent fund management.',
      description: 'A mobile-first web application enabling residential communities, clubs, and non-profits to collect monthly maintenance fees, publish transparent public balance sheets, and vote on community initiatives without paper checks.',
      features: [
        '✓ Instant Stripe Connect payments with automated email receipts',
        '✓ Public transparency ledger with immutable audit logs',
        '✓ Member directory and payment status indicators',
        '✓ Responsive mobile interface optimized for 3G & smartphones'
      ],
      techStack: ['React Native Web', 'Firebase', 'Stripe Connect', 'Tailwind CSS', 'Node.js'],
      metricVal: '$120k+',
      metricLabel: 'Community Maintenance Dues Processed',
      inquirePrefill: 'Interested in building a community finance or dues management platform like AmanahFlow.',
      showcaseHtml: `
        <div class="modal-showcase-img-wrap">
          <img src="/assets/images/project_amanahflow.jpg" alt="AmanahFlow Preview" class="modal-showcase-img" referrerPolicy="no-referrer" />
        </div>
      `
    }
  };

  let currentProjectKey = 'devflw';

  function openProjectCaseStudyModal(projectKey) {
    if (!projectModal) return;
    const project = projectDetailsData[projectKey] || projectDetailsData.devflw;
    currentProjectKey = projectKey;

    if (pmBadge) pmBadge.textContent = project.badge;
    if (pmStatusText) pmStatusText.textContent = project.status;
    if (pmYear) pmYear.textContent = project.year;
    if (pmTitle) pmTitle.textContent = project.title;
    if (pmTagline) pmTagline.textContent = project.tagline;
    if (pmDescription) pmDescription.textContent = project.description;
    if (pmMetricVal) pmMetricVal.textContent = project.metricVal;
    if (pmMetricLabel) pmMetricLabel.textContent = project.metricLabel;

    if (pmFeatures) {
      pmFeatures.innerHTML = project.features.map(f => `<li>${f}</li>`).join('');
    }

    if (pmTechStack) {
      pmTechStack.innerHTML = project.techStack.map(t => `<span class="tag-pill">${t}</span>`).join('');
    }

    if (pmShowcase) {
      pmShowcase.innerHTML = project.showcaseHtml;
    }

    projectModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openProjectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.project-card');
      const key = (card && card.getAttribute('data-project')) || btn.getAttribute('data-project') || 'devflw';
      openProjectCaseStudyModal(key);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = btn.closest('.project-card');
        const key = (card && card.getAttribute('data-project')) || btn.getAttribute('data-project') || 'devflw';
        openProjectCaseStudyModal(key);
      }
    });
  });

  if (projectModalCloseBtn) {
    projectModalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  if (pmInquireBtn) {
    pmInquireBtn.addEventListener('click', () => {
      closeProjectModal();
      const project = projectDetailsData[currentProjectKey];
      openContactModal(project ? project.inquirePrefill : '');
    });
  }

  if (pmSimulateBtn) {
    pmSimulateBtn.addEventListener('click', () => {
      closeProjectModal();
      const targetCard = document.querySelector(`.project-card[data-project="${currentProjectKey}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '2px solid #818cf8';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 2000);
      }
    });
  }

  // ==========================================================================
  // MY WORK: IN-CARD INTERACTIVE MOCKUPS SIMULATION
  // ==========================================================================

  // 1. DevFlw Mockup Simulation
  const devflwNavItems = document.querySelectorAll('.devflw-nav-item');
  const devflwTasks = document.querySelectorAll('.devflw-task-card.interactive-task');
  const devflwProgress = document.getElementById('devflwProgress');
  const devflwStatusBadge = document.getElementById('devflwStatusBadge');

  devflwNavItems.forEach(item => {
    item.addEventListener('click', () => {
      devflwNavItems.forEach(n => {
        n.style.background = 'none';
        n.style.color = '#94a3b8';
      });
      item.style.background = 'rgba(99, 102, 241, 0.2)';
      item.style.color = '#ffffff';
    });
  });

  let taskStateToggle = false;
  devflwTasks.forEach(task => {
    task.addEventListener('click', () => {
      taskStateToggle = !taskStateToggle;
      if (taskStateToggle) {
        task.style.borderLeft = '3px solid #10b981';
        if (devflwProgress) devflwProgress.style.width = '100%';
        if (devflwStatusBadge) {
          devflwStatusBadge.textContent = 'ALL DONE ✓';
          devflwStatusBadge.style.color = '#34d399';
          devflwStatusBadge.style.background = 'rgba(16, 185, 129, 0.2)';
        }
      } else {
        task.style.borderLeft = 'none';
        if (devflwProgress) devflwProgress.style.width = '75%';
        if (devflwStatusBadge) {
          devflwStatusBadge.textContent = 'IN PROGRESS';
          devflwStatusBadge.style.color = '#38bdf8';
          devflwStatusBadge.style.background = 'rgba(56, 189, 248, 0.15)';
        }
      }
    });
  });

  // 2. MultiTools Mockup Simulation
  const mtSearchInput = document.getElementById('mtSearchInput');
  const mtToolCards = document.querySelectorAll('.mt-tool-card.interactive-tool');
  const mtFeedback = document.getElementById('mtFeedback');
  const mtThemeToggle = document.getElementById('mtThemeToggle');
  const mockupMultiTools = document.getElementById('mockupMultiTools');

  if (mtSearchInput) {
    mtSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let matchCount = 0;
      mtToolCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (!query || text.includes(query)) {
          card.style.display = 'block';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });
      if (mtFeedback) {
        mtFeedback.textContent = query ? `Matching tools: ${matchCount}` : '⚡ Instant client-side execution';
      }
    });
  }

  mtToolCards.forEach(card => {
    card.addEventListener('click', () => {
      const toolName = card.querySelector('.mt-tool-name')?.textContent || 'Tool';
      if (mtFeedback) {
        mtFeedback.textContent = `✓ Executed "${toolName}" in 1.4ms!`;
        mtFeedback.style.color = '#10b981';
        setTimeout(() => {
          mtFeedback.textContent = '⚡ Instant client-side execution';
          mtFeedback.style.color = '#64748b';
        }, 1800);
      }
    });
  });

  if (mtThemeToggle && mockupMultiTools) {
    mtThemeToggle.addEventListener('click', () => {
      mockupMultiTools.classList.toggle('dark-mode');
    });
  }

  // 3. Dev Productivity Tracker Mockup Simulation
  const interactiveBars = document.querySelectorAll('.chart-bar.interactive-bar');
  const trackerActiveDay = document.getElementById('trackerActiveDay');

  interactiveBars.forEach(bar => {
    bar.addEventListener('click', () => {
      interactiveBars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');
      const day = bar.getAttribute('data-day') || 'Day';
      const hours = bar.getAttribute('data-hours') || '6.0';
      if (trackerActiveDay) {
        trackerActiveDay.textContent = `${day}: ${hours} hrs`;
      }
    });
  });

  // 4. AmanahFlow Mobile Mockup Simulation
  const afPayBtn = document.getElementById('afPayBtn');
  const phoneMembers = document.querySelectorAll('.phone-member-item');

  if (afPayBtn) {
    let paid = false;
    afPayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      paid = !paid;
      if (paid) {
        afPayBtn.innerHTML = '<span>✓ Paid &amp; Settled</span><span style="font-weight:700;">$0.00</span>';
        afPayBtn.style.background = '#10b981';
      } else {
        afPayBtn.innerHTML = '<span>Pay Maintenance</span><span style="font-weight:700;">$45.00 &rarr;</span>';
        afPayBtn.style.background = '#161e31';
      }
    });
  }

  phoneMembers.forEach(item => {
    item.addEventListener('click', () => {
      const badge = item.querySelector('.phone-tag');
      if (badge) {
        if (badge.textContent.includes('Paid')) {
          badge.textContent = 'Pending';
          badge.style.color = '#f59e0b';
          badge.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
          badge.textContent = '✓ Paid';
          badge.style.color = '#34d399';
          badge.style.background = 'rgba(16, 185, 129, 0.15)';
        }
      }
    });
  });

  // --- ESC key closes drawers and modals ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeContactModal();
      closeServiceModal();
      closeProjectModal();
    }
  });

  // --- Scroll-Reveal Observer ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('fade-in-up');
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // --- Smooth Header Transparency on Scroll ---
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.style.background = 'rgba(7, 9, 14, 0.95)';
      siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    } else {
      siteHeader.style.background = 'rgba(7, 9, 14, 0.82)';
      siteHeader.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
    }
  });
});
