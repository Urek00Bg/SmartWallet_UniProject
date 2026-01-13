document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-container form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const usernameInput = document.getElementById('username');
            const username = usernameInput.value;
            
            localStorage.setItem('smartWalletUser', username);
        });
    }
});