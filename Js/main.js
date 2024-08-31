import { api_base_url } from './constData.js';

// Cookieから値を取得する関数
function getCookie(key) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].split('=');
        if (cookie[0].trim() === key) {
        return cookie[1];
        }
    }
    return '';
}

// Cookieに値を設定する関数
function setCookie(key, value, days = 7, path = '/') {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${key}=${value}; ${expires}; path=${path}`;
}

export async function login(UserName, Password) {
    const login = api_base_url + "/Login/" + UserName + "/" + Password;
    
    try {
        const response = await fetch(login);
        const data = await response.json();
        
        setCookie("UserName", "UserName", 30);
        setCookie("Password", "Password", 30);
        
        return data["message"] === "Login success";
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function isLogin() {
    const UserName = getCookie("UserName");
    const Password = getCookie("Password");
    return login(UserName, Password);
}


// Initialize
export function init() {
    setCookie("UserName", "asdf")
    setCookie("Password", "asdf")
    // Cookieからユーザーの名前とパスワードを取得
    const UserName = getCookie("UserName")
    const Password = getCookie("Password")

    // ログイン
    if (login(UserName, Password)) {
        console.log("Login success")
    }
    else {
        console.log("Login failed")
    }
}