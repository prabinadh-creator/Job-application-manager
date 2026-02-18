// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log('Job Application Manager extension installed!');
    
    // Initialize storage
    chrome.storage.local.get(['applications'], (result) => {
        if (!result.applications) {
            chrome.storage.local.set({ applications: [] });
        }
    });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveApplication') {
        chrome.storage.local.get('applications', (result) => {
            const applications = result.applications || [];
            applications.push(request.data);
            chrome.storage.local.set({ applications });
            sendResponse({ success: true });
        });
    }
});
