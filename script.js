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
    const copyCodeElement = document.getElementById('copyCode');
    
    if (friendCodeElement) {
        friendCodeElement.textContent = friendCode;
    }
    
    if (copyCodeElement) {
        copyCodeElement.textContent = friendCode;
    }
    
    console.log('Friend code detected:', friendCode);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Copied to clipboard:', text);
            // Optional: Show brief visual feedback
            if (event && event.target) {
                const originalText = event.target.innerHTML;
                event.target.innerHTML = '✓ Copied!';
                setTimeout(() => {
                    event.target.innerHTML = originalText;
                }, 1000);
            }
        })
        .catch(err => {
            console.error('Copy failed:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
}

// Setup main invitation button
function setupInviteButton() {
    const inviteBtn = document.getElementById('inviteBtn');
    if (!inviteBtn) return;
    
    inviteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const friendCode = getFriendCodeFromURL();
        const clipboardText = `8EggsFriendCode:${friendCode}`;
        
        // Copy to clipboard
        copyToClipboard(clipboardText);
        
        // Try to open app first
        window.location.href = `eighteggs://invite?friend_code=${friendCode}`;
        
        // If app doesn't open, fallback to Play Store after 500ms
        setTimeout(() => {
            if (document.hasFocus()) {
                // Still in browser, redirect to Play Store
                window.location.href = 'https://play.google.com/store/apps/details?id=com.eighteggs.eighteggs';
            }
        }, 500);
    });
}

// Setup manual copy button
function setupManualCopy() {
    const copyBtn = document.getElementById('copyBtn');
    const copyCodeElement = document.getElementById('copyCode');
    
    if (!copyBtn || !copyCodeElement) return;
    
    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const friendCode = copyCodeElement.textContent;
        const clipboardText = `8EggsFriendCode:${friendCode}`;
        copyToClipboard(clipboardText);
    });
}

// Remove all app detection and complex logic
// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateFriendCode();
    setupInviteButton();
    setupManualCopy();
    
    // Set page title with friend code
    const friendCode = getFriendCodeFromURL();
    document.title = `🎮 Join 8 Eggs - Invite from ${friendCode}`;
});
