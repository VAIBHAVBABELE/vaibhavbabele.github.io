
<!DOCTYPE html>
<html>
<head>
    <title>Student Support Portal</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        .hero {
            background: linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%);
            color: #fff;
            padding: 60px 0 40px 0;
            border-radius: 0 0 40px 40px;
        }
        .feature-card {
            transition: transform 0.2s;
        }
        .feature-card:hover {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 8px 32px rgba(78,84,200,0.15);
        }
        .feature-icon {
            font-size: 2.5rem;
            color: #4e54c8;
        }
    </style>
</head>
<body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold" href="#">Student Support Portal</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="notes.php"><i class="bi bi-journal-text"></i> Notes</a></li>
                    <li class="nav-item"><a class="nav-link" href="pyqs.php"><i class="bi bi-archive"></i> PYQs</a></li>
                    <li class="nav-item"><a class="nav-link" href="faculty_feedback.php"><i class="bi bi-bar-chart-line"></i> Feedback</a></li>
                    <li class="nav-item"><a class="nav-link" href="lecture_scheduler.php"><i class="bi bi-calendar-event"></i> Scheduler</a></li>
                    <li class="nav-item"><a class="nav-link" href="study_group_finder.php"><i class="bi bi-people"></i> Study Groups</a></li>
                    <li class="nav-item"><a class="nav-link" href="pg_reviews.php"><i class="bi bi-star"></i> PG Reviews</a></li>
                    <li class="nav-item"><a class="nav-link" href="pg_locator_map.html"><i class="bi bi-geo-alt"></i> PG Map</a></li>
                    <li class="nav-item"><a class="nav-link" href="roommate_finder.php"><i class="bi bi-person-bounding-box"></i> Roommate</a></li>
                    <li class="nav-item"><a class="nav-link" href="complaints.php"><i class="bi bi-exclamation-triangle"></i> Complaints</a></li>
                    <li class="nav-item"><a class="nav-link" href="local_services.php"><i class="bi bi-shop"></i> Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="project_collab.php"><i class="bi bi-diagram-3"></i> Collab</a></li>
                    <li class="nav-item"><a class="nav-link" href="github_tracker.php"><i class="bi bi-github"></i> GitHub</a></li>
                    <li class="nav-item"><a class="nav-link" href="project_showcase.php"><i class="bi bi-easel"></i> Showcase</a></li>
                    <li class="nav-item"><a class="nav-link" href="events_calendar.php"><i class="bi bi-calendar3"></i> Events</a></li>
                    <li class="nav-item"><a class="nav-link" href="suggestion_box.php"><i class="bi bi-chat-dots"></i> Suggestions</a></li>
                    <li class="nav-item"><a class="nav-link" href="internship_alerts.php"><i class="bi bi-briefcase"></i> Internships</a></li>
                    <li class="nav-item"><a class="nav-link" href="resumes.php"><i class="bi bi-file-earmark-pdf"></i> Resume</a></li>
                    <li class="nav-item"><a class="nav-link" href="peer_mentorship.php"><i class="bi bi-person-check"></i> Mentorship</a></li>
                    <li class="nav-item"><a class="nav-link" href="cloudinary_upload.php"><i class="bi bi-cloud-upload"></i> Cloudinary</a></li>
                    <li class="nav-item"><a class="nav-link" href="firebase_pyqs.html"><i class="bi bi-fire"></i> PYQs (Firebase)</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <section class="hero text-center mb-5">
        <div class="container">
            <h1 class="display-4 fw-bold mb-3">Welcome to the Student Support Portal</h1>
            <p class="lead mb-4">All your academic, PG, technical, community, and career needs in one beautiful dashboard.</p>
            <div class="d-flex justify-content-center gap-3 flex-wrap">
                <a href="notes.php" class="btn btn-light btn-lg shadow-sm"><i class="bi bi-journal-text me-2"></i>Notes</a>
                <a href="pyqs.php" class="btn btn-light btn-lg shadow-sm"><i class="bi bi-archive me-2"></i>PYQs</a>
                <a href="events_calendar.php" class="btn btn-light btn-lg shadow-sm"><i class="bi bi-calendar3 me-2"></i>Events</a>
                <a href="pg_locator_map.html" class="btn btn-light btn-lg shadow-sm"><i class="bi bi-geo-alt me-2"></i>PG Map</a>
            </div>
        </div>
    </section>
    <div class="container">
        <h2 class="mb-4 text-center">Features</h2>
        <div class="row g-4">
            <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-journal-text feature-icon mb-2"></i>
                        <h5 class="card-title">Notes Sharing</h5>
                        <p class="card-text">Upload and download notes for all subjects.</p>
                        <a href="notes.php" class="btn btn-outline-primary btn-sm">Go</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-archive feature-icon mb-2"></i>
                        <h5 class="card-title">PYQs Archive</h5>
                        <p class="card-text">Search and upload previous year question papers.</p>
                        <a href="pyqs.php" class="btn btn-outline-primary btn-sm">Go</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-bar-chart-line feature-icon mb-2"></i>
                        <h5 class="card-title">Faculty Feedback</h5>
                        <p class="card-text">Review and rate faculty members.</p>
                        <a href="faculty_feedback.php" class="btn btn-outline-primary btn-sm">Go</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-3">
                <div class="card feature-card h-100 text-center">
                    <div class="card-body">
                        <i class="bi bi-calendar-event feature-icon mb-2"></i>
                        <h5 class="card-title">Lecture Scheduler</h5>
                        <p class="card-text">Manage and view lecture schedules.</p>
                        <a href="lecture_scheduler.php" class="btn btn-outline-primary btn-sm">Go</a>
                    </div>
                </div>
            </div>
            <!-- Add more feature cards as needed -->
        </div>
    </div>
    <footer class="mt-5 py-4 bg-primary text-white text-center rounded-top">
        <div class="container">
            <span class="fw-bold">&copy; 2025 Student Support Portal</span> | Made with <i class="bi bi-heart-fill text-danger"></i> for students
        </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
