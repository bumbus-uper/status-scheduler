// 例: Express を使った簡単なサーバー
const express = require('express');
const app = express();

app.get('/callback', (req, res) => {
  const authCode = req.query.code;
  console.log('受け取った認可コード:', authCode);
  res.send('✅ 認可コードを受け取りました。ターミナルを見てください。');
});

app.listen(3000, () => {
  console.log('🚀 http://localhost:3000 で待機中...');
});
