const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const conv_id = await pool.query(
      "select user_id from conversations where id=$1 ",
      [req.body.conversation_id],
    );

    if (conv_id.rows.length == 0) {
      return res.status(400).json({
        success: false,
        message: "not found user",
      });
    }

    const user_id = conv_id.rows[0].user_id;

    if (user_id != req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Access Denied!",
      });
    }
    const userResponse = await pool.query(
      "insert into messages (conversation_id,content,role) values($1,$2,$3) RETURNING *",
      [req.body.conversation_id, req.body.content, "user"],
    );

    const dbData = await pool.query(
      "select * from messages where conversation_id = $1 order by created_at asc",
      [req.body.conversation_id],
    );

    const formattedMessage = dbData.rows.map((msg) => ({
      role: msg.role == "ai" ? "assistant" : "user",
      content: msg.content,
    }));
    const aiResponse = await groq.chat.completions.create({
      messages: formattedMessage,
      model: "openai/gpt-oss-20b",
    });

    const aiReply = aiResponse.choices[0].message.content;

    const result = await pool.query(
      "insert into messages(conversation_id,content,role) values($1,$2,$3) RETURNING *",
      [req.body.conversation_id, aiReply, "ai"],
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
