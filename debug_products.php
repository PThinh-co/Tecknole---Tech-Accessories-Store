<?php
require_once 'includes/db.php';
$res = $conn->query("SELECT id, name, price, cost, profit FROM tk_products LIMIT 5");
while($row = $res->fetch_assoc()) {
    print_r($row);
}
?>
