<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT id, name, roll_no, course, branch, year, mobile, email, profile_image, created_at FROM users ORDER BY created_at DESC');
    $users = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
