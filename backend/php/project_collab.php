<?php
// project_collab.php
// Handles submitting and displaying project collaborations
require 'config.php';

// Submit project collab
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $project_name = $_POST['project_name'];
    $members = $_POST['members'];
    $description = $_POST['description'];
    $stmt = $conn->prepare("INSERT INTO project_collab (project_name, members, description) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $project_name, $members, $description);
    $stmt->execute();
    echo "Project collaboration submitted successfully.";
    exit;
}

// List project collabs
$collabs = [];
$result = $conn->query("SELECT * FROM project_collab ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $collabs[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Project Collaboration</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Project Collaboration</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Project Collaboration</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="project_name" placeholder="Project Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="members" placeholder="Members (comma separated)" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="description" placeholder="Description" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Project Collaborations</h4>
        <div class="row">
            <?php foreach ($collabs as $collab): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($collab['project_name']); ?></h5>
                            <p class="mb-1"><strong>Members:</strong> <?php echo htmlspecialchars($collab['members']); ?></p>
                            <p class="mb-1"><strong>Description:</strong> <?php echo htmlspecialchars($collab['description']); ?></p>
                        </div>
                        <div class="card-footer text-muted small">
                            Created: <?php echo htmlspecialchars($collab['created_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
