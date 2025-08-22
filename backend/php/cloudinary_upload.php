<?php
// cloudinary_upload.php
// Universal Cloudinary upload endpoint for images/videos
require 'cloudinary_config.php';
require 'vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {
    \Cloudinary\Cloudinary::config([
        'cloud_name' => CLOUDINARY_CLOUD_NAME,
        'api_key' => CLOUDINARY_API_KEY,
        'api_secret' => CLOUDINARY_API_SECRET
    ]);
    $cloudinary = new \Cloudinary\Cloudinary();
    $file = $_FILES['file']['tmp_name'];
    $file_name = $_FILES['file']['name'];
    $upload = $cloudinary->uploadApi()->upload($file, ["public_id" => $file_name]);
    $url = $upload['secure_url'];
    echo json_encode(['url' => $url]);
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cloudinary Upload</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Cloudinary Upload</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <form method="POST" enctype="multipart/form-data" id="uploadForm" class="row g-3">
                    <div class="col-md-8">
                        <input type="file" class="form-control" name="file" required>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-primary w-100">Upload</button>
                    </div>
                </form>
                <div id="result" class="mt-3"></div>
            </div>
        </div>
    </div>
    <script>
        document.getElementById('uploadForm').onsubmit = function(e) {
            e.preventDefault();
            var formData = new FormData(this);
            fetch('cloudinary_upload.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById('result').innerHTML = '<div class="alert alert-success">File uploaded! <a href="' + data.url + '" target="_blank">View</a></div>';
            })
            .catch(() => {
                document.getElementById('result').innerHTML = '<div class="alert alert-danger">Upload failed.</div>';
            });
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
