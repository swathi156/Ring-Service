const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");
const ringIdRoutes = require("./routes/ringIdRoutes");
const walletRoutes = require("./routes/walletRoutes");
const walletHistoryRoutes = require("./routes/walletHistoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reconciliationRoutes = require("./routes/reconciliationRoutes");
const app = express();
app.use(bodyParser.json());

// Routes
app.use("/ring", ringIdRoutes);
app.use("/wallet", walletRoutes);
app.use("/wallet-history", walletHistoryRoutes);
app.use("/payment", paymentRoutes);

app.use("/reconciliation", reconciliationRoutes);
// Sync DB & start server
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced ");
  app.listen(process.env.PORT || 5001, () =>
    console.log("Server running on http://localhost:5001")
  );
}).catch(err => console.log(err));
