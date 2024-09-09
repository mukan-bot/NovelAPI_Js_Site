import { api_base_url } from './constData.js';


async function register(userName, password, email) {
    const url = api_base_url + "/CreateUser/" + userName + "/" + password + "/" + email;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return true;
    } else {
        return false;
    }
    
}


document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const isLoggedIn = await register(userName, password, email);
        if (isLoggedIn) {
            window.location.href = './userPage.html'; // 登録成功時にリダイレクト
        } else {
            // 登録失敗時の処理を追加
            console.error('登録に失敗しました');
            //window.location.href = './login.html';
        }
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})
