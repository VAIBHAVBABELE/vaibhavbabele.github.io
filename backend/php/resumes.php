<?php
// resumes.php
// Handles submitting and displaying resumes
require 'config.php';

// Submit resume
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['user_name'];
    $resume_url = $_POST['resume_url'];
    $stmt = $conn->prepare("INSERT INTO resumes (user_name, resume_url) VALUES (?, ?)");
    $stmt->bind_param("ss", $user_name, $resume_url);
    $stmt->execute();
    echo "Resume submitted successfully.";
    exit;
}

// List resumes
$resumes = [];
$result = $conn->query("SELECT * FROM resumes ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $resumes[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Resume Builder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Resume Builder</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Resume</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-6">
                        <input type="text" class="form-control" name="user_name" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-6">
                        <input type="url" class="form-control" name="resume_url" placeholder="Resume PDF URL" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Resumes</h4>
        <div class="row">
            <?php foreach ($resumes as $resume): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($resume['user_name']); ?></h5>
                            <a href="<?php echo $resume['resume_url']; ?>" target="_blank" class="btn btn-success btn-sm">Download Resume</a>
                        </div>
                        <div class="card-footer text-muted small">
                            Uploaded: <?php echo htmlspecialchars($resume['created_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
