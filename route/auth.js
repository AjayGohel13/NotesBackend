// Replace import with require
const nodemailer = require('nodemailer');
const otpGenerator = require("otp-generator")
const router = require("express").Router();
const passportLib = require("passport")
const pool = require("../entities/db");
const jwt = require('jsonwebtoken');

router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully logged in",
            user: req.user
        })
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" })
    }
})

router.get("/login/failed", (req, res) => (
    res.status(401).json({
        error: true,
        message: "Failed to login"
    })
))
router.get(
    "/google/callback",
    passportLib.authenticate("google", {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",
    })
)

router.get("/google", passportLib.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect(process.env.CLIENT_URL);
});

router.post('/getOtp', async (req, res) => {
    const { email } = req.body;

    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    })

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const otpTemplate = `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <h2>Verify Your Email</h2>
        <p>Hello,</p>
        <p>To complete your sign-up, please use the following One-Time Password (OTP):</p>
        <div style="font-size: 24px; font-weight: bold; color: #1a73e8; margin: 12px 0;">${otp}</div>
        <p>This OTP is valid for 10 minutes. If you didnt request this, you can safely ignore it.</p>
        <p>Thanks,<br/>The NotesApp Team</p>
        <div style="font-size: 12px; color: #888888; margin-top: 24px; text-align: center;">
          You received this email because you're signing up for NotesApp.
        </div>
      </div>
    </body>
  </html>
`;


    const mailOptions = {
        from: `"NotesApp" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'OTP Verification',
        html: otpTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent!', otp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send OTP' });
    }

})

router.post('/sign-up', async (req, res) => {
    const { email, name, date } = req.body;
    try {
        const findUserWithEmail = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (findUserWithEmail.rows.length > 0) {
            res.status(401).json({ error: 'User with this id is already exist' });
        }
        const query = 'INSERT INTO users (email, name, date) VALUES ($1, $2, $3) RETURNING *';
        const values = [email, name, date];
        const result = await pool.query(query, values);

        res.status(201).json({ message: 'User saved', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
})

router.post('/sign-in', async (req, res) => {
    const { email } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            const userId = result.rows[0].id;
            const name = result.rows[0].name;
            const email = result.rows[0].email;
            const token = jwt.sign(
                { userId, name, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'User found', token });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;