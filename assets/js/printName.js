document.addEventListener('DOMContentLoaded', function() {
    const userNameSpan = document.getElementById('user-name');
    const savedName = localStorage.getItem('smartWalletUser');

    
    if (savedName && userNameSpan) {
        userNameSpan.textContent = savedName;
    }
});