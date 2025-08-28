<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM marketplace ORDER BY posted_at DESC');
    $items = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $items]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
