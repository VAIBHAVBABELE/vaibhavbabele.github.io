<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Note id is required.']);
    exit;
}
$fields = [];
$params = [];
foreach (['subject','title','url'] as $field) {
    if (isset($data[$field])) {
        $fields[] = "$field = :$field";
        $params[$field] = trim($data[$field]);
    }
}
if (!$fields) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No fields to update.']);
    exit;
}
$params['id'] = $data['id'];
try {
    $stmt = $pdo->prepare('UPDATE notes SET '.implode(', ',$fields).' WHERE id = :id');
    $stmt->execute($params);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
