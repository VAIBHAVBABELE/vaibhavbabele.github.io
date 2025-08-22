<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['title','start','end','faculty','subject'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO lectures (title, start, end, faculty, subject) VALUES (:title, :start, :end, :faculty, :subject)');
    $stmt->execute([
        'title' => trim($data['title']),
        'start' => $data['start'],
        'end' => $data['end'],
        'faculty' => trim($data['faculty']),
        'subject' => trim($data['subject'])
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
