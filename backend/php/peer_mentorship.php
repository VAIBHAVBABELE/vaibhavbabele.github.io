<?php
// peer_mentorship.php
// Handles submitting and displaying peer mentorship connections
require 'config.php';

// Submit mentorship
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mentor_name = $_POST['mentor_name'];
    $mentee_name = $_POST['mentee_name'];
    $subject = $_POST['subject'];
    $stmt = $conn->prepare("INSERT INTO peer_mentorship (mentor_name, mentee_name, subject) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $mentor_name, $mentee_name, $subject);
    $stmt->execute();
    echo "Mentorship connection submitted successfully.";
    exit;
}

// List mentorships
$mentorships = [];
$result = $conn->query("SELECT * FROM peer_mentorship ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $mentorships[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Peer Mentorship</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Peer Mentorship</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Connect with a Senior</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mentor_name" placeholder="Mentor Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="mentee_name" placeholder="Mentee Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Connect</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Mentorship Connections</h4>
        <div class="row">
            <?php foreach ($mentorships as $m): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($m['mentor_name']); ?> &rarr; <?php echo htmlspecialchars($m['mentee_name']); ?></h5>
                            <p class="mb-1"><strong>Subject:</strong> <?php echo htmlspecialchars($m['subject']); ?></p>
                        </div>
                        <div class="card-footer text-muted small">
                            Connected: <?php echo htmlspecialchars($m['created_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
