<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM lectures ORDER BY start DESC');
    $lectures = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $lectures]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
