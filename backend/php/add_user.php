<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['name','roll_no','course','branch','year','mobile','email','password'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO users (name, roll_no, course, branch, year, mobile, email, password, profile_image) VALUES (:name, :roll_no, :course, :branch, :year, :mobile, :email, :password, :profile_image)');
    $stmt->execute([
        'name' => trim($data['name']),
        'roll_no' => trim($data['roll_no']),
        'course' => trim($data['course']),
        'branch' => trim($data['branch']),
        'year' => (int)$data['year'],
        'mobile' => trim($data['mobile']),
        'email' => trim($data['email']),
        'password' => password_hash($data['password'], PASSWORD_BCRYPT),
        'profile_image' => isset($data['profile_image']) ? trim($data['profile_image']) : null
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
