<?php
require_once 'includes/db.php';

// 1. Drop the existing Generated column
$conn->query("ALTER TABLE tk_products DROP COLUMN profit");

// 2. Add it back as a regular INT
$conn->query("ALTER TABLE tk_products ADD COLUMN profit INT DEFAULT 15 AFTER cost");

// 3. Populate it with initial percentages
$conn->query("UPDATE tk_products SET profit = CASE 
    WHEN cost > 0 THEN ROUND(((price - cost) / cost) * 100)
    ELSE 15 
END");

echo "DB Fixed: Profit is now a regular column storing Percentages.";
?>
