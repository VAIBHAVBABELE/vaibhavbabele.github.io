<?php
// project_showcase.php
// Handles submitting and displaying project showcases
require 'config.php';

// Submit project showcase
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['user_name'];
    $project_title = $_POST['project_title'];
    $portfolio_url = $_POST['portfolio_url'];
    $stmt = $conn->prepare("INSERT INTO project_showcase (user_name, project_title, portfolio_url) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $user_name, $project_title, $portfolio_url);
    $stmt->execute();
    echo "Project showcase submitted successfully.";
    exit;
}

// List project showcases
$showcases = [];
$result = $conn->query("SELECT * FROM project_showcase ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $showcases[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Project Showcase</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Project Showcase</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Project Showcase</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="user_name" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="project_title" placeholder="Project Title" required>
                    </div>
                    <div class="col-md-4">
                        <input type="url" class="form-control" name="portfolio_url" placeholder="Portfolio URL" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Project Showcases</h4>
        <div class="row">
            <?php foreach ($showcases as $showcase): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($showcase['project_title']); ?></h5>
                            <p class="mb-1"><strong>By:</strong> <?php echo htmlspecialchars($showcase['user_name']); ?></p>
                            <a href="<?php echo $showcase['portfolio_url']; ?>" target="_blank" class="btn btn-success btn-sm">View Portfolio</a>
                        </div>
                        <div class="card-footer text-muted small">
                            Uploaded: <?php echo htmlspecialchars($showcase['uploaded_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
