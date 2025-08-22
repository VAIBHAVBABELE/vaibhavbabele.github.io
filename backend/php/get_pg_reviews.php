<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM pg_reviews ORDER BY submitted_at DESC');
    $reviews = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $reviews]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
