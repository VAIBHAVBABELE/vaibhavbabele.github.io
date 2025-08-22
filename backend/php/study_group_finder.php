<?php
// study_group_finder.php
// Handles creating and listing study groups
require 'config.php';


<!DOCTYPE html>
<html>
<head>
    <title>Study Group Finder</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .hero-study {
            background: linear-gradient(90deg, #ffb347 0%, #ffcc33 100%);
            color: #fff;
            padding: 60px 0 40px 0;
            border-radius: 0 0 40px 40px;
        }
        .study-table {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(255,179,71,0.10);
        }
    </style>
</head>
<body class="bg-light">
    <section class="hero-study text-center mb-5">
        <div class="container">
            <h1 class="display-5 fw-bold mb-3"><i class="bi bi-people"></i> Study Group Finder</h1>
            <p class="lead mb-4">Find or create study groups for any subject. Collaborate, learn, and grow together!</p>
        </div>
    </section>
    <div class="container">
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title"><i class="bi bi-person-plus"></i> Create a Study Group</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="group_name" placeholder="Group Name" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" name="description" placeholder="Description">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-warning"><i class="bi bi-plus-circle"></i> Create Group</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3 text-center"><i class="bi bi-people-fill"></i> Available Study Groups</h4>
        <div class="card shadow-sm mb-4 study-table">
            <div class="card-body">
                <table class="table table-bordered align-middle">
                    <thead class="table-warning">
                        <tr>
                            <th><i class="bi bi-person-lines-fill"></i> Group Name</th>
                            <th><i class="bi bi-journal-text"></i> Subject</th>
                            <th><i class="bi bi-chat-left-text"></i> Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Fetch groups from DB
                        $conn = new mysqli('localhost', 'root', '', 'if0_38581364_gaming_website_db');
                        $result = $conn->query("SELECT * FROM study_groups ORDER BY id DESC");
                        while($row = $result->fetch_assoc()) {
                            echo "<tr><td>{$row['group_name']}</td><td>{$row['subject']}</td><td>{$row['description']}</td></tr>";
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
                            <p class="mb-1"><strong>Members:</strong> <?php echo htmlspecialchars($group['members']); ?></p>
                        </div>
                        <div class="card-footer text-muted small">
                            Created: <?php echo htmlspecialchars($group['created_at']); ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
