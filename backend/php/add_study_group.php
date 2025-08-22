<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['subject','group_name','members'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO study_groups (subject, group_name, members) VALUES (:subject, :group_name, :members)');
    $stmt->execute([
        'subject' => trim($data['subject']),
        'group_name' => trim($data['group_name']),
        'members' => trim($data['members'])
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
