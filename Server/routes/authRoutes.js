    const express = require('express');
    const router = express.Router();
    const pool = require('../db');
    const bcrypt = require('bcrypt')
    const jwt = require('jsonwebtoken')

    // Sign Up Route
    router.post("/signup", async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const result = await pool.query(
        "insert into users(name,email,password,phone_no,dob) values($1,$2,$3,$4,$5) RETURNING *",
        [
            req.body.name,
            req.body.email,
            hashedPass,
            req.body.phone_no,
            req.body.dob,
        ],
        );
        delete result.rows[0].password;
        res.json({
        success: true,
        result: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
    });

    // Login Route
    router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const plainPass = req.body.password;

        const result = await pool.query("select * from users where email = $1", [
        email,
        ]);

        if (result.rows.length == 0) {
        return res.json({
            success: false,
            message: "User not Exists try again...",
        });
        }
        const hashedPass = result.rows[0].password;

        const isMatch = await bcrypt.compare(plainPass, hashedPass);
        if (isMatch) {
        const token = jwt.sign(
            { userId: result.rows[0].id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
        );
        return res.json({
            success: true,
            message: "you Are logged in",
            jwt_token: token,
        });
        } else {
        res.json({
            success: false,
            message: "pass incorrect",
        });
        }
    } catch (err) {
        res.status(500).json({
        success: false,
        message: err.message,
        });
    }
    });

    module.exports = router;
