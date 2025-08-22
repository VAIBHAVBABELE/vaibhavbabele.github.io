<?php
// internship_alerts.php
// Handles submitting and displaying internship alerts
require 'config.php';

// Submit internship alert
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $company = $_POST['company'];
    $url = $_POST['url'];
    $stmt = $conn->prepare("INSERT INTO internship_alerts (title, company, url) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $title, $company, $url);
    $stmt->execute();
    echo "Internship alert submitted successfully.";
    exit;
}

// List internship alerts
$alerts = [];
$result = $conn->query("SELECT * FROM internship_alerts ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $alerts[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Internship Alerts</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Internship Alerts</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Internship Alert</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="title" placeholder="Internship Title" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="company" placeholder="Company" required>
                    </div>
                    <div class="col-md-4">
                        <input type="url" class="form-control" name="url" placeholder="Application URL" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Recent Internship Alerts</h4>
        <div class="row">
            <?php foreach ($alerts as $alert): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($alert['title']); ?></h5>
                            <p class="mb-1"><strong>Company:</strong> <?php echo htmlspecialchars($alert['company']); ?></p>
                            <a href="<?php echo $alert['url']; ?>" target="_blank" class="btn btn-success btn-sm">Apply</a>
                        </div>
                        <div class="card-footer text-muted small">
                            Posted: <?php echo htmlspecialchars($alert['posted_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
