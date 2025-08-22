<!DOCTYPE html>
<html>
<head>
    <title>Student Portal Demo Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background: #f8f9fa; }
        .hero-demo {
            background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
            color: #fff;
            padding: 60px 0 40px 0;
            border-radius: 0 0 40px 40px;
        }
        .feature-card {
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(67,206,162,0.10);
            transition: transform 0.2s;
        }
        .feature-card:hover {
            transform: translateY(-6px) scale(1.03);
        }
    </style>
</head>
<body>
    <section class="hero-demo text-center mb-5">
        <div class="container">
            <h1 class="display-5 fw-bold mb-3"><i class="bi bi-grid"></i> Student Portal Demo Dashboard</h1>
            <p class="lead mb-4">Explore all features and modules. Click any card to view a live demo!</p>
        </div>
    </section>
    <div class="container">
        <div class="row g-4">
            <div class="col-md-4">
                <a href="notes.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-text display-4 text-success"></i>
                            <h5 class="card-title mt-3">Notes Sharing</h5>
                            <p class="card-text">Upload/download notes (PHP, MySQL, Cloudinary)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="firebase_pyqs.html" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-journal-text display-4 text-info"></i>
                            <h5 class="card-title mt-3">PYQs Archive</h5>
                            <p class="card-text">Search past papers (PHP, MySQL, Firebase)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="faculty_feedback.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-person-badge display-4 text-warning"></i>
                            <h5 class="card-title mt-3">Faculty Feedback</h5>
                            <p class="card-text">Review system (PHP, Chart.js)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="lecture_scheduler.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-calendar2-week display-4 text-primary"></i>
                            <h5 class="card-title mt-3">Lecture Scheduler</h5>
                            <p class="card-text">Time management (FullCalendar, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="study_group_finder.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-people display-4 text-secondary"></i>
                            <h5 class="card-title mt-3">Study Group Finder</h5>
                            <p class="card-text">Match by subject (PHP, custom logic)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="pg_reviews.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-house-door display-4 text-danger"></i>
                            <h5 class="card-title mt-3">PG Reviews</h5>
                            <p class="card-text">Rate local PGs (PHP, MySQL, Bootstrap)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="pg_locator_map.html" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-geo-alt display-4 text-info"></i>
                            <h5 class="card-title mt-3">PG Locator Map</h5>
                            <p class="card-text">Nearby PGs on map (OpenStreetMap API)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="roommate_finder.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-person-bounding-box display-4 text-success"></i>
                            <h5 class="card-title mt-3">Roommate Finder</h5>
                            <p class="card-text">Match preferences (PHP, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="complaints.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
                            <h5 class="card-title mt-3">Complaint Portal</h5>
                            <p class="card-text">Report hostel/PG issues (PHP, Email.js/Discord Webhook)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="local_services.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-list-ul display-4 text-primary"></i>
                            <h5 class="card-title mt-3">Local Services</h5>
                            <p class="card-text">Laundry/tiffin list (PHP, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="project_collab.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-people-fill display-4 text-secondary"></i>
                            <h5 class="card-title mt-3">Project Collab</h5>
                            <p class="card-text">Team finder (PHP, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="github_tracker.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-github display-4 text-dark"></i>
                            <h5 class="card-title mt-3">GitHub Tracker</h5>
                            <p class="card-text">Project issues (GitHub API)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="project_showcase.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-star display-4 text-warning"></i>
                            <h5 class="card-title mt-3">Project Showcase</h5>
                            <p class="card-text">Upload portfolio (PHP, Cloudinary)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="events_calendar.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-calendar3 display-4 text-primary"></i>
                            <h5 class="card-title mt-3">Events Calendar</h5>
                            <p class="card-text">All fests & events (FullCalendar, PHP)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="suggestion_box.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-chat-dots display-4 text-info"></i>
                            <h5 class="card-title mt-3">Suggestion Box</h5>
                            <p class="card-text">Anonymous feedback (PHP, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="internship_alerts.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-rocket-takeoff display-4 text-success"></i>
                            <h5 class="card-title mt-3">Internship Alerts</h5>
                            <p class="card-text">Auto updates (RapidAPI, PHP)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="resumes.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-file-earmark-pdf display-4 text-danger"></i>
                            <h5 class="card-title mt-3">Resume Builder</h5>
                            <p class="card-text">PDF generator (html2pdf.js, PHP)</p>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-md-4">
                <a href="peer_mentorship.php" class="text-decoration-none">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <i class="bi bi-person-heart display-4 text-warning"></i>
                            <h5 class="card-title mt-3">Peer Mentorship</h5>
                            <p class="card-text">Connect with seniors (PHP, MySQL)</p>
                        </div>
                    </div>
                </a>
            </div>
        </div>
        <div class="text-center mt-5">
            <a href="dashboard.php" class="btn btn-lg btn-outline-primary"><i class="bi bi-house"></i> Back to Main Dashboard</a>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
