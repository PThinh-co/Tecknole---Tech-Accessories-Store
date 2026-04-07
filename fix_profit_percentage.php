<?php
require_once 'includes/db.php';
// Reset profit column to be the percentage instead of the money difference
$conn->query("UPDATE tk_products SET profit = CASE 
    WHEN cost > 0 THEN ROUND(((price - cost) / cost) * 100)
    ELSE 15 
END");
echo "DB Updated - Converted profit money to percentage.";
?>
