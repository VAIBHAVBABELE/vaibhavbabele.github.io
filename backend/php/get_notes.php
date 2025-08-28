<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM notes ORDER BY uploaded_at DESC');
    $notes = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $notes]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
