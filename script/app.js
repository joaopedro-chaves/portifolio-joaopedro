const fileStatus = 'status.md';

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navList = document.querySelector('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    loadMarkdown();

    // --- Language Switch Logic ---
    const langSwitches = document.querySelectorAll('.lang-switch span:not(.divider)');
    
    // Check local storage or default to English
    let currentLang = localStorage.getItem('portfolio_lang') || 'en';
    changeLanguage(currentLang);

    langSwitches.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.textContent.trim().toLowerCase();
            if (selectedLang === 'br') {
                currentLang = 'br';
            } else {
                currentLang = 'en';
            }
            
            localStorage.setItem('portfolio_lang', currentLang);
            changeLanguage(currentLang);
        });
    });

    function changeLanguage(lang) {
        // Update active class on switcher
        langSwitches.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.trim().toLowerCase() === lang || (btn.textContent.trim() === 'EN' && lang === 'en')) {
                btn.classList.add('active');
            }
        });

        // Loop through all data-i18n attributes and translate
        const elementsToTranslate = document.querySelectorAll('[data-i18n]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // We use innerHTML here since some translations might include span tags
                element.innerHTML = translations[lang][key];
            }
        });
    }
});

async function loadMarkdown() {
    const container = document.getElementById('markdown-content');
    const filePath = 'media/status.md'; // path to markdown file

    try {
        const response = await fetch(filePath);
            
        if (!response.ok) {
            throw new Error('Failed to load markdown file');
        }

        const markdownText = await response.text();

        container.innerHTML = marked.parse(markdownText);

    } catch (error) {
        container.innerHTML = `
            <div class="bg-red-50 p-4 rounded border border-red-200 text-red-700 text-center">
                <p class="font-bold">Error loading markdown file</p>
                <p class="text-sm">${error.message}</p>
                <p class="mt-2 text-xs text-gray-500">(Note: To test locally, you need a local server due to browser CORS policies)</p>
            </div>
        `;
    }
}