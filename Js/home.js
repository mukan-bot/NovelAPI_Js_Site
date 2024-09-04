import { api_base_url } from './constData.js';
import { getUserInfo, isLogin } from './main.js';

async function InsertActivityReport(activity_text) {
    const user = getUserInfo();
    const user_name = user.UserName;
    const password = user.Password;
    const activity = activity_text;

    const url = api_base_url + '/InsertActivityReport';

        // ユーザーに確認を求めるアラートを表示
    const userConfirmed = window.confirm('この内容で報告しますか？\n' + activity);
    if (!userConfirmed) {
        return; // ユーザーがキャンセルを選択した場合、関数を終了
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: user_name,
            password: password,
            text: activity,
        }),
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
}


export async function fetchActivityReport() {
    try {
        const url = api_base_url + '/GetActivityReport/' + getUserInfo().UserName;
        const response = await fetch(url);
        const data = await response.json();
        const activityReport = data.activity_report;
        const tbody = document.querySelector('#activity-table tbody');

        activityReport.forEach(report => {
            const tr = document.createElement('tr');
            const dateTd = document.createElement('td');
            const contentTd = document.createElement('td');

            dateTd.textContent = new Date(report[3]).toLocaleString();
            contentTd.textContent = report[2];

            tr.appendChild(dateTd);
            tr.appendChild(contentTd);
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error fetching activity report:', error);
    }
}



async function fetchUserProfile() {
    try {
        const userName = getUserInfo().UserName;
        const url = api_base_url + '/GetUserInformation/' + userName;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        displayUserProfile(data);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function displayUserProfile(data) {
    const profileComment = data.profileComment || 'プロフィールコメントがありません';
    document.getElementById('profile-comment').innerText = profileComment;
}




document.addEventListener("DOMContentLoaded", async function() {
    if (!await isLogin()) {
        window.location.href = './Login.html';
        return;
    }

    try {
        await fetchActivityReport();
        await fetchUserProfile();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});




document.getElementById('activity-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const activity_text = document.getElementById('activity').value;

    try {
        const response = InsertActivityReport(activity_text);

        if (!response) {
            // ログイン失敗時の処理を追加
            // ログインページにリダイレクト
            window.location.href = './Login.html';
        }
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
});