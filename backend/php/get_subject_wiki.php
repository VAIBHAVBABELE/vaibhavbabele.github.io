<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM subject_wiki ORDER BY updated_at DESC');
    $wiki = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $wiki]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
