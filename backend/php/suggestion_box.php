<?php
// suggestion_box.php
// Handles submitting and displaying suggestions
require 'config.php';

// Submit suggestion
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $suggestion = $_POST['suggestion'];
    $stmt = $conn->prepare("INSERT INTO suggestion_box (suggestion) VALUES (?)");
    $stmt->bind_param("s", $suggestion);
    $stmt->execute();
    echo "Suggestion submitted successfully.";
    exit;
}

// List suggestions
$suggestions = [];
$result = $conn->query("SELECT * FROM suggestion_box ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $suggestions[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Suggestion Box</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Suggestion Box</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Suggestion</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-10">
                        <textarea class="form-control" name="suggestion" placeholder="Your suggestion..." required></textarea>
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Recent Suggestions</h4>
        <div class="row">
            <?php foreach ($suggestions as $s): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <p class="mb-1"><?php echo htmlspecialchars($s['suggestion']); ?></p>
                        </div>
                        <div class="card-footer text-muted small">
                            Submitted: <?php echo htmlspecialchars($s['submitted_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
