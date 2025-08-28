<?php
// faculty_feedback.php
// Handles submitting and displaying faculty feedback
require 'config.php';

// Submit feedback
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $faculty_name = $_POST['faculty_name'];
    $student_name = $_POST['student_name'];
    $rating = $_POST['rating'];
    $comments = $_POST['comments'];

    $stmt = $conn->prepare("INSERT INTO faculty_feedback (faculty_name, student_name, rating, comments) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $faculty_name, $student_name, $rating, $comments);
    $stmt->execute();
    echo "Feedback submitted successfully.";
    exit;
}

// Get feedback data for chart
$feedback = [];
$result = $conn->query("SELECT faculty_name, AVG(rating) as avg_rating, COUNT(*) as total FROM faculty_feedback GROUP BY faculty_name");
while ($row = $result->fetch_assoc()) {
    $feedback[] = $row;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Faculty Feedback</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Faculty Feedback</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Faculty Feedback</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="faculty_name" placeholder="Faculty Name" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="student_name" placeholder="Your Name" required>
                    </div>
                    <div class="col-md-2">
                        <input type="number" class="form-control" name="rating" min="1" max="5" placeholder="Rating (1-5)" required>
                    </div>
                    <div class="col-md-4">
                        <textarea class="form-control" name="comments" placeholder="Comments"></textarea>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Faculty Ratings</h4>
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <canvas id="feedbackChart" height="120"></canvas>
            </div>
        </div>
    </div>
    <script>
        const feedbackData = <?php echo json_encode($feedback); ?>;
        const labels = feedbackData.map(f => f.faculty_name);
        const ratings = feedbackData.map(f => parseFloat(f.avg_rating));
        const totals = feedbackData.map(f => parseInt(f.total));
        const ctx = document.getElementById('feedbackChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Rating',
                    data: ratings,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true, max: 5 }
                }
            }
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
