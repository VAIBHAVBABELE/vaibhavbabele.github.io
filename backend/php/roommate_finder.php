<?php
// roommate_finder.php
// Handles submitting and listing roommate preferences
require 'config.php';

// Submit roommate preference
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $preferences = $_POST['preferences'];
    $contact = $_POST['contact'];
    $stmt = $conn->prepare("INSERT INTO roommate_finder (name, preferences, contact) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $preferences, $contact);
    $stmt->execute();
    echo "Roommate preference submitted successfully.";

    <!DOCTYPE html>
    <html>
    <head>
        <title>Roommate Finder</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
        <style>
            .hero-roommate {
                background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
                color: #fff;
                padding: 60px 0 40px 0;
                border-radius: 0 0 40px 40px;
            }
            .roommate-table {
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(67,206,162,0.10);
            }
        </style>
    </head>
    <body class="bg-light">
        <section class="hero-roommate text-center mb-5">
            <div class="container">
                <h1 class="display-5 fw-bold mb-3"><i class="bi bi-person-bounding-box"></i> Roommate Finder</h1>
                <p class="lead mb-4">Find your ideal roommate or post your requirements. Connect and share your PG experience!</p>
            </div>
        </section>
        <div class="container">
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title"><i class="bi bi-person-plus"></i> Post Roommate Request</h5>
                    <form method="POST" class="row g-3">
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="name" placeholder="Your Name" required>
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="pg_name" placeholder="PG Name" required>
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="preferences" placeholder="Preferences">
                        </div>
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="contact" placeholder="Contact Info" required>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-success"><i class="bi bi-plus-circle"></i> Post Request</button>
                        </div>
                    </form>
                </div>
            </div>
            <h4 class="mb-3 text-center"><i class="bi bi-people"></i> Available Roommate Requests</h4>
            <div class="card shadow-sm mb-4 roommate-table">
                <div class="card-body">
                    <table class="table table-bordered align-middle">
                        <thead class="table-success">
                            <tr>
                                <th><i class="bi bi-person"></i> Name</th>
                                <th><i class="bi bi-house"></i> PG Name</th>
                                <th><i class="bi bi-sliders"></i> Preferences</th>
                                <th><i class="bi bi-envelope"></i> Contact Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Fetch requests from DB
                            require 'config.php';
                            $result = $conn->query("SELECT * FROM roommate_requests ORDER BY id DESC");
                            while($row = $result->fetch_assoc()) {
                                echo "<tr><td>{$row['name']}</td><td>{$row['pg_name']}</td><td>{$row['preferences']}</td><td>{$row['contact']}</td></tr>";
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
