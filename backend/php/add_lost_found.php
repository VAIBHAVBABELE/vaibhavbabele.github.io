<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['item_name','description','status','reporter'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO lost_found (item_name, description, status, reporter, reported_at) VALUES (:item_name, :description, :status, :reporter, NOW())');
    $stmt->execute([
        'item_name' => trim($data['item_name']),
        'description' => trim($data['description']),
        'status' => trim($data['status']),
        'reporter' => trim($data['reporter'])
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
