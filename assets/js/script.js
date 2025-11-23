// Profile data will be loaded from config.json or fallback to embedded config
let profileData = {};

// Fallback configuration in case config.json can't be loaded (for local development)
const fallbackConfig = {
  "personal": {
    "name": "Your Name",
    "title": "Software Developer", 
    "tagline": "Passionate about creating amazing digital experiences",
    "bio": "I'm a dedicated software developer with expertise in modern web technologies. I love solving complex problems and building user-friendly applications that make a difference.",
    "profilePhoto": "img/profile.jpg",
    "location": "Your City, Country",
    "email": "your.email@example.com"
  },
  "social": {
    "github": "https://github.com/vimaleshbe",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "twitter": "https://twitter.com/yourhandle",
    "website": "https://yourwebsite.com",
    "instagram": "https://instagram.com/yourhandle"
  },
  "skills": [
    {
      "category": "Frontend",
      "technologies": ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "TypeScript"]
    },
    {
      "category": "Backend", 
      "technologies": ["Node.js", "Python", "Java", "Express.js", "Django"]
    },
    {
      "category": "Database",
      "technologies": ["MongoDB", "PostgreSQL", "MySQL", "Redis"]
    },
    {
      "category": "Tools & Others",
      "technologies": ["Git", "Docker", "AWS", "Linux", "REST APIs"]
    }
  ],
  "projects": [
    {
      "name": "Project One",
      "description": "A full-stack web application built with React and Node.js",
      "technologies": ["React", "Node.js", "MongoDB"],
      "github": "https://github.com/vimaleshbe/project-one",
      "live": "https://project-one-demo.com",
      "image": "img/project1.jpg"
    },
    {
      "name": "Project Two", 
      "description": "Mobile-first responsive website with modern UI/UX",
      "technologies": ["HTML5", "CSS3", "JavaScript"],
      "github": "https://github.com/vimaleshbe/project-two",
      "live": "https://project-two-demo.com", 
      "image": "img/project2.jpg"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Software Developer",
      "duration": "2023 - Present",
      "description": "Developing and maintaining web applications using modern technologies."
    },
    {
      "company": "Previous Company",
      "position": "Junior Developer", 
      "duration": "2021 - 2023",
      "description": "Worked on frontend development and API integration."
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Computer Science",
      "institution": "University Name",
      "year": "2021",
      "description": "Graduated with honors, specialized in software engineering."
    }
  ],
  "certifications": [
    {
      "name": "Sample Certification",
      "issuer": "Sample Organization",
      "date": "2024",
      "credentialId": "SAMPLE-123456",
      "verificationUrl": "https://example.com/verify",
      "description": "This is a sample certification for demonstration purposes."
    }
  ],
  "theme": {
    "primaryColor": "#2563eb",
    "secondaryColor": "#1e40af", 
    "accentColor": "#f59e0b",
    "backgroundColor": "#f8fafc",
    "textColor": "#1f2937"
  }
};

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    initializeNavigation();
});

// Load profile data from JSON
async function loadProfileData() {
    console.log('🚀 Starting to load profile data...');
    
    try {
        // Try to load from config.json first
        const response = await fetch('config.json');
        if (response.ok) {
            profileData = await response.json();
            console.log('✅ Loaded data from config.json');
        } else {
            throw new Error('Could not load config.json');
        }
    } catch (error) {
        console.warn('⚠️ Could not load config.json, using fallback configuration:', error.message);
        console.log('💡 This is normal when opening the HTML file directly in browser.');
        console.log('📝 To use config.json, either:');
        console.log('   1. Serve the files through a web server (e.g., Live Server in VS Code)');
        console.log('   2. Upload to GitHub Pages');
        console.log('   3. Edit the fallbackConfig in script.js directly');
        
        // Use fallback configuration
        profileData = fallbackConfig;
        console.log('✅ Using fallback configuration');
    }
    
    // Validate profileData
    if (!profileData || !profileData.personal) {
        console.error('❌ Profile data is invalid:', profileData);
        showError('Profile data is missing or invalid. Using emergency defaults.');
        
        // Emergency fallback
        profileData = {
            personal: { 
                name: "Your Name", 
                title: "Developer", 
                tagline: "Welcome to my profile",
                bio: "Please update your profile configuration.",
                profilePhoto: "img/profile.jpg",
                location: "Your Location",
                email: "your.email@example.com",
                phone: "Your Phone"
            },
            social: { github: "#", linkedin: "#" },
            skills: [{ category: "Skills", technologies: ["Update", "Your", "Skills"] }],
            projects: [],
            experience: [],
            education: [],
            theme: {
                primaryColor: "#2563eb",
                secondaryColor: "#1e40af",
                accentColor: "#f59e0b", 
                backgroundColor: "#f8fafc",
                textColor: "#1f2937"
            }
        };
    }
    
    try {
        console.log('📝 Starting to populate sections...');
        
        // Apply theme colors
        applyTheme(profileData.theme);
        console.log('✅ Applied theme');
        
        // Populate all sections
        populateHeroSection();
        console.log('✅ Populated hero section');
        
        populateAboutSection();
        console.log('✅ Populated about section');
        
        populateSkillsSection();
        console.log('✅ Populated skills section');
        
        populateCertificationsSection();
        console.log('✅ Populated certifications section');
        
        populateExperienceSection();
        console.log('✅ Populated experience section');
        
        populateContactSection();
        console.log('✅ Populated contact section');
        
        populateNavigation();
        console.log('✅ Populated navigation');
        
        // Hide loading spinner
        hideLoading();
        
        console.log('🎉 Profile page loaded successfully!');
        
    } catch (error) {
        console.error('❌ Error populating profile data:', error);
        hideLoading();
        showError(`Failed to display profile data. Error: ${error.message}`);
    }
}

