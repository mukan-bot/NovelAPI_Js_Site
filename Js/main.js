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

export function getName() {
    console.log("UserName: " + getCookie("UserName"));
    return getCookie("UserName");
}

export function getPassword() {
    console.log("Password: " + getCookie("Password"));
    return getCookie("Password");
}

export function getUserInfo() {
    return {
        UserName: getName(),
        Password: getPassword()
    }
}

// Cookieに値を設定する関数
function setCookie(key, value, days = 7, path = '/') {
    console.log("setCookie: " + key + " " + value);
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

        // 404エラーが返ってきた場合
        if (response.status == 404) {
            console.error("404 Not Found");
            return false;
        }
        
        // ログイン成功時にCookieにユーザー名とパスワードを保存
        if (data["message"] === "Login success") {
            setCookie("UserName", UserName, 30);
            setCookie("Password", Password, 30);
        }
        
        return data["message"] === "Login success";
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function isLogin() {
    const UserName = getCookie("UserName");
    const Password = getCookie("Password");
    return await login(UserName, Password);
}


// Initialize
export function init() {
    // Cookieからユーザーの名前とパスワードを取得
    const UserName = getCookie("UserName")
    const Password = getCookie("Password")
}