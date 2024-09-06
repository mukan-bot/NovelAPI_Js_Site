import { api_base_url } from './constData.js';
import { getUserInfo, isLogin } from './main.js';

async function InsertActivityReport(activity_text) {
    const user = getUserInfo();
    const user_name = user.UserName;
    const password = user.Password;
    const activity = activity_text;

    const url = api_base_url + '/InsertActivityReport';

    // ユーザーに確認を求めるアラートを表示
    const userConfirmed = window.confirm('この内容で活動報告を送信しますか？\n' + activity);
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
            window.location.href = './home.html';
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

async function fetchProfileComment() {
    const userName = getUserInfo().UserName;
    const url = api_base_url + `/GetUserInformation/${userName}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('profile').value = data.UserInformation; // プロフィールコメントを設定
        } else {
            console.error('Failed to fetch profile comment');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateProfileComment() {
    const user = getUserInfo();
    const userName = user.UserName;
    const password = user.Password;
    const comment = document.getElementById('profile').value;
    const url = api_base_url + '/UpdateUserInformation';

    // ユーザーに確認を求めるアラートを表示
    const userConfirmed = window.confirm('この内容でプロフィールコメントを送信しますか？\n' + comment);
    if (!userConfirmed) {
        return; // ユーザーがキャンセルを選択した場合、関数を終了
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                password: password,
                comment: comment,
            }),
        });
        if (response.ok) {
            await response.json();
            window.location.href = './home.html';
        } else {
            console.error('Failed to update profile comment');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



document.addEventListener("DOMContentLoaded", async function() {
    if (!await isLogin()) {
        window.location.href = './Login.html';
        return;
    }

    try {
        await fetchActivityReport();
        await fetchProfileComment();
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


    // フォーム送信イベントのリスナーを追加
document.getElementById('profile-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ
    await updateProfileComment();
});