// Apply theme colors
function applyTheme(theme) {
    if (theme) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);
        root.style.setProperty('--accent-color', theme.accentColor);
        root.style.setProperty('--bg-color', theme.backgroundColor);
        root.style.setProperty('--text-color', theme.textColor);
    }
}

// Populate Hero Section
function populateHeroSection() {
    const { personal, social } = profileData;
    
    if (!personal) {
        console.error('❌ Personal data is missing');
        return;
    }
    
    // Set page title
    document.getElementById('page-title').textContent = `${personal.name || 'Profile'} - ${personal.title || 'Portfolio'}`;
    
    // Hero content
    const profilePhoto = document.getElementById('profile-photo');
    if (profilePhoto) {
        profilePhoto.src = personal.profilePhoto || 'img/profile.jpg';
        profilePhoto.alt = `${personal.name || 'Profile'} - Profile Photo`;
        
        console.log(`📸 Setting profile photo src to: ${profilePhoto.src}`);
        
        // Add error handling for profile photo
        profilePhoto.onerror = function() {
            console.warn('❌ Profile photo failed to load, showing placeholder');
            this.style.display = 'none';
            this.parentElement.innerHTML = '<div class="profile-placeholder"><i class="fas fa-user"></i></div>';
        };
        
        // Add success handler to confirm loading
        profilePhoto.onload = function() {
            console.log('✅ Profile photo loaded successfully');
        };
        
        // Force reload if src is already set but image not visible
        if (profilePhoto.complete && profilePhoto.naturalHeight === 0) {
            console.log('🔄 Forcing profile photo reload');
            profilePhoto.src = profilePhoto.src + '?t=' + Date.now();
        }
    }
    
    const heroName = document.getElementById('hero-name');
    if (heroName) heroName.textContent = personal.name || 'Your Name';
    
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = personal.title || 'Your Title';
    
    const heroTagline = document.getElementById('hero-tagline');
    if (heroTagline) heroTagline.textContent = personal.tagline || 'Your tagline here';
    // Social links
    const socialLinksContainer = document.getElementById('social-links');
    if (socialLinksContainer) {
        socialLinksContainer.innerHTML = '';
        
        if (social && typeof social === 'object') {
            Object.entries(social).forEach(([platform, url]) => {
                if (url && url !== '#') {
                    const link = document.createElement('a');
                    link.href = url;
                    link.className = 'social-link';
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.innerHTML = `<i class="fab fa-${platform}"></i>`;
                    socialLinksContainer.appendChild(link);
                }
            });
        }
    }
}

// Populate About Section
function populateAboutSection() {
    const { personal } = profileData;
    
    const bioText = document.getElementById('bio-text');
    if (bioText) bioText.textContent = personal.bio || 'Bio information will be added soon.';
    
    const locationText = document.getElementById('location-text');
    if (locationText) locationText.textContent = personal.location || 'Location not specified';
    
    const emailText = document.getElementById('email-text');
    if (emailText) emailText.textContent = personal.email || 'Email not provided';
}

// Populate Skills Section
function populateSkillsSection() {
    const { skills } = profileData;
    const container = document.getElementById('skills-container');
    container.innerHTML = '';
    
    skills.forEach(skillCategory => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        
        const title = document.createElement('h3');
        title.textContent = skillCategory.category;
        
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'skill-tags';
        
        skillCategory.technologies.forEach(tech => {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.textContent = tech;
            tagsDiv.appendChild(tag);
        });
        
        categoryDiv.appendChild(title);
        categoryDiv.appendChild(tagsDiv);
        container.appendChild(categoryDiv);
    });
}

