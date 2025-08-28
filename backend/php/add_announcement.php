<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['notice']) || empty(trim($data['notice']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Notice text is required.']);
    exit;
}
$notice = trim($data['notice']);
try {
    $stmt = $pdo->prepare('INSERT INTO announcements (notice) VALUES (:notice)');
    $stmt->execute(['notice' => $notice]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
