var express = require("express"),
  app = express(),
  sgMail = require("@sendgrid/mail"),
  bodyParser = require("body-parser"),
  flash = require("connect-flash"),
  session = require("express-session");

app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "woot",
    resave: false,
    saveUninitialized: false
  })
);

app.set("view engine", "ejs");

sgMail.setApiKey(
  "----------------> PUT_YOUR_SENDGRID_MAIL_API_KEY_HERE  <---------------"
);

app.use(express.static("public"));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/send", function(req, res) {
  if (req.body.details["from"] == "") {
    req.body.details["from"] = "test@example.com";
  }
  if (req.body.details["replyTo"] == "") {
    delete req.body.details["replyTo"];
  }
  console.log(req.body.details);

  sgMail.send(req.body.details, function(err, data) {
    if (err) {
      req.flash("error", "Message was Not Sent, Double Check all details");
      res.redirect("/");
    } else {
      req.flash("success", "Message Sent Successfuly");
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT || 5000, function() {
  console.log("Server Started At port 3000");
});
