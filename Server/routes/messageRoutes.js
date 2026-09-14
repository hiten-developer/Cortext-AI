const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const pool = require('../db')

router.post("/messages", authMiddleware, async (req, res) => {
  try {
    const conv_id = await pool.query("select user_id from conversations where id=$1 ",[req.body.conversation_id]);

    if(conv_id.rows.length == 0){
         return res.status(400).json({
        success: false,
        message: "not found user",
      });
    }

    const user_id = conv_id.rows[0].user_id;

    if(user_id != req.user.userId){
        return res.status(403).json({
        success: false,
        message: "Access Denied!",
      });
    }
    const result = await pool.query(
      "insert into messages (conversation_id,content,role) values($1,$2,$3) RETURNING *",
      [req.body.conversation_id, req.body.content, req.body.role],
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

router.get("/messages/:conversation_id", authMiddleware, async (req, res) => {
  try {
    const res_user_id = await pool.query(
      "select user_id from conversations where id = $1",
      [req.params.conversation_id],
    );
    if (res_user_id.rows.length == 0) {
      return res.status(400).json({
        success: false,
        message: "not found user",
      });
    }
    const user_id = res_user_id.rows[0].user_id;

    if (user_id != req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied!",
      });
    }

    const result = await pool.query(
      "select * from messages where conversation_id = $1 ",
      [req.params.conversation_id],
    );
    res.json({
      success: true,
      result: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router
