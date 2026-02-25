// routes/shoppingList.js
const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get shopping list for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const [items] = await db.query(
      "SELECT * FROM shopping_list_items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add item to shopping list
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { item_name, quantity } = req.body || {};
    if (!item_name) return res.status(400).json({ message: "item_name required" });

    const [result] = await db.query(
      `INSERT INTO shopping_list_items (user_id, item_name, quantity)
       VALUES (?, ?, ?)`,
      [req.user.id, item_name, quantity ?? 1]
    );

    res.status(201).json({ message: "Shopping item added", itemId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update item (quantity / purchased)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { quantity, purchased } = req.body || {};

    const [result] = await db.query(
      `UPDATE shopping_list_items
       SET quantity = COALESCE(?, quantity),
           purchased = COALESCE(?, purchased)
       WHERE id = ? AND user_id = ?`,
      [quantity ?? null, purchased ?? null, req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Shopping item updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark as purchased
router.patch("/:id/purchased", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE shopping_list_items SET purchased = TRUE WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item marked as purchased" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM shopping_list_items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Shopping item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;