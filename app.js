const express = require('express');
const pool = require('./db.js');
const bodyParser = require('body-parser');
const TalentLMSSdk = require('talentlms-sdk');
const app = express();

app.use(bodyParser.json());

const talentLMS = new TalentLMSSdk({
  apiKey: 'AFwfIWyXd8uPYHYyu2Xljq9n8adlkM',
  protocol: 'https',
  domain: 'projectone.talentlms.com'
});

app.post('/api/talentlms/usersignup', async (req, res) => {
  try {
    const { firstName, lastName, email, login, password } = req.body;

    const signupResponse = await talentLMS.user.signup({
      first_name: firstName,
      last_name: lastName,
      email: email,
      login: login,
      password: password,
    });

    const insertQuery = `
      INSERT INTO users (login, first_name, last_name, email, restrict_email, user_type, timezone, status, level, created_on, last_updated_timestamp, login_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      login,
      firstName,
      lastName,
      email,
      0,
      'regular',
      'UTC',
      'active',
      1,
      new Date().toISOString().slice(0, 19).replace('T', ' '),
      Math.floor(Date.now() / 1000),
      'loginKey'
    ].map(param => (param !== undefined ? param : null));

    await pool.execute(insertQuery, params);

    res.status(201).json(signupResponse);
  } catch (error) {
    res.status(500).json({ error: 'User signup failed' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});