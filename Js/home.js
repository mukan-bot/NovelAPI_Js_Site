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