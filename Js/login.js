import { isLogin, login } from './main.js';



document.addEventListener("DOMContentLoaded", async function() {
    if(await isLogin()) {
        window.location.href = './userPage.html';
    }
});


document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    
    try {
        const isLoggedIn = await login(userName, password);
        if (isLoggedIn) {
            window.location.href = './userPage.html'; // ログイン成功時にリダイレクト
        } else {
            // ログイン失敗時の処理を追加
            document.getElementById('error-message').textContent = 'ユーザー名またはパスワードが違います';
            //window.location.href = './login.html';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('error-message').textContent = 'ログインに失敗しました';
    }
})
