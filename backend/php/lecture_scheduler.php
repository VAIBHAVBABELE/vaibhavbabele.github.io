<?php
// lecture_scheduler.php
// Handles adding and displaying lectures with FullCalendar
require 'config.php';

// Add lecture
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $start = $_POST['start'];
    $end = $_POST['end'];
    $faculty = $_POST['faculty'];
    $subject = $_POST['subject'];
    $stmt = $conn->prepare("INSERT INTO lectures (title, start, end, faculty, subject) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $title, $start, $end, $faculty, $subject);
    $stmt->execute();
    echo "Lecture added successfully.";
    exit;
}

// Fetch lectures for calendar (AJAX)
if (isset($_GET['fetch'])) {
    $result = $conn->query("SELECT * FROM lectures");
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = [
            'title' => $row['title'],
            'start' => $row['start'],
            'end' => $row['end'],
            'faculty' => $row['faculty'],
            'subject' => $row['subject']
        ];
    }
    header('Content-Type: application/json');
    echo json_encode($events);
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Lecture Scheduler</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
</head>
<body class="bg-light">
    <div class="container py-5">
        <h2 class="mb-4 text-center">Lecture Scheduler</h2>
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title">Add Lecture</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="title" placeholder="Title" required>
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" class="form-control" name="start" required>
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" class="form-control" name="end" required>
                    </div>
                    <div class="col-md-1">
                        <input type="text" class="form-control" name="faculty" placeholder="Faculty" required>
                    </div>
                    <div class="col-md-2">
                        <input type="text" class="form-control" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Add Lecture</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3">Lecture Calendar</h4>
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div id="calendar"></div>
            </div>
        </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            var calendarEl = document.getElementById('calendar');
            var calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                events: {
                    url: 'lecture_scheduler.php?fetch=1',
                    method: 'GET'
                },
                eventClick: function(info) {
                    var details = '<strong>Lecture:</strong> ' + info.event.title + '<br>' +
                        '<strong>Faculty:</strong> ' + info.event.extendedProps.faculty + '<br>' +
                        '<strong>Subject:</strong> ' + info.event.extendedProps.subject;
                    var modal = document.createElement('div');
                    modal.className = 'modal fade';
                    modal.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Lecture Details</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">' + details + '</div></div></div>';
                    document.body.appendChild(modal);
                    var bsModal = new bootstrap.Modal(modal);
                    bsModal.show();
                    modal.addEventListener('hidden.bs.modal', function() { document.body.removeChild(modal); });
                }
            });
            calendar.render();
        });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <style>
        #calendar { max-width: 900px; margin: 40px auto; }
    </style>
</body>
</html>
