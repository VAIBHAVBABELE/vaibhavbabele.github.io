<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    $targetDir = '../../uploads/lab_reports/';
    if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);
    $fileName = basename($_FILES['file']['name']);
    $targetFile = $targetDir . $fileName;
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        $title = $_POST['title'] ?? '';
        $uploaded_by = $_POST['uploaded_by'] ?? '';
        try {
            $stmt = $pdo->prepare('INSERT INTO lab_reports (title, file_path, uploaded_by, uploaded_at) VALUES (:title, :file_path, :uploaded_by, NOW())');
            $stmt->execute([
                'title' => $title,
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
