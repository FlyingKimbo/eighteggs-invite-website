// Get friend code from URL
function getFriendCodeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    let friendCode = urlParams.get('friend_code') || 
                    urlParams.get('ref') || 
                    urlParams.get('code') || 
                    'ABC123DEF4567890'; // Default 16-char hex
    
    // Clean the code (remove special characters, keep only hex chars)
    friendCode = friendCode.replace(/[^a-fA-F0-9]/g, '');
    
    // Ensure 16 characters (pad or truncate)
    if (friendCode.length > 16) {
        friendCode = friendCode.substring(0, 16);
    } else if (friendCode.length < 16) {
        // Pad with zeros if too short
        friendCode = friendCode.padEnd(16, '0');
    }
    
    return friendCode.toUpperCase(); // Return in uppercase for consistency
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
            const event = window.event;
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

// Setup main invitation button - ALWAYS GOES TO PLAY STORE
function setupInviteButton() {
    const inviteBtn = document.getElementById('inviteBtn');
    if (!inviteBtn) return;
    
    inviteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const friendCode = getFriendCodeFromURL();
        const clipboardText = friendCode; // ONLY the 16-char code, NO prefix!
        
        // 1. Copy to clipboard
        copyToClipboard(clipboardText);
        
        // 2. Always go to Play Store
        window.location.href = 'https://play.google.com/store/apps/details?id=com.eighteggs.eighteggs';
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
        const clipboardText = friendCode; // ONLY the 16-char code, NO prefix!
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
