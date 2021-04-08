const express = require("express");
const db = require("./config/db");
const passportSetup = require("./config/passportSetup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const path = require("path");

const app = express();

db();
app.use(express.json({ extended: false }));
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ["123456"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routes set-up
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
