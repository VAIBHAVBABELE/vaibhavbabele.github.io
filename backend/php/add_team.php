<?php
require_once 'db_connect.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$required = ['team_name','sport','team_captain','vice_captain','players','num_players','created_by'];
foreach ($required as $field) {
    if (!isset($data[$field]) || empty(trim($data[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "$field is required."]);
        exit;
    }
}
try {
    $stmt = $pdo->prepare('INSERT INTO teams (team_name, sport, team_captain, vice_captain, players, num_players, created_by) VALUES (:team_name, :sport, :team_captain, :vice_captain, :players, :num_players, :created_by)');
    $stmt->execute([
        'team_name' => trim($data['team_name']),
        'sport' => trim($data['sport']),
        'team_captain' => trim($data['team_captain']),
        'vice_captain' => trim($data['vice_captain']),
        'players' => trim($data['players']),
        'num_players' => (int)$data['num_players'],
        'created_by' => (int)$data['created_by']
    ]);
    echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
