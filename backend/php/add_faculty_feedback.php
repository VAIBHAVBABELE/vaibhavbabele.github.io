<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['faculty_name','student_name','rating'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO faculty_feedback (faculty_name, student_name, rating, comments) VALUES (:faculty_name, :student_name, :rating, :comments)');
    $stmt->execute([
        'faculty_name' => trim($data['faculty_name']),
        'student_name' => trim($data['student_name']),
        'rating' => (int)$data['rating'],
        'comments' => isset($data['comments']) ? trim($data['comments']) : null
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