// Populate Projects Section
function populateProjectsSection() {
    const { projects } = profileData;
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    
    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project-card';
        
        projectDiv.innerHTML = `
            <div class="project-image">
                ${project.image ? 
                    `<img src="${project.image}" alt="${project.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-code\\'></i>';">` : 
                    `<i class="fas fa-code"></i>`
                }
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fab fa-github"></i> Code</a>` : ''}
                    ${project.live ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                </div>
            </div>
        `;
        
        container.appendChild(projectDiv);
    });
}

// Populate Certifications Section
function populateCertificationsSection() {
    const { certifications } = profileData;
    const container = document.getElementById('certifications-container');
    
    if (!container) {
        console.warn('⚠️ Certifications container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (!certifications || certifications.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No certifications available at the moment.</p>';
        return;
    }
    
    certifications.forEach(cert => {
        const certDiv = document.createElement('div');
        certDiv.className = 'certification-card';
        
        certDiv.innerHTML = `
            <div class="certification-header">
                <div class="certification-icon">
                    <i class="fas fa-certificate"></i>
                </div>
                <div class="certification-info">
                    <h3 class="certification-name">${cert.name}</h3>
                    <div class="certification-issuer">${cert.issuer}</div>
                    <div class="certification-date">${cert.date}</div>
                </div>
            </div>
            <div class="certification-description">${cert.description}</div>
            ${cert.credentialId ? `<div class="certification-credential">Credential ID: <strong>${cert.credentialId}</strong></div>` : ''}
            ${cert.verificationUrl ? `
                <a href="${cert.verificationUrl}" target="_blank" rel="noopener noreferrer" class="certification-verify">
                    <i class="fas fa-external-link-alt"></i>
                    Verify Certificate
                </a>
            ` : ''}
        `;
        
        container.appendChild(certDiv);
    });
}

// Populate Experience Section
function populateExperienceSection() {
    const { experience } = profileData;
    const container = document.getElementById('experience-container');
    container.innerHTML = '';
    
    experience.forEach(exp => {
        const expDiv = document.createElement('div');
        expDiv.className = 'timeline-item';
        
        expDiv.innerHTML = `
            <div class="timeline-header">
                <div>
                    <div class="timeline-title">${exp.position}</div>
                    <div class="timeline-company">${exp.company}</div>
                </div>
                <div class="timeline-duration">${exp.duration}</div>
            </div>
            <div class="timeline-description">${exp.description}</div>
        `;
        
        container.appendChild(expDiv);
    });
}

// Populate Contact Section
function populateContactSection() {
    const { personal, social } = profileData;
    
    // Update contact links
    const emailLink = document.getElementById('contact-email');
    emailLink.href = `mailto:${personal.email}`;
    
    const linkedinLink = document.getElementById('contact-linkedin');
    linkedinLink.href = social.linkedin;
    
    const githubLink = document.getElementById('contact-github');
    githubLink.href = social.github;
    
    // Update footer name
    document.getElementById('footer-name').textContent = personal.name;
}

// Populate Navigation
function populateNavigation() {
    const { personal } = profileData;
    document.getElementById('nav-name').textContent = personal.name;
}

// Initialize Navigation
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active navigation link on scroll
    window.addEventListener('scroll', highlightActiveNavLink);
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Hide loading spinner
function hideLoading() {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
    setTimeout(() => {
        loading.style.display = 'none';
    }, 300);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fef3c7;
        color: #d97706;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        text-align: center;
        max-width: 90%;
        border: 1px solid #f59e0b;
    `;
    errorDiv.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: #92400e;">⚠️ Loading Issue</h3>
        <p style="margin-bottom: 1rem;">${message}</p>
        <div style="font-size: 0.9rem; color: #78350f; line-height: 1.6;">
            <p><strong>💡 Quick Fix:</strong></p>
            <p>• Use Live Server extension in VS Code, or</p>
            <p>• Edit the fallbackConfig in assets/js/script.js</p>
        </div>
        <button onclick="location.reload()" style="
            margin-top: 1rem;
            background-color: #d97706;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
        ">Retry</button>
    `;
    document.body.appendChild(errorDiv);
}

// Intersection Observer for animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation classes when page loads
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Form validation and enhancement (if contact form is added later)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Utility function to handle image loading errors
function handleImageError(img, fallbackIcon = 'fas fa-image') {
    img.style.display = 'none';
    const parent = img.parentElement;
    parent.innerHTML = `<i class="${fallbackIcon}"></i>`;
    parent.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.justifyContent = 'center';
    parent.style.fontSize = '2rem';
    parent.style.color = '#9ca3af';
}