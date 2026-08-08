export default function handler(req, res) {
  const profileData = require("@/data/profile.json");
  res.status(200).json(profileData.about);
}
