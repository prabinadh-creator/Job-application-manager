// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        document.getElementById(tabName).classList.add('active');
        btn.classList.add('active');
        
        if (tabName === 'applications') {
            loadApplicationsList();
        }
    });
});

// Detect Job Button
document.getElementById('detectBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'detectJob' }, (response) => {
            if (response && response.job) {
                populateDetectedJob(response.job);
                document.getElementById('detectedJobInfo').style.display = 'block';
            } else {
                showMessage('No job found on this page. Try manual entry.', 'error');
            }
        });
    });
});

// Manual Entry Button
document.getElementById('manualEntryBtn').addEventListener('click', () => {
    document.getElementById('manualEntryForm').style.display = 
        document.getElementById('manualEntryForm').style.display === 'none' ? 'block' : 'none';
});

// Populate detected job
function populateDetectedJob(job) {
    document.getElementById('detectedJobTitle').value = job.title || '';
    document.getElementById('detectedCompany').value = job.company || '';
    document.getElementById('detectedLocation').value = job.location || '';
    document.getElementById('detectedSalary').value = job.salary || '';
    document.getElementById('detectedJobUrl').value = job.url || '';
    document.getElementById('detectedDescription').value = job.description || '';
}

// Generate Cover Letter (Detected)
document.getElementById('generateCoverBtn')?.addEventListener('click', () => {
    const jobTitle = document.getElementById('detectedJobTitle').value;
    const company = document.getElementById('detectedCompany').value;
    const description = document.getElementById('detectedDescription').value;
    
    if (!jobTitle || !company) {
        showMessage('Please fill in Job Title and Company', 'error');
        return;
    }
    
    const coverLetter = generateCoverLetterText(jobTitle, company, description);
    document.getElementById('coverLetterText').value = coverLetter;
    document.getElementById('generatedCoverLetter').style.display = 'block';
});

// Generate Cover Letter (Manual)
document.getElementById('generateCoverBtn2')?.addEventListener('click', () => {
    const jobTitle = document.getElementById('manualJobTitle').value;
    const company = document.getElementById('manualCompany').value;
    const description = document.getElementById('manualDescription').value;
    
    if (!jobTitle || !company) {
        showMessage('Please fill in Job Title and Company', 'error');
        return;
    }
    
    const coverLetter = generateCoverLetterText(jobTitle, company, description);
    document.getElementById('manualCoverLetterText').value = coverLetter;
    document.getElementById('manualGeneratedCover').style.display = 'block';
});

// Generate Cover Letter Text
function generateCoverLetterText(jobTitle, company, description) {
    const keywords = description.match(/\b\w{5,}\b/g) || [];
    const uniqueKeywords = [...new Set(keywords)].slice(0, 3).join(', ');
    
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background and passion for delivering excellent results, I am confident in my ability to contribute meaningfully to your team.

Your job posting caught my attention, particularly your emphasis on ${uniqueKeywords || 'innovation and excellence'}. My experience aligns well with these values and your requirements.

I am excited about the opportunity to bring my skills and enthusiasm to ${company}. I am confident that my qualifications make me an ideal candidate for this role.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team's success.

Best regards,
[Your Name]`;
}

// Save Application
document.getElementById('saveAppBtn').addEventListener('click', () => {
    let jobData = {
        jobTitle: document.getElementById('detectedJobTitle')?.value || document.getElementById('manualJobTitle')?.value,
        company: document.getElementById('detectedCompany')?.value || document.getElementById('manualCompany')?.value,
        location: document.getElementById('detectedLocation')?.value || document.getElementById('manualLocation')?.value,
        salary: document.getElementById('detectedSalary')?.value || document.getElementById('manualSalary')?.value,
        jobUrl: document.getElementById('detectedJobUrl')?.value || document.getElementById('manualJobUrl')?.value,
        description: document.getElementById('detectedDescription')?.value || document.getElementById('manualDescription')?.value,
        coverLetter: document.getElementById('coverLetterText')?.value || document.getElementById('manualCoverLetterText')?.value,
        status: 'draft',
        createdAt: new Date().toISOString(),
        sourceUrl: window.location.href
    };
    
    if (!jobData.jobTitle || !jobData.company) {
        showMessage('Please fill in Job Title and Company', 'error');
        return;
    }
    
    chrome.storage.local.get('applications', (result) => {
        const applications = result.applications || [];
        applications.push(jobData);
        chrome.storage.local.set({ applications }, () => {
            showMessage('✓ Application saved successfully!', 'success');
            setTimeout(() => {
                document.getElementById('detectedJobInfo').style.display = 'none';
                document.getElementById('generatedCoverLetter').style.display = 'none';
                document.getElementById('manualEntryForm').style.display = 'none';
                document.getElementById('manualGeneratedCover').style.display = 'none';
                document.querySelectorAll('input[type="text"], input[type="url"], textarea').forEach(el => el.value = '');
            }, 1500);
        });
    });
});

// Load Applications List
function loadApplicationsList() {
    chrome.storage.local.get('applications', (result) => {
        const applications = result.applications || [];
        const appsList = document.getElementById('appsList');
        
        if (applications.length === 0) {
            appsList.innerHTML = '<div class="empty-state"><p>📭 No applications yet</p></div>';
            return;
        }
        
        appsList.innerHTML = applications.map((app, idx) => `
            <div class="app-item">
                <h4>${app.jobTitle}</h4>
                <p><strong>${app.company}</strong></p>
                ${app.location ? `<p>📍 ${app.location}</p>` : ''}
                ${app.salary ? `<p>💰 ${app.salary}</p>` : ''}
                <span class="status ${app.status}">${app.status.toUpperCase()}</span>
                <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                    <button onclick="deleteApplication(${idx})" style="flex: 1; padding: 0.5rem; background: #fee2e2; color: #dc2626; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">Delete</button>
                </div>
            </div>
        `).join('');
    });
}

// Delete Application
window.deleteApplication = (idx) => {
    if (!confirm('Delete this application?')) return;
    
    chrome.storage.local.get('applications', (result) => {
        const applications = result.applications || [];
        applications.splice(idx, 1);
        chrome.storage.local.set({ applications }, () => {
            loadApplicationsList();
        });
    });
};

// Export Data
document.getElementById('exportBtn').addEventListener('click', () => {
    chrome.storage.local.get('applications', (result) => {
        const applications = result.applications || [];
        const dataStr = JSON.stringify(applications, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    });
});

// Clear Data
document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (!confirm('Are you sure? This will delete ALL applications.')) return;
    chrome.storage.local.clear(() => {
        showMessage('✓ All data cleared!', 'success');
        loadApplicationsList();
    });
});

// Show Message
function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = type;
    setTimeout(() => {
        msg.className = '';
    }, 3000);
}
