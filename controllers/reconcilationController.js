const { Wallet, WalletHistory, Payment } = require("../models");
const { Op } = require("sequelize");

exports.getReconciliationReport = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Please provide a date (YYYY-MM-DD)" });
    }

    // Parse today's and yesterday's date ranges
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const yesterday = new Date(startOfDay);
    yesterday.setDate(startOfDay.getDate() - 1);

    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Get all wallets
    const wallets = await Wallet.findAll();

    const report = await Promise.all(
      wallets.map(async (wallet) => {
        // --- YESTERDAY DATA ---
        const yWalletHistory = await WalletHistory.findAll({
          where: {
            device_id: wallet.device_id,
            createdAt: { [Op.between]: [startOfYesterday, endOfYesterday] },
          },
        });

        const yPayments = await Payment.findAll({
          where: {
            device_id: wallet.device_id,
            createdAt: { [Op.between]: [startOfYesterday, endOfYesterday] },
          },
        });

        const yCredit = yWalletHistory
          .filter((h) => h.transactionType === "credit")
          .reduce((sum, h) => sum + h.transactionAmount, 0);
        const yDebit = yWalletHistory
          .filter((h) => h.transactionType === "debit")
          .reduce((sum, h) => sum + h.transactionAmount, 0);
        const yPaymentsTotal = yPayments.reduce(
          (sum, p) => sum + p.transaction_amount,
          0
        );

        const yesterdayClosing = yCredit - yDebit - yPaymentsTotal;

        // --- TODAY DATA ---
        const todayWalletHistory = await WalletHistory.findAll({
          where: {
            device_id: wallet.device_id,
            createdAt: { [Op.between]: [startOfDay, endOfDay] },
          },
        });

        const todayPayments = await Payment.findAll({
          where: {
            device_id: wallet.device_id,
            createdAt: { [Op.between]: [startOfDay, endOfDay] },
          },
        });

        const totalCredit = todayWalletHistory
          .filter((h) => h.transactionType === "credit")
          .reduce((sum, h) => sum + h.transactionAmount, 0);
        const totalDebit = todayWalletHistory
          .filter((h) => h.transactionType === "debit")
          .reduce((sum, h) => sum + h.transactionAmount, 0);
        const totalPayments = todayPayments.reduce(
          (sum, p) => sum + p.transaction_amount,
          0
        );

        const expectedBalance =
          yesterdayClosing + totalCredit - totalDebit - totalPayments;

        const status =
          Math.abs(wallet.walletAmount - expectedBalance) < 1
            ? "Matched"
            : "Mismatch";

        // --- FINAL JSON STRUCTURE ---
        return {
          yesterdayReport: {
            date: yesterday.toISOString().split("T")[0],
            device_id: wallet.device_id,
            yesterdayClosing,
          },
          todayReport: {
            date,
            device_id: wallet.device_id,
            totalCredit,
            totalDebit,
            totalPayments,
            closingBalance: wallet.walletAmount,
            expectedBalance,
            status,
          },
        };
      })
    );

    res.json({
      message: `Reconciliation report for ${date}`,
      report,
    });
  } catch (err) {
    console.error("Error generating reconciliation:", err);
    res.status(500).json({ error: "Error generating reconciliation report" });
  }
};
