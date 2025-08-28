<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
// File upload handling
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $targetDir = '../../uploads/syllabus/';
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    $fileName = basename($_FILES['file']['name']);
    $targetFile = $targetDir . $fileName;
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        $subject = $_POST['subject'] ?? '';
        $uploaded_by = $_POST['uploaded_by'] ?? '';
        try {
            $stmt = $pdo->prepare('INSERT INTO syllabus (subject, file_path, uploaded_by, uploaded_at) VALUES (:subject, :file_path, :uploaded_by, NOW())');
            $stmt->execute([
                'subject' => $subject,
                'file_path' => $fileName,
                'uploaded_by' => $uploaded_by
            ]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'File upload failed.']);
    }
    exit;
}
http_response_code(400);
echo json_encode(['success' => false, 'error' => 'Invalid request.']);
