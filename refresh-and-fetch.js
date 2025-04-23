require('dotenv').config();
const axios = require('axios');

const client_id = process.env.FREEE_CLIENT_ID;
const client_secret = process.env.FREEE_CLIENT_SECRET;
const refresh_token = process.env.FREEE_REFRESH_TOKEN;
const companyId = process.env.FREEE_OFFICE_ID;
const employeeId = process.env.FREEE_USER_ID;

const fs = require('fs');
const path = require('path');

// .env ファイルの中のリフレッシュトークンを上書きする関数
function updateRefreshTokenInEnvFile(newToken) {
  const envPath = path.resolve(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // FREEE_REFRESH_TOKEN の行だけ書き換え
  const updated = envContent.replace(
    /^FREEE_REFRESH_TOKEN=.*$/m,
    `FREEE_REFRESH_TOKEN=${newToken}`
  );

  fs.writeFileSync(envPath, updated, 'utf-8');
  console.log('📝 .envファイルを更新しました（refresh_token）');
}


async function refreshAccessToken() {
  const res = await axios.post('https://accounts.secure.freee.co.jp/public_api/token', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      grant_type: 'refresh_token',
      client_id,
      client_secret,
      refresh_token
    }
  });

  const new_refresh_token = res.data.refresh_token;

  // 新しいトークンを .env に書き込み
  updateRefreshTokenInEnvFile(new_refresh_token);

  return {
    access_token: res.data.access_token,
    refresh_token: res.data.refresh_token, // ←必要に応じて保存
    expires_in: res.data.expires_in
  };
}

const today = new Date().toISOString().split('T')[0];

async function getTimeCard(access_token) {
  try {
    const response = await axios.get(
      'https://api.freee.co.jp/hr/api/v1/employees/attendances',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        params: {
          company_id: companyId,
          employee_id: employeeId,
          from: today,
          to: today,
        },
      }
    );

    const attendances = response.data.attendances;
    if (attendances.length > 0) {
      const attendance = attendances[0];
      console.log(`✅ 本日の出勤状況: ${attendance.work_status_name}`);
    } else {
      console.log('📭 本日の勤怠記録はありません');
    }
  } catch (err) {
    console.error('出勤状態の取得に失敗:', err.response?.data || err.message);
  }
}

async function main() {
  try {
    const { access_token } = await refreshAccessToken();
    await getTimeCard(access_token);
  } catch (err) {
    console.error('❌ トークン取得かAPI呼び出しでエラー:', err);
  }
}

main();
