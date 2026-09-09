const express = require("express");
const pool = require("./db");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// MiddleWares
app.use(express.json());

// Users Details Route
app.get("/users",authMiddleware, async (req, res) => {
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
});

// Conversation Creation Route
app.post("/conversations", authMiddleware,async (req, res) => {
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

// Messages Route
app.post("/messages", authMiddleware,async (req, res) => {
  try {
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

// Get Messages Through Conversation Id
app.get("/messages/:conversation_id", async (req, res) => {
  try {
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

// Sign Up Route
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
    try{
    const email = req.body.email;
    const plainPass = req.body.password;

    const result = await pool.query("select * from users where email = $1",[email]);

    if(result.rows.length == 0){
        return res.json({
            success : false,
            message : "User not Exists try again..."
        })
    }
    const hashedPass = result.rows[0].password
    
    const isMatch = await bcrypt.compare(plainPass,hashedPass);
    if(isMatch){
      const token = jwt.sign(
      {userId : result.rows[0].id},
      process.env.JWT_SECRET,
      {expiresIn : '1d'}
    )
        return res.json({
            success : true,
            message : "you Are logged in",
            jwt_token : token
        })
    }
    else{
        res.json({
            success : false,
            message  : "pass incorrect"
        })
    }
    }
    catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }  
})


// authMiddleware Code
function authMiddleware(req,res,next){
   const authHeader = req.headers.authorization;

   if(!authHeader){
    return res.status(401).json({
      success : false,
      message : "No token provided"
    })
   }

   const token = authHeader.split(' ')[1];

   try{
    const result = jwt.verify(token,process.env.JWT_SECRET)
    if(result){
      req.user = result;
      next()
    }
    
   } catch(err){
    res.status(401).json({
      success : false,
      message : err.message
    })
   }
}


module.exports = app;
