const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

// freeeアプリで取得した値をここに
const client_id = process.env.FREEE_CLIENT_ID;
const client_secret = process.env.FREEE_CLIENT_SECRET;
const redirect_uri = 'http://localhost:3000/callback';

app.get('/', (req, res) => {
  const authUrl = `https://accounts.secure.freee.co.jp/public_api/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=hr:time_cards:read`;
  res.send(`<a href="${authUrl}">freeeにログインして許可</a>`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post('https://accounts.secure.freee.co.jp/public_api/token', null, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        client_id,
        client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri
      }
    });

    console.log('アクセストークン情報:', tokenRes.data);
    res.send('トークンを取得しました！ターミナルを確認してください。');
  } catch (error) {
    console.error('エラー:', error.response?.data || error.message);
    res.send('トークン取得に失敗しました。');
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port} でサーバー起動中`);
});
