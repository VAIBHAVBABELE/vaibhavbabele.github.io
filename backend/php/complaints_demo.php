<?php
// complaints_demo.php
// Demo version without database

// Handle form submission (no DB)
$submission_alert = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['user_name'];
    $issue = $_POST['issue'];
    $submission_alert = "<div class='alert alert-success shadow fade show mb-4' role='alert' style='font-size:1.1rem;'>\n    <i class='bi bi-check-circle-fill me-2'></i>Thank you, <strong>" . htmlspecialchars($user_name) . "</strong>! Your complaint about <strong>" . htmlspecialchars($issue) . "</strong> has been submitted (demo mode).\n</div>";
}

// Demo complaints data
$complaints = [
    ['id' => 1, 'user_name' => 'Alice', 'issue' => 'Library is too noisy'],
    ['id' => 2, 'user_name' => 'Bob', 'issue' => 'WiFi not working'],
    ['id' => 3, 'user_name' => 'Charlie', 'issue' => 'Cafeteria food quality'],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complaint Portal Demo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(120deg, #f8fafc 0%, #e0e7ff 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
        }
        .hero {
            background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
            color: #fff;
            border-radius: 1.5rem;
            box-shadow: 0 4px 24px rgba(99,102,241,0.12);
            padding: 2.5rem 1.5rem 2rem 1.5rem;
            margin-bottom: 2.5rem;
            text-align: center;
        }
        .hero .bi {
            font-size: 3.5rem;
            margin-bottom: 0.5rem;
        }
        .complaint-form {
            background: #fff;
            border-radius: 1.25rem;
            box-shadow: 0 2px 12px rgba(99,102,241,0.08);
            padding: 2rem 2rem 1.5rem 2rem;
            margin-bottom: 2.5rem;
        }
        .complaint-form .form-control {
            border-radius: 0.75rem;
            font-size: 1.1rem;
        }
        .complaint-form .btn {
            border-radius: 0.75rem;
            font-size: 1.1rem;
            padding: 0.5rem 2.5rem;
            background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%);
            border: none;
        }
        .complaint-form .btn:hover {
            background: linear-gradient(90deg, #60a5fa 0%, #6366f1 100%);
        }
        .complaints-list {
            background: #fff;
            border-radius: 1.25rem;
            box-shadow: 0 2px 12px rgba(99,102,241,0.08);
            padding: 2rem 2rem 1.5rem 2rem;
        }
        .complaint-card {
            border: none;
            border-radius: 1rem;
            margin-bottom: 1.2rem;
            background: linear-gradient(90deg, #f1f5f9 0%, #e0e7ff 100%);
            box-shadow: 0 1px 6px rgba(99,102,241,0.06);
            transition: transform 0.12s;
        }
        .complaint-card:hover {
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 4px 16px rgba(99,102,241,0.13);
        }
        .complaint-card .bi {
            color: #6366f1;
            font-size: 1.5rem;
            margin-right: 0.7rem;
        }
        @media (max-width: 600px) {
            .complaint-form, .complaints-list, .hero {
                padding: 1.2rem 0.7rem 1rem 0.7rem;
            }
        }
    </style>
</head>
<body>
    <div class="container py-4 py-md-5">
        <div class="hero mb-4">
            <i class="bi bi-exclamation-diamond-fill"></i>
            <h1 class="fw-bold mb-2">Complaint Portal <span style="font-size:1.2rem;">(Demo)</span></h1>
            <p class="lead mb-0">Submit your issues and help us improve your experience.<br>Demo version – no database required.</p>
        </div>
        <?php if ($submission_alert) echo $submission_alert; ?>
        <div class="complaint-form mx-auto mb-4" style="max-width: 600px;">
            <h4 class="mb-3 fw-semibold"><i class="bi bi-pencil-square me-2"></i>Submit a Complaint</h4>
            <form method="POST" autocomplete="off">
                <div class="mb-3">
                    <label for="user_name" class="form-label">Your Name</label>
                    <input type="text" class="form-control" id="user_name" name="user_name" placeholder="Enter your name" required>
                </div>
                <div class="mb-3">
                    <label for="issue" class="form-label">Your Issue</label>
                    <input type="text" class="form-control" id="issue" name="issue" placeholder="Describe your issue" required>
                </div>
                <div class="d-grid gap-2">
                    <button type="submit" class="btn btn-primary btn-lg"><i class="bi bi-send-fill me-2"></i>Submit</button>
                </div>
            </form>
        </div>
        <div class="complaints-list mx-auto" style="max-width: 700px;">
            <h4 class="mb-3 fw-semibold"><i class="bi bi-list-check me-2"></i>Recent Complaints</h4>
            <?php foreach ($complaints as $c): ?>
                <div class="card complaint-card">
                    <div class="card-body d-flex align-items-center">
                        <i class="bi bi-person-circle"></i>
                        <div>
                            <div class="fw-bold text-dark mb-1" style="font-size:1.1rem;"><?php echo htmlspecialchars($c['user_name']); ?></div>
                            <div class="text-secondary" style="font-size:1.05rem;"><i class="bi bi-chat-left-text me-1"></i><?php echo htmlspecialchars($c['issue']); ?></div>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
