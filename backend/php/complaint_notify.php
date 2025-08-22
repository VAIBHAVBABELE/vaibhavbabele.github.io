<?php
// complaint_notify.php
// Send complaint notifications via Email.js and Discord webhook

// Email.js (client-side, so provide JS snippet for frontend)
// Discord webhook (server-side)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = $_POST['user_name'];
    $issue = $_POST['issue'];
    // Discord webhook
    $webhook_url = 'https://discord.com/api/webhooks/1404655256645664919/ctjnJUbNwTaFtwUAP1O1fflh-VYPhOmTWUyMrIcwvk-zrXKeNl6W6ZhQ3UXc3D3IC2Tt';
    $data = [
        'content' => "🚨 New Complaint from $user_name: $issue"
    ];
    $ch = curl_init($webhook_url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    echo "Notification sent.";
    exit;
}
?>
<!-- Email.js client-side snippet for complaints page -->
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
<script>
    (function(){
        emailjs.init('U4K9ZzUuz8EXDGU5U');
    })();
    function sendComplaintEmail(name, issue) {
        emailjs.send('service_zk7h1i5', 'template_kr5fjgr', {
            user_name: name,
            issue: issue
        }).then(function(response) {
            alert('Complaint email sent!');
        }, function(error) {
            alert('Failed to send email.');
        });
    }
    // Call sendComplaintEmail(name, issue) on complaint submit
</script>
