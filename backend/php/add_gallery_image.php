<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['user_id','title','image_path'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO images (user_id, title, image_path, status) VALUES (:user_id, :title, :image_path, "pending")');
    $stmt->execute([
        'user_id' => (int)$data['user_id'],
        'title' => trim($data['title']),
        'image_path' => trim($data['image_path'])
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
