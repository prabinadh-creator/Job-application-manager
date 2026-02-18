// Detect jobs on the page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'detectJob') {
        const job = extractJobFromPage();
        sendResponse({ job: job });
    }
});

// Extract job information from page
function extractJobFromPage() {
    const url = window.location.href;
    
    // LinkedIn
    if (url.includes('linkedin.com')) {
        return extractLinkedInJob();
    }
    
    // Seek
    if (url.includes('seek.com.au')) {
        return extractSeekJob();
    }
    
    // Jora
    if (url.includes('jora.com.au')) {
        return extractJoraJob();
    }
    
    // Indeed
    if (url.includes('indeed.com')) {
        return extractIndeedJob();
    }
    
    // Generic fallback
    return extractGenericJob();
}

// LinkedIn Job Extraction
function extractLinkedInJob() {
    const jobTitle = document.querySelector('[data-tracking-control-name*="show_details"] h2')?.textContent ||
                     document.querySelector('.show-more-less-html__markup')?.closest('[class*="top"]')?.querySelector('h2')?.textContent ||
                     document.querySelector('.top-card-layout h2')?.textContent || '';
    
    const company = document.querySelector('.top-card-layout__company a')?.textContent ||
                    document.querySelector('[data-test-link="company-name"]')?.textContent || '';
    
    const location = document.querySelector('.top-card-layout__location')?.textContent ||
                     document.querySelector('[data-test-link="job-details-location"]')?.textContent || '';
    
    const description = document.querySelector('.show-more-less-html__markup')?.textContent ||
                       document.querySelector('[data-test-id="job-details"]')?.textContent || '';
    
    return {
        title: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        description: description.trim(),
        url: window.location.href,
        salary: extractSalary(description)
    };
}

// Seek Job Extraction
function extractSeekJob() {
    const jobTitle = document.querySelector('h1[data-testid="job-title"]')?.textContent ||
                     document.querySelector('h1')?.textContent || '';
    
    const company = document.querySelector('[data-testid="company-name"]')?.textContent ||
                    document.querySelector('a[data-testid="hero-company-link"]')?.textContent || '';
    
    const location = document.querySelector('[data-testid="job-detail-location"]')?.textContent ||
                     document.querySelector('[class*="location"]')?.textContent || '';
    
    const salary = document.querySelector('[data-testid="job-detail-salary"]')?.textContent ||
                   document.querySelector('[class*="salary"]')?.textContent || '';
    
    const description = document.querySelector('[data-testid="job-detail-description"]')?.textContent ||
                       document.querySelector('[class*="description"]')?.textContent || '';
    
    return {
        title: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary.trim(),
        description: description.trim(),
        url: window.location.href
    };
}

// Jora Job Extraction
function extractJoraJob() {
    const jobTitle = document.querySelector('h1')?.textContent || '';
    const company = document.querySelector('[class*="company"]')?.textContent ||
                    document.querySelector('a[href*="employer"]')?.textContent || '';
    const location = document.querySelector('[class*="location"]')?.textContent || '';
    const salary = document.querySelector('[class*="salary"]')?.textContent || '';
    const description = document.querySelector('[class*="job-description"]')?.textContent ||
                       document.body.innerText.substring(0, 2000) || '';
    
    return {
        title: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary.trim(),
        description: description.trim(),
        url: window.location.href
    };
}

// Indeed Job Extraction
function extractIndeedJob() {
    const jobTitle = document.querySelector('[class*="jobsearch-JobTitle"]')?.textContent ||
                     document.querySelector('h1')?.textContent || '';
    
    const company = document.querySelector('[class*="company"]')?.textContent ||
                    document.querySelector('[data-company-name]')?.getAttribute('data-company-name') || '';
    
    const location = document.querySelector('[class*="location"]')?.textContent || '';
    const salary = document.querySelector('[class*="salary"]')?.textContent || '';
    const description = document.querySelector('[id="jobDescriptionText"]')?.textContent ||
                       document.querySelector('[class*="job-description"]')?.textContent || '';
    
    return {
        title: jobTitle.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: salary.trim(),
        description: description.trim(),
        url: window.location.href
    };
}

// Generic Job Extraction (Fallback)
function extractGenericJob() {
    const pageText = document.body.innerText;
    const headings = document.querySelectorAll('h1, h2');
    
    let jobTitle = '';
    if (headings.length > 0) {
        jobTitle = headings[0].textContent.trim();
    }
    
    const companyMatches = pageText.match(/(?:company|employer|organization):\s*(.+?)(?:\n|$)/i);
    const company = companyMatches ? companyMatches[1].trim() : '';
    
    const locationMatches = pageText.match(/(?:location|based in|located in):\s*(.+?)(?:\n|$)/i);
    const location = locationMatches ? locationMatches[1].trim() : '';
    
    const salaryMatches = pageText.match(/(?:\$[\d,]+(?:\s*-\s*\$[\d,]+)?|[\d,]+\s*per\s*year)/i);
    const salary = salaryMatches ? salaryMatches[0].trim() : '';
    
    return {
        title: jobTitle,
        company: company,
        location: location,
        salary: salary,
        description: pageText.substring(0, 2000),
        url: window.location.href
    };
}

// Extract Salary Helper
function extractSalary(text) {
    const match = text.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?|[\d,]+\s*per\s*year/i);
    return match ? match[0] : '';
}

// Inject visual indicators on page
function injectJobHighlights() {
    const style = document.createElement('style');
    style.textContent = `
        .job-app-manager-highlight {
            border-left: 4px solid #667eea !important;
            background: rgba(102, 126, 234, 0.05) !important;
            padding-left: 12px !important;
        }
        
        .job-save-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 0.5rem;
            font-size: 0.9rem;
        }
        
        .job-save-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
    `;
    document.head.appendChild(style);
}

injectJobHighlights();
