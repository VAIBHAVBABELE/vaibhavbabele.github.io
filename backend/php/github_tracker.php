<?php
// github_tracker.php
// Fetch and display GitHub issues for a repository
$repo = isset($_GET['repo']) ? $_GET['repo'] : 'octocat/Hello-World';
$issues = [];
$url = "https://api.github.com/repos/$repo/issues";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
$response = curl_exec($ch);
curl_close($ch);
if ($response) {
    $issues = json_decode($response, true);
}
?>
<!DOCTYPE html>

<!DOCTYPE html>
<html>
<head>
    <title>GitHub Issues Tracker</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .hero-github {
            background: linear-gradient(90deg, #434343 0%, #000000 100%);
            color: #fff;
            padding: 60px 0 40px 0;
            border-radius: 0 0 40px 40px;
        }
        .github-table {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(67,67,67,0.10);
        }
    </style>
</head>
<body class="bg-light">
    <section class="hero-github text-center mb-5">
        <div class="container">
            <h1 class="display-5 fw-bold mb-3"><i class="bi bi-github"></i> GitHub Issues Tracker</h1>
            <p class="lead mb-4">Track project issues directly from GitHub. Enter any public repo to view open issues!</p>
        </div>
    </section>
    <div class="container">
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <form method="GET" class="row g-3 mb-4">
                    <div class="col-md-8">
                        <input type="text" class="form-control" name="repo" placeholder="owner/repo" required>
                    </div>
                    <div class="col-md-4">
                        <button type="submit" class="btn btn-dark"><i class="bi bi-search"></i> Fetch Issues</button>
                    </div>
                </form>
                <?php
                if (isset($_GET['repo'])) {
                    $repo = $_GET['repo'];
                    $opts = ["http" => ["method" => "GET", "header" => "User-Agent: PHP"]];
                    $context = stream_context_create($opts);
                    $issues = json_decode(file_get_contents("https://api.github.com/repos/$repo/issues", false, $context), true);
                    echo '<table class="table table-bordered align-middle github-table"><thead class="table-dark"><tr><th><i class="bi bi-bookmark"></i> Title</th><th><i class="bi bi-info-circle"></i> Status</th><th><i class="bi bi-calendar"></i> Created At</th></tr></thead><tbody>';
                    foreach ($issues as $issue) {
                        echo "<tr><td>{$issue['title']}</td><td>{$issue['state']}</td><td>" . date('d M Y', strtotime($issue['created_at'])) . "</td></tr>";
                    }
                    echo '</tbody></table>';
                }
                ?>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
</body>
</html>
