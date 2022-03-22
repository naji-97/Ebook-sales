const express = require("express");
const keys = require('./config/keys')
const stripe = require("stripe")(keys.stripeSecretKey);
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");

const app = express();

const port = process.env.PORT || 5000;

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// BodyParser

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static("public"));

// Route
app.get("/", (req, res) => {
    console.log(keys.stripePublishableKey);
  res.render("home",{
    stripePublishableKey: keys.stripePublishableKey
  });
});


app.get("/success", (req, res) => {
  res.render("success");
});

app.post("/charge", (req, res) => {
  const amount = 2500;

  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer) => {
      // have access to the customer object
      return stripe.invoiceItems
        .create({
          customer: customer.id, // set the customer id
          amount, // 25
          currency: "usd",
          description: "Web Development Ebook",
        })
        .then((charge) => {
          res.render("success");
        });
      //   .then((invoice) => {
      //     // New invoice created on a new customer
      //   })
      //   .catch((err) => {
      //     // Deal with an error
      //   });
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
