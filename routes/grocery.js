// routes/grocery.js
const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  AUTO EXPIRE LOGIC:
  Any item with expiry_date < today and status = 'available'
  will automatically be marked as 'expired'
*/
async function autoExpire(userId) {
  await db.query(
    `UPDATE grocery_items
     SET status = 'expired'
     WHERE user_id = ?
       AND status = 'available'
       AND expiry_date IS NOT NULL
       AND expiry_date < CURDATE()`,
    [userId]
  );
}

// ✅ Get all grocery items
router.get("/", authMiddleware, async (req, res) => {
  try {
    await autoExpire(req.user.id);

    const [items] = await db.query(
      "SELECT * FROM grocery_items WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get items expiring soon (next 3 days)
router.get("/expiring-soon", authMiddleware, async (req, res) => {
  try {
    await autoExpire(req.user.id);

    const [items] = await db.query(
      `SELECT *
       FROM grocery_items
       WHERE user_id = ?
         AND status = 'available'
         AND expiry_date IS NOT NULL
         AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
       ORDER BY expiry_date ASC`,
      [req.user.id]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get expired items
router.get("/expired", authMiddleware, async (req, res) => {
  try {
    await autoExpire(req.user.id);

    const [items] = await db.query(
      `SELECT *
       FROM grocery_items
       WHERE user_id = ?
         AND status = 'expired'
       ORDER BY expiry_date ASC`,
      [req.user.id]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get available items
router.get("/available", authMiddleware, async (req, res) => {
  try {
    await autoExpire(req.user.id);

    const [items] = await db.query(
      `SELECT *
       FROM grocery_items
       WHERE user_id = ?
         AND status = 'available'
       ORDER BY expiry_date ASC`,
      [req.user.id]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get consumed items
router.get("/consumed", authMiddleware, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT *
       FROM grocery_items
       WHERE user_id = ?
         AND status = 'consumed'
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add grocery item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { item_name, quantity, category, expiry_date } = req.body || {};

    if (!item_name) {
      return res.status(400).json({ message: "item_name required" });
    }

    const [result] = await db.query(
      `INSERT INTO grocery_items 
       (user_id, item_name, quantity, category, expiry_date)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.id,
        item_name,
        quantity ?? 1,
        category ?? null,
        expiry_date ?? null,
      ]
    );

    res.status(201).json({
      message: "Item added successfully",
      itemId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update grocery item
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { item_name, quantity, category, expiry_date, status } = req.body || {};

    const [result] = await db.query(
      `UPDATE grocery_items
       SET item_name = COALESCE(?, item_name),
           quantity = COALESCE(?, quantity),
           category = COALESCE(?, category),
           expiry_date = COALESCE(?, expiry_date),
           status = COALESCE(?, status)
       WHERE id = ? AND user_id = ?`,
      [
        item_name ?? null,
        quantity ?? null,
        category ?? null,
        expiry_date ?? null,
        status ?? null,
        req.params.id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark as consumed
router.patch("/:id/consume", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE grocery_items SET status='consumed' WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item marked as consumed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark as expired manually (optional)
router.patch("/:id/expire", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      "UPDATE grocery_items SET status='expired' WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item marked as expired" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete grocery item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM grocery_items WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;