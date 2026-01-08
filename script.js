// Get friend code from URL
function getFriendCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let friendCode = urlParams.get('friend_code') || 
                    urlParams.get('ref') || 
                    urlParams.get('code') || 
                    'ABC123';
    
    // Clean the code (remove special characters)
    friendCode = friendCode.replace(/[^a-zA-Z0-9]/g, '');
    
    return friendCode || 'FRIEND123';
}

// Update page with friend code
function updateFriendCode() {
    const friendCode = getFriendCodeFromURL();
    const friendCodeElement = document.getElementById('friendCode');
    
    if (friendCodeElement) {
        friendCodeElement.textContent = friendCode;
        friendCodeElement.style.color = '#667eea';
    }
    
    // Store in localStorage for app to read
    localStorage.setItem('8eggs_friend_code', friendCode);
    
    // Update the Open Game link
    const openBtn = document.getElementById('openBtn');
    if (openBtn) {
        openBtn.href = `eighteggs://invite?friend_code=${friendCode}`;
    }
    
    console.log('Friend code detected:', friendCode);
}

// Track install click
function setupTracking() {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', function() {
            const friendCode = getFriendCodeFromURL();
            
            // Send to analytics (you can replace with your own)
            console.log('Install clicked with friend code:', friendCode);
            
            // Store in sessionStorage to detect after install
            sessionStorage.setItem('pending_install', friendCode);
            
            // Redirect to Play Store after a brief delay for tracking
            setTimeout(() => {
                window.location.href = installBtn.href;
            }, 300);
        });
    }
    
    // Check if coming from install redirect
    const pendingInstall = sessionStorage.getItem('pending_install');
    if (pendingInstall) {
        console.log('Returning from install with code:', pendingInstall);
        sessionStorage.removeItem('pending_install');
    }
}

// Check if app is installed (for better UX)
function checkAppInstalled() {
    const openBtn = document.getElementById('openBtn');
    
    // Try to open the app
    window.location = 'eighteggs://test';
    
    // If we're still here after 500ms, app is not installed
    setTimeout(() => {
        if (document.hasFocus()) {
            // App not installed - hide or disable open button
            if (openBtn) {
                openBtn.style.opacity = '0.5';
                openBtn.style.cursor = 'not-allowed';
                openBtn.onclick = (e) => {
                    e.preventDefault();
                    alert('Please install 8 Eggs first!');
                };
            }
        }
    }, 500);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateFriendCode();
    setupTracking();
    
    // Only check app install on mobile
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        checkAppInstalled();
    }
    
    // Set page title with friend code
    const friendCode = getFriendCodeFromURL();
    document.title = `🎮 Join 8 Eggs - Invite from ${friendCode}`;
});
