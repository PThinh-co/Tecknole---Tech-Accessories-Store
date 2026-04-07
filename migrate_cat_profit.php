<?php
require_once 'includes/db.php';
$conn->query("ALTER TABLE tk_categories ADD COLUMN IF NOT EXISTS default_profit INT DEFAULT 15 AFTER status");
echo "DB Updated - Added default_profit column to categories.";
?>
