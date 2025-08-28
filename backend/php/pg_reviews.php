<?php
// pg_reviews.php
// Handles submitting and displaying PG reviews
require 'config.php';

// Submit review
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pg_name = $_POST['pg_name'];
    $reviewer = $_POST['reviewer'];
    $rating = $_POST['rating'];
    $comments = $_POST['comments'];
    $stmt = $conn->prepare("INSERT INTO pg_reviews (pg_name, reviewer, rating, comments) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $pg_name, $reviewer, $rating, $comments);
    $stmt->execute();
    echo "Review submitted successfully.";
    exit;
}

// List reviews
$reviews = [];
$result = $conn->query("SELECT * FROM pg_reviews ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}
?>

<!DOCTYPE html>
<html>
<head>

    <!DOCTYPE html>
    <html>
    <head>
        <title>PG Reviews</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
        <style>
            .hero-pg {
                background: linear-gradient(90deg, #ff6e7f 0%, #bfe9ff 100%);
                color: #fff;
                padding: 60px 0 40px 0;
                border-radius: 0 0 40px 40px;
            }
            .pg-table {
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 4px 24px rgba(255,110,127,0.10);
            }
            .star {
                color: #ffc107;
                font-size: 1.2em;
            }
        </style>
    </head>
    <body class="bg-light">
        <section class="hero-pg text-center mb-5">
            <div class="container">
                <h1 class="display-5 fw-bold mb-3"><i class="bi bi-house-door"></i> PG Reviews</h1>
                <p class="lead mb-4">Share and explore reviews of PGs and hostels. Help others find the best accommodation!</p>
            </div>
        </section>
        <div class="container">
            <div class="card mb-4 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title"><i class="bi bi-pencil-square"></i> Submit a PG Review</h5>
                    <form method="POST" class="row g-3">
                        <div class="col-md-3">
                            <input type="text" class="form-control" name="pg_name" placeholder="PG Name" required>
                        </div>
                        <div class="col-md-3">
                            <input type="number" class="form-control" name="rating" placeholder="Rating (1-5)" min="1" max="5" required>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control" name="review" placeholder="Review" required>
                        </div>
                        <div class="col-12">
                            <button type="submit" class="btn btn-info text-white"><i class="bi bi-send"></i> Submit</button>
                        </div>
                    </form>
                </div>
            </div>
            <h4 class="mb-3 text-center"><i class="bi bi-journal-check"></i> Recent PG Reviews</h4>
            <div class="card shadow-sm mb-4 pg-table">
                <div class="card-body">
                    <table class="table table-bordered align-middle">
                        <thead class="table-info">
                            <tr>
                                <th><i class="bi bi-house"></i> PG Name</th>
                                <th><i class="bi bi-star"></i> Rating</th>
                                <th><i class="bi bi-chat-left-text"></i> Review</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Fetch reviews from DB
                            require 'config.php';
                            $result = $conn->query("SELECT * FROM pg_reviews ORDER BY id DESC");
                            while($row = $result->fetch_assoc()) {
                                echo "<tr><td>{$row['pg_name']}</td><td>";
                                for ($i = 1; $i <= 5; $i++) {
                                    echo $i <= $row['rating'] ? '<span class=\'star\'>&#9733;</span>' : '<span class=\'star\'>&#9734;</span>';
                                }
                                echo "</td><td>{$row['review']}</td></tr>";
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
