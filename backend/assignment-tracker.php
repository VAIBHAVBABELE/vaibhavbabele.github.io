<?php
/**
 * Assignment Tracker Backend API
 * Handles CRUD operations for assignments
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$host = 'localhost';
$dbname = 'nitra_mitra';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Create assignments table if it doesn't exist
$createTableSQL = "
CREATE TABLE IF NOT EXISTS assignments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    description TEXT,
    deadline DATETIME NOT NULL,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    status ENUM('Not Started', 'In Progress', 'Submitted', 'Graded') DEFAULT 'Not Started',
    grade VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";
$pdo->exec($createTableSQL);

// Get user ID from request headers or body
function getUserId() {
    // Try to get user ID from Authorization header
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (preg_match('/Bearer (.+)/', $auth, $matches)) {
            // For now, we'll use the token as user ID
            // In production, you should verify the JWT token
            return $matches[1];
        }
    }
    
    // Try to get from request body
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['user_id'])) {
        return $input['user_id'];
    }
    
    // Default fallback - in production, this should require authentication
    return 'default_user';
}

$userId = getUserId();
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Route handling
switch ($method) {
    case 'GET':
        if (isset($pathParts[2]) && $pathParts[2] === 'assignments') {
            if (isset($pathParts[3])) {
                getAssignment($pdo, $pathParts[3], $userId);
            } else {
                getAssignments($pdo, $userId);
            }
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
        
    case 'POST':
        if (isset($pathParts[2]) && $pathParts[2] === 'assignments') {
            createAssignment($pdo, $userId);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
        
    case 'PUT':
        if (isset($pathParts[2]) && $pathParts[2] === 'assignments' && isset($pathParts[3])) {
            updateAssignment($pdo, $pathParts[3], $userId);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
        
    case 'DELETE':
        if (isset($pathParts[2]) && $pathParts[2] === 'assignments' && isset($pathParts[3])) {
            deleteAssignment($pdo, $pathParts[3], $userId);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

/**
 * Get all assignments
 */
function getAssignments($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM assignments WHERE user_id = ? ORDER BY deadline ASC");
        $stmt->execute([$userId]);
        $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Convert datetime strings to ISO format
        foreach ($assignments as &$assignment) {
            $assignment['deadline'] = date('c', strtotime($assignment['deadline']));
            $assignment['created_at'] = date('c', strtotime($assignment['created_at']));
            $assignment['updated_at'] = date('c', strtotime($assignment['updated_at']));
        }
        
        echo json_encode(['success' => true, 'assignments' => $assignments]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch assignments: ' . $e->getMessage()]);
    }
}

/**
 * Get single assignment
 */
function getAssignment($pdo, $id, $userId) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM assignments WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        $assignment = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$assignment) {
            http_response_code(404);
            echo json_encode(['error' => 'Assignment not found']);
            return;
        }
        
        // Convert datetime strings to ISO format
        $assignment['deadline'] = date('c', strtotime($assignment['deadline']));
        $assignment['created_at'] = date('c', strtotime($assignment['created_at']));
        $assignment['updated_at'] = date('c', strtotime($assignment['updated_at']));
        
        echo json_encode(['success' => true, 'assignment' => $assignment]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch assignment: ' . $e->getMessage()]);
    }
}

/**
 * Create new assignment
 */
function createAssignment($pdo, $userId) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    // Validate required fields
    $required = ['title', 'subject', 'deadline'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }
    
    try {
        $id = generateUUID();
        $stmt = $pdo->prepare("
            INSERT INTO assignments (id, user_id, title, subject, description, deadline, priority, status, grade, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $id,
            $userId,
            $input['title'],
            $input['subject'],
            $input['description'] ?? '',
            $input['deadline'],
            $input['priority'] ?? 'Medium',
            $input['status'] ?? 'Not Started',
            $input['grade'] ?? '',
            $input['notes'] ?? ''
        ]);
        
        // Return the created assignment
        getAssignment($pdo, $id, $userId);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create assignment: ' . $e->getMessage()]);
    }
}

/**
 * Update assignment
 */
function updateAssignment($pdo, $id, $userId) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON input']);
        return;
    }
    
    try {
        // Check if assignment exists
        $stmt = $pdo->prepare("SELECT id FROM assignments WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Assignment not found']);
            return;
        }
        
        // Build update query dynamically
        $fields = [];
        $values = [];
        
        $allowedFields = ['title', 'subject', 'description', 'deadline', 'priority', 'status', 'grade', 'notes'];
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $fields[] = "$field = ?";
                $values[] = $input[$field];
            }
        }
        
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No valid fields to update']);
            return;
        }
        
        $values[] = $id;
        $values[] = $userId;
        
        $sql = "UPDATE assignments SET " . implode(', ', $fields) . " WHERE id = ? AND user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($values);
        
        // Return the updated assignment
        getAssignment($pdo, $id, $userId);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update assignment: ' . $e->getMessage()]);
    }
}

/**
 * Delete assignment
 */
function deleteAssignment($pdo, $id, $userId) {
    try {
        $stmt = $pdo->prepare("DELETE FROM assignments WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $userId]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Assignment not found']);
            return;
        }
        
        echo json_encode(['success' => true, 'message' => 'Assignment deleted successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete assignment: ' . $e->getMessage()]);
    }
}

/**
 * Generate UUID
 */
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

/**
 * Get assignment statistics
 */
function getAssignmentStats($pdo, $userId) {
    try {
        $stmt = $pdo->prepare("
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Graded' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN deadline <= DATE_ADD(NOW(), INTERVAL 7 DAY) AND status != 'Graded' THEN 1 ELSE 0 END) as upcoming
            FROM assignments 
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        $stats = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'stats' => $stats]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch statistics: ' . $e->getMessage()]);
    }
}
?>
