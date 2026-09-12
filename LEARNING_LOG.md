## Day 1 — 31-08-2026

**Kya kiya:**
- Basic Express server setup (app.js + server.js separation)
- Git init, .gitignore, GitHub pe push kiya

**Kya seekha:**
- app.js/server.js ko alag rakhne ka fayda — testing ke time server auto-start nahi hona chahiye
- .gitignore root mein kyun honi chahiye (poore repo pe apply hoti hai)


## Day 2 — 01-09-2026

**Kya kiya:**
- `users` aur `conversations` tables ka schema design 
- Foreign key (`REFERENCES`) se `conversations.user_id` ko `users.id` se link kiya
- Data insert/select/truncate karke test kiya
- GitHub repo naam ka typo fix kiya (`corex-ai` → `cortex-ai`), local remote URL update kiya

**Kya seekha:**
- `PRIMARY KEY` duplicate id insert hone se rokta hai
- `FOREIGN KEY` invalid/orphan reference insert hone se rokta hai
- `TRUNCATE` referenced table ko akele nahi hone deta jab tak `CASCADE` ya saari tables ek saath na di jayein
- `git remote set-url` se remote repo URL update kar sakte hain bina local folder rename kiye


## Day 3 — 03-09-2026

**Kya kiya:**
- `messages` tables ka schema deisgn 
- `CHECK` se Conditions Lagai Role Column Par  (CHECK constraint use karke kya kiya)

**Kya seekha:**
- CHECK constraint kya karta hai: `CHECK` is basically use for check the values is right or not with our options
- JOIN kya karta hai aur kyun zaroori hai: `JOIN` is show the data of different tables with our needs.

## Day 4 — 04-09-2026

**Kya kiya:**
- Node.js ko `pg` library se PostgreSQL se connect kiya (`.env` + `db.js`)
- `GET /users`, `POST /conversations`, `POST /messages` routes banaye
- Multi-table JOIN chalaya (users + conversations + messages)

**Kya seekha:**
- `.env` file secrets ko code se alag rakhti hai, git mein commit nahi hoti
- `Pool` multiple database connections manage karta hai
- Parameterized queries (`$1, $2`) SQL Injection se bachati hain
- `RETURNING *` se insert ke baad naya row wapas milta hai
- CHECK constraint violation `try/catch` se pakad ke clean error bhej sakte hain

## Day 5 — 07-09-2026

**Kya kiya:**
- `GET /messages/:conversation_id` route banaya (`req.params`)
- Signup route banaya (`bcrypt.hash` se password secure kiya)
- Login route banaya (`bcrypt.compare` se verify, JWT token generate kiya)

**Kya seekha:**
- `req.params` se URL ke andar dynamic value bhejte hain
- Password hashing one-way hoti hai — login pe naya password hash karke compare karte hain, decrypt nahi karte
- Login mein `GET` nahi `POST` use karte hain kyunki sensitive data body mein bhejna hota hai, URL mein nahi
- JWT token ek signed, expiring proof hai jo login ke baad user ki identity carry karta hai bina baar-baar database check kiye


## Day 6 — 08-09-2026

**Kya kiya:**
- `authMiddleware` banaya jo JWT token verify karta hai
- `GET /users` route ko protected banaya (`authMiddleware` laga ke)
- Dono cases test kiye — bina token (reject) aur valid token (access)

**Kya seekha:**
- Middleware ek function hai jo request aur route handler ke beech chalta hai, `next()` call karke aage badhata hai
- Middleware se code duplication bachta hai — verification logic ek jagah likh ke kai routes pe reuse kar sakte hain
- `req.headers.authorization` se token milta hai, format hota hai `"Bearer <token>"`

## Day 7 — 09-09-2026

**Kya kiya:**
- `authMiddleware` update kiya taaki `req.user` set kare (`req.user = result`)
- `POST /conversations` ko protect kiya — `user_id` ab token se aata hai, `req.body` se nahi
- `POST /messages` ko bhi `authMiddleware` se protect kiya

**Kya seekha:**
- `req` object middleware se route handler tak "safar" karta hai — middleware usme naya data (`req.user`) add kar sakta hai jo aage use hota hai
- Client ko trust nahi karte sensitive data (jaise user_id) ke liye — token se hi lena chahiye, jo verified hai

## Day 8 — 10-09-2026

**Kya kiya:**
- `GET /messages/:conversation_id` route mein ownership check add kiya
- Verify kiya ki conversation ka `user_id`, logged-in user (`req.user.userId`) se match karta hai ya nahi
- Insert + fetch dono test kiye apni conversation pe

**Kya seekha:**
- Sirf login hona kaafi nahi hota — data "apna hai ya nahi" bhi check karna padta hai (ownership check)
- Login user aur data-owner alag concepts hain, dono ka match hona zaroori hai sensitive data access karne ke liye


## Day 9 — 12-09-2026

**Kya kiya:**
- `POST /messages` mein ownership check add kiya, cross-user test kiya
- `GET /conversations` route banaya jo sirf logged-in user ki apni conversations deta hai
- Duplicate route definition ka bug dhoondha aur fix kiya

**Kya seekha:**
- Express mein duplicate route define karne pe sirf pehla wala chalta hai, doosra silently ignore hota hai
- `console.log` print na hone ka matlab ho sakta hai wo code block chal hi nahi raha