const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const pool = require('../db')

router.post("/conversations", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "Insert Into conversations(user_id,title) Values($1,$2) RETURNING *",
      [req.user.userId, req.body.title],
    );
    res.json({
      success: true,
      message: "Your Data is Stored in DB successfully...",
      result: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.get("/conversations",authMiddleware, async(req,res) => {
  try{
    const result = await pool.query("select * from conversations where user_id = $1",[req.user.userId]);
    
    res.json({
      success : true,
      data : result.rows
    })
  } catch(err){
    res.json({
      success : false,
      error : err.message
    })
  }
})

module.exports = router