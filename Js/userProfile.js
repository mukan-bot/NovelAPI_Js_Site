import { api_base_url } from './constData.js';


// ユーザーの存在確認
export async function isLogin(userName) {
    const url = api_base_url + '/isCreateUser/' + userName;
    try {
        const response = await fetch(url);
        const data = await response.json();
        // ユーザーが存在する場合はtrueを返す
        // message: "User found"ならtrue
        return data.message === 'User found';

    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}



async function fetchActivityReport(UserName) {
    try {
        const url = api_base_url + '/GetActivityReport/' + UserName;
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

async function fetchProfileComment(UserName) {
    const url = api_base_url + `/GetUserInformation/${UserName}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            // pタグのprofileにプロフィールコメントを設定
            document.getElementById('profile').textContent = data.UserInformation
        } else {
            console.error('Failed to fetch profile comment');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ページの読み込み時にクエリパラメーターを取得して処理する
window.addEventListener('load', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('Name');

    if (!await isLogin(userName)) {
        this.alert('ユーザーが存在しません');
        return;
    }

    if (userName) {
        try {
            await fetchActivityReport(userName);
            await fetchProfileComment(userName);
        } catch (error) {
            console.error('エラーが発生しました:', error);
        }
    }
});

document.getElementById('userName-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // フォームのデフォルトの送信を防ぐ
    const userName = document.getElementById('userName').value;
    
    // 現在のURLを取得
    const currentUrl = new URL(window.location.href);

    // クエリパラメーターを設定
    currentUrl.searchParams.set('Name', userName);

    // 新しいURLにリダイレクト
    window.location.href = currentUrl.toString();
});