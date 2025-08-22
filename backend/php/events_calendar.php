<?php
// events_calendar.php
// Handles submitting and displaying events calendar
require 'config.php';

// Submit event
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_name = $_POST['event_name'];
    $start = $_POST['start'];
    $end = $_POST['end'];
    $description = $_POST['description'];
    $stmt = $conn->prepare("INSERT INTO events_calendar (event_name, start, end, description) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $event_name, $start, $end, $description);
    $stmt->execute();
    echo "Event submitted successfully.";
    exit;
}

// Fetch events for calendar (AJAX)
if (isset($_GET['fetch'])) {
    $result = $conn->query("SELECT * FROM events_calendar");
    $events = [];
    while ($row = $result->fetch_assoc()) {
        $events[] = [
            'title' => $row['event_name'],
            'start' => $row['start'],
            'end' => $row['end'],
            'description' => $row['description']
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
    <title>Events Calendar</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
    <style>
        .hero-events {
            background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
            color: #fff;
            padding: 60px 0 40px 0;
            border-radius: 0 0 40px 40px;
        }
        #calendar {
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(67,206,162,0.10);
            padding: 16px;
        }
    </style>
</head>
<body class="bg-light">
    <section class="hero-events text-center mb-5">
        <div class="container">
            <h1 class="display-5 fw-bold mb-3"><i class="bi bi-calendar3"></i> Events Calendar</h1>
            <p class="lead mb-4">Stay updated with all fests, events, and activities. Add your own events and see what's happening!</p>
        </div>
    </section>
    <div class="container">
        <div class="card mb-4 shadow-sm">
            <div class="card-body">
                <h5 class="card-title"><i class="bi bi-calendar-plus"></i> Submit Event</h5>
                <form method="POST" class="row g-3">
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="event_name" placeholder="Event Name" required>
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" class="form-control" name="start" required>
                    </div>
                    <div class="col-md-3">
                        <input type="datetime-local" class="form-control" name="end" required>
                    </div>
                    <div class="col-md-3">
                        <input type="text" class="form-control" name="description" placeholder="Description">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-success"><i class="bi bi-plus-circle"></i> Submit</button>
                    </div>
                </form>
            </div>
        </div>
        <h4 class="mb-3 text-center"><i class="bi bi-calendar-week"></i> Events Calendar</h4>
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
                    url: 'events_calendar.php?fetch=1',
                    method: 'GET'
                },
                eventClick: function(info) {
                    var details = '<strong>Event:</strong> ' + info.event.title + '<br>' +
                        '<strong>Description:</strong> ' + info.event.extendedProps.description;
                    var modal = document.createElement('div');
                    modal.className = 'modal fade';
                    modal.innerHTML = '<div class="modal-dialog"><div class="modal-content"><div class="modal-header bg-success text-white"><h5 class="modal-title"><i class="bi bi-calendar-event"></i> Event Details</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body">' + details + '</div></div></div>';
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
</body>
</html>
