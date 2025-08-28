<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Syllabus id is required.']);
    exit;
}
try {
    $stmt = $pdo->prepare('SELECT file_path FROM syllabus WHERE id = :id');
    $stmt->execute(['id' => $data['id']]);
    $file = $stmt->fetchColumn();
    if ($file && file_exists('../../uploads/syllabus/' . $file)) {
        unlink('../../uploads/syllabus/' . $file);
    }
    $stmt = $pdo->prepare('DELETE FROM syllabus WHERE id = :id');
    $stmt->execute(['id' => $data['id']]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
