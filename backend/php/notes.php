<?php
// notes.php
// Handles uploading and downloading notes

require 'config.php'; // DB config
require 'cloudinary_config.php'; // Cloudinary config

// Upload notes
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['note'])) {
    $subject = $_POST['subject'];
    $title = $_POST['title'];
    $file = $_FILES['note']['tmp_name'];
    $file_name = $_FILES['note']['name'];

    // Upload to Cloudinary
    require 'vendor/autoload.php';
    \Cloudinary\Cloudinary::config([
        'cloud_name' => CLOUDINARY_CLOUD_NAME,
        'api_key' => CLOUDINARY_API_KEY,
        'api_secret' => CLOUDINARY_API_SECRET
    ]);
    $cloudinary = new \Cloudinary\Cloudinary();
    $upload = $cloudinary->uploadApi()->upload($file, ["public_id" => $file_name]);
    $url = $upload['secure_url'];

    // Save to DB
    $stmt = $conn->prepare("INSERT INTO notes (subject, title, url) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $subject, $title, $url);
    $stmt->execute();
    echo "Note uploaded successfully.";
    exit;
}

// Download notes
$notes = [];
$result = $conn->query("SELECT * FROM notes ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $notes[] = $row;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Notes Sharing</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Notes Sharing</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Upload Notes</h5>
                <form method="POST" enctype="multipart/form-data" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="title" placeholder="Title" required>
                    </div>
                    <div class="col-md-4">
                        <input type="file" class="form-control" name="note" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Upload</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Download Notes</h4>
        <div class="row">
            <?php foreach ($notes as $note): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($note['title']); ?></h5>
                            <p class="mb-1"><strong>Subject:</strong> <?php echo htmlspecialchars($note['subject']); ?></p>
                            <a href="<?php echo $note['url']; ?>" target="_blank" class="btn btn-success btn-sm">Download</a>
                        </div>
                        <div class="card-footer text-muted small">
                            Uploaded: <?php echo htmlspecialchars($note['uploaded_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
