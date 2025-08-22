<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['name','email','message'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO contact_queries (name, email, message, submitted_at) VALUES (:name, :email, :message, NOW())');
    $stmt->execute([
        'name' => trim($data['name']),
        'email' => trim($data['email']),
        'message' => trim($data['message'])
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
