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
        const data = await response.json();
        if(data.message === "User created"){
            return true;
        }
        else{
            return false;
        }
    } else {
        return false;
    }
    
}

async function isCreateUser(userName){
    const url = api_base_url + "/isCreateUser/" + userName;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        const data = await response.json();
        if(data.message === "User found"){
            return true;
        }else{
            return false;
        }
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
        if (await isCreateUser(userName)){
            document.getElementById('error-message').textContent = '既に登録されているユーザー名です';
            return;
        }
        const isLoggedIn = await register(userName, password, email);
        if (isLoggedIn) {
            window.location.href = './userPage.html'; // 登録成功時にリダイレクト
        } else {
            // 登録失敗時の処理を追加
            document.getElementById('error-message').textContent = '登録に失敗しました';
            //window.location.href = './login.html';
        }
    } catch (error) {
        document.getElementById('error-message').textContent = '登録に失敗しました';
    }
})
