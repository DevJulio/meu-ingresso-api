const firebase = require("../db");
const firestore = firebase.firestore();

const { STRIPE_TEST } = process.env;

const stripe = require("stripe")(STRIPE_TEST);

const getAllMySales = async (req, res, next) => {
  const { id } = req.params;
  try {
    const sales = await firestore
      .collection("compras")
      .where("eventId", "==", id);
    const data = await sales.get();
    const salesArray = [];
    if (data.empty) {
      res.status(404).send("No Event record found");
    } else {
      data.forEach((doc) => {
        salesArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.send(salesArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getAdmAuth = async (req, res, next) => {
  const { id } = req.params;
  try {
    const adm = await firestore.collection("adm").where("email", "==", id);
    const data = await adm.get();
    if (data.empty) {
      res.status(404).send(false);
    } else {
      res.send(true);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createPayment = async (req, res, next) => {
  const data = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Entrada Muladeiros 2023",
            },
            unit_amount: data.tktPrice,
          },
          quantity: 1,
        },
      ],
      success_url: "http://meu-ingresso.com/ticket",
      cancel_url: `${process.env.CLIENT_URL}`,
    });
    res.json({ url: session.url, status: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message, status: false });
  }
};
const deploy = async (req, res, next) => {
  try {
    res.status(200).send("deploy!");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  getAllMySales,
  getAdmAuth,
  createPayment,
  deploy,
};
