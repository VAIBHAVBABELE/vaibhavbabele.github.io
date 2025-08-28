<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['game_name','team_name','player_name','points'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO leaderboard (game_name, team_name, player_name, points) VALUES (:game_name, :team_name, :player_name, :points)');
    $stmt->execute([
        'game_name' => trim($data['game_name']),
        'team_name' => trim($data['team_name']),
        'player_name' => trim($data['player_name']),
        'points' => (int)$data['points']
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
