<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM images WHERE status = "approved" ORDER BY created_at DESC');
    $images = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $images]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
