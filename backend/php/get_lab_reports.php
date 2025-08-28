<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM lab_reports ORDER BY uploaded_at DESC');
    $reports = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $reports]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
