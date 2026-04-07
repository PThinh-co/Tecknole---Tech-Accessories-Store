<?php
require_once 'includes/db.php';
$conn->query("ALTER TABLE tk_products ADD COLUMN IF NOT EXISTS profit INT DEFAULT 15 AFTER cost");
echo "DB Updated - Added profit column if not exists.";
?>
