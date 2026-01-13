document.addEventListener('DOMContentLoaded', function() {
    // Търсим елемента, където ще изпишем името
    const userNameSpan = document.getElementById('user-name');
    
    // Вземаме името от localStorage
    const savedName = localStorage.getItem('smartWalletUser');

    // Ако сме намерили име, го изписваме, в противен случай оставяме "User" или "Guest"
    if (savedName && userNameSpan) {
        userNameSpan.textContent = savedName;
    }
});