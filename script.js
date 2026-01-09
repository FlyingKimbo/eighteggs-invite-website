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

// Custom alert functions
function showCustomAlert(message) {
    const alertBox = document.getElementById('customAlert');
    const messageElement = alertBox.querySelector('p');
    messageElement.textContent = message;
    alertBox.style.display = 'flex';
}

function hideCustomAlert() {
    const alertBox = document.getElementById('customAlert');
    alertBox.style.display = 'none';
}

// Replace the setupTracking() function with this:
function setupTracking() {
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent immediate redirect
            
            const friendCode = getFriendCodeFromURL();
            console.log('Install clicked with friend code:', friendCode);
            
            // 1. COPY TO CLIPBOARD
            const clipboardText = `friend_code=${friendCode}`;
            navigator.clipboard.writeText(clipboardText)
                .then(() => {
                    console.log('Friend code copied to clipboard:', clipboardText);
                    
                    // 2. Show success message
                    // showCustomAlert('Friend code copied! After installing, open the app to automatically apply it.');
                    
                    // 3. Redirect to Play Store after delay
                    setTimeout(() => {
                        window.location.href = installBtn.href;
                    }, 500);
                })
                .catch(err => {
                    console.error('Failed to copy to clipboard:', err);
                    
                    // Fallback: Store in localStorage
                    localStorage.setItem('8eggs_friend_code', friendCode);
                    alert('Friend code saved! Install the app then open it.');
                    
                    // Redirect anyway
                    setTimeout(() => {
                        window.location.href = installBtn.href;
                    }, 500);
                });
        });
    }
}

function setupAppDetection() {
    const openBtn = document.getElementById('openBtn');
    if (!openBtn) return;
    
    // Only for mobile devices
    if (!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return;
    }
    
    openBtn.addEventListener('click', function(e) {
        console.log('Open Game button clicked on mobile');
        
        // Store original link
        const originalHref = openBtn.href;
        let appOpened = false;
        
        // Create an invisible iframe to test the deep link
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'eighteggs://test';
        
        // Add to page
        document.body.appendChild(iframe);
        
        // Set a timeout to check if app opened - CHANGED TO 2500ms
        setTimeout(function() {
            // If we get here, the iframe loaded (app didn't intercept)
            console.log('App likely NOT installed');
            
            // Show alert
            showCustomAlert('Please install 8Eggs first!');
            
            // Change button to go to Play Store
            openBtn.href = 'https://play.google.com/store/apps/details?id=com.eighteggs.eighteggs';
            
            // After 3 seconds, restore original link
            setTimeout(function() {
                openBtn.href = originalHref;
                console.log('Original link restored');
            }, 3000);
            
            // Remove iframe
            document.body.removeChild(iframe);
            
        }, 2500); // CHANGED FROM 800ms TO 2500ms
    });
}
// Check if app is installed (for better UX) - MODIFIED VERSION
function checkAppInstalled() {
    const openBtn = document.getElementById('openBtn');
    
    // REMOVED the automatic app launch on page load
    // window.location = 'eighteggs://test'; // <-- This line caused the pop-up
    
    // If we're on mobile, attach a click handler to detect if app opens
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && openBtn) {
        openBtn.addEventListener('click', function(e) {
            // Store the original href in case we need to restore it
            const originalHref = openBtn.href;
            
            // Set a flag to check if app opened
            let appOpened = false;
            
            // Try to open the app
            window.location.href = 'eighteggs://test';
            
            // If still in browser after 500ms, app didn't open
            setTimeout(() => {
                if (!appOpened && document.hasFocus()) {
                    
                    
                    // Show message and redirect to install page
                    showCustomAlert('Please install 8 Eggs first!');
                    openBtn.href = 'https://play.google.com/store/apps/details?id=com.eighteggs.eighteggs';
                    
                    // Optional: Restore original href after a delay
                    setTimeout(() => {
                        openBtn.href = originalHref;
                    }, 3000);
                }
            }, 500);
            
            // Reset flag after a short time
            setTimeout(() => {
                appOpened = true;
            }, 100);
        });
    }
}


// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateFriendCode();
    setupTracking();
    setupAppDetection()
   
    // Set page title with friend code
    const friendCode = getFriendCodeFromURL();
    document.title = `🎮 Join 8 Eggs - Invite from ${friendCode}`;
});










