<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM service_ratings ORDER BY submitted_at DESC');
    $ratings = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $ratings]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
