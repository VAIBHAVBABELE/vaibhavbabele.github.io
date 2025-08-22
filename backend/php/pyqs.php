<?php
// pyqs.php
// Handles uploading and searching PYQs
require 'config.php';
require 'cloudinary_config.php';

// Upload PYQ
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['pyq'])) {
    $subject = $_POST['subject'];
    $year = $_POST['year'];
    $title = $_POST['title'];
    $file = $_FILES['pyq']['tmp_name'];
    $file_name = $_FILES['pyq']['name'];

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
    $stmt = $conn->prepare("INSERT INTO pyqs (subject, year, title, url) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $subject, $year, $title, $url);
    $stmt->execute();
    echo "PYQ uploaded successfully.";
    exit;
}

// Search PYQs
$search = isset($_GET['search']) ? $_GET['search'] : '';
$pyqs = [];
if ($search) {
    $stmt = $conn->prepare("SELECT * FROM pyqs WHERE subject LIKE ? OR year LIKE ? OR title LIKE ? ORDER BY id DESC");
    $like = "%$search%";
    $stmt->bind_param("sss", $like, $like, $like);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $pyqs[] = $row;
    }
} else {
    $result = $conn->query("SELECT * FROM pyqs ORDER BY id DESC");
    while ($row = $result->fetch_assoc()) {
        $pyqs[] = $row;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>PYQs Archive</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">PYQs Archive</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Upload PYQ</h5>
                <form method="POST" enctype="multipart/form-data" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="col-md-2">
                        <input type="text" class="form-control" name="year" placeholder="Year" required>
                    </div>
                    <div class="col-md-5">
                        <input type="text" class="form-control" name="title" placeholder="Title" required>
                    </div>
                    <div class="col-md-2">
                        <input type="file" class="form-control" name="pyq" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Upload</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Search PYQs</h4>
        <form method="GET" class="row g-3 mb-4">
            <div class="col-md-10">
                <input type="text" class="form-control" name="search" placeholder="Search by subject, year, or title" value="<?php echo htmlspecialchars($search); ?>">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-success w-100">Search</button>
            </div>
        </form>
        <div class="row">
            <?php foreach ($pyqs as $pyq): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($pyq['title']); ?></h5>
                            <p class="mb-1"><strong>Subject:</strong> <?php echo htmlspecialchars($pyq['subject']); ?></p>
                            <p class="mb-1"><strong>Year:</strong> <?php echo htmlspecialchars($pyq['year']); ?></p>
                            <a href="<?php echo $pyq['url']; ?>" target="_blank" class="btn btn-success btn-sm">Download</a>
                        </div>
                        <div class="card-footer text-muted small">
                            Uploaded: <?php echo htmlspecialchars($pyq['uploaded_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
