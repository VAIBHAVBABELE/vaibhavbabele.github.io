<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['service_type','service_name','rating','reviewer'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO service_ratings (service_type, service_name, rating, reviewer, comments, submitted_at) VALUES (:service_type, :service_name, :rating, :reviewer, :comments, NOW())');
    $stmt->execute([
        'service_type' => trim($data['service_type']),
        'service_name' => trim($data['service_name']),
        'rating' => (int)$data['rating'],
        'reviewer' => trim($data['reviewer']),
        'comments' => isset($data['comments']) ? trim($data['comments']) : null
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
