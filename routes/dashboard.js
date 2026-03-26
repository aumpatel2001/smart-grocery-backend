const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// Dashboard stats endpoint to aggregate grocery inventory counts per user.
const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [[total]] = await db.query(
      "SELECT COUNT(*) AS count FROM grocery_items WHERE user_id = ?",
      [userId]
    );

    const [[consumed]] = await db.query(
      "SELECT COUNT(*) AS count FROM grocery_items WHERE user_id = ? AND status = 'consumed'",
      [userId]
    );

    const [[expired]] = await db.query(
      "SELECT COUNT(*) AS count FROM grocery_items WHERE user_id = ? AND status = 'expired'",
      [userId]
    );

    const [[available]] = await db.query(
      "SELECT COUNT(*) AS count FROM grocery_items WHERE user_id = ? AND status = 'available'",
      [userId]
    );

    res.json({
      totalItems: total.count,
      consumedItems: consumed.count,
      expiredItems: expired.count,
      availableItems: available.count,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;