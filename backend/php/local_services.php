<?php
// local_services.php
// Handles submitting and displaying local services
require 'config.php';

// Submit service
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $service_type = $_POST['service_type'];
    $provider_name = $_POST['provider_name'];
    $contact = $_POST['contact'];
    $details = $_POST['details'];
    $stmt = $conn->prepare("INSERT INTO local_services (service_type, provider_name, contact, details) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $service_type, $provider_name, $contact, $details);
    $stmt->execute();
    echo "Service submitted successfully.";
    exit;
}

// List services
$services = [];
$result = $conn->query("SELECT * FROM local_services ORDER BY id DESC");
while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Local Services</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Local Services</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Submit Local Service</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="service_type" placeholder="Service Type (Laundry, Tiffin, etc.)" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="provider_name" placeholder="Provider Name" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="contact" placeholder="Contact" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="details" placeholder="Details">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Available Services</h4>
        <div class="row">
            <?php foreach ($services as $service): ?>
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card h-100 shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-1"><?php echo htmlspecialchars($service['service_type']); ?></h5>
                            <p class="mb-1"><strong>Provider:</strong> <?php echo htmlspecialchars($service['provider_name']); ?></p>
                            <p class="mb-1"><strong>Contact:</strong> <?php echo htmlspecialchars($service['contact']); ?></p>
                            <p class="mb-1"><strong>Details:</strong> <?php echo htmlspecialchars($service['details']); ?></p>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
