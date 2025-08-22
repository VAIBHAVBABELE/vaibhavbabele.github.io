<?php
// complaints.php
// Handles submitting and displaying complaints
require 'config.php';

// Submit complaint
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['user_name'];
    $issue = $_POST['issue'];
    $stmt = $conn->prepare("INSERT INTO complaints (user_name, issue) VALUES (?, ?)");
    $stmt->bind_param("ss", $user_name, $issue);
    $stmt->execute();
    echo "Complaint submitted successfully.";
    exit;
}

// List complaints
$complaints = [];
$result = $conn->query("SELECT * FROM complaints ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $complaints[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Complaint Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Complaint Portal</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Complaint</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="user_name" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-8">
                        <textarea class="form-control" name="issue" placeholder="Describe your issue" required></textarea>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-danger">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Complaints</h4>
        <div class="row">
            <?php foreach ($complaints as $complaint): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm border-danger">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($complaint['user_name']); ?></h5>
                            <p class="mb-1"><strong>Issue:</strong> <?php echo htmlspecialchars($complaint['issue']); ?></p>
                            <p class="mb-1"><strong>Status:</strong> <?php echo htmlspecialchars($complaint['status']); ?></p>
                        </div>
                        <div class="card-footer text-muted small">
                            Submitted: <?php echo htmlspecialchars($complaint['submitted_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
