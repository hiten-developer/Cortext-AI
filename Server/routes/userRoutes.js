const express = require('express')
const router = express.Router()
const pool = require('../db')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/users',authMiddleware,async(req,res) => {
  try {
    const result = await pool.query(
      "Select id,name,email,phone_no,dob from users",
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
})

module.exports = router