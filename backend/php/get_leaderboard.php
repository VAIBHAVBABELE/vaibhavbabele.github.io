<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
try {
    $stmt = $pdo->query('SELECT * FROM leaderboard ORDER BY points DESC, run_rate DESC');
    $leaderboard = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $leaderboard]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
