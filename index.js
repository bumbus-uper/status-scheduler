const axios = require("axios");

(async () => {
  const status = "出勤中"; // freee APIの処理に置き換え予定

  await axios.post("https://slack.com/api/users.profile.set", {
    profile: {
      status_text: status,
      status_emoji: ":office:",
      status_expiration: 0
    }
  }, {
    headers: {
      Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
      "Content-Type": "application/json"
    }
  });

  console.log("Slack status updated.");
})();
