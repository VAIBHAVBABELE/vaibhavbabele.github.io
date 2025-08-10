function createMeeting() {
    // Open a new Google Meet session in a pop-up window
    const width = 800;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const url = "https://meet.google.com/new";
    window.open(url, "Create Meeting", `width=${width},height=${height},left=${left},top=${top}`);
}

function showJoinInput() {
    // Display the input field for the meeting ID
    document.getElementById('joinMeetingDiv').classList.remove('hidden');
}

function joinMeeting() {
    const meetingId = document.getElementById('meetingId').value;
    if (meetingId) {
        // Join the Google Meet session with the provided meeting ID in a pop-up window
        const width = 800;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const url = `${meetingId}`;
        window.open(url, "Join Meeting", `width=${width},height=${height},left=${left},top=${top}`);
    } else {
        alert("Please enter a valid meeting ID");
    }
}

let text = document.getElementById("myButton").innerText;
function toggleContainer() {
    const container = document.getElementById('container');
    if (container.classList.contains('hidden')) {
        container.classList.remove('hidden');
        document.getElementById("myButton").innerText = "X";
        
    } else {
        container.classList.add('hidden');
        document.getElementById("myButton").innerText = text;
    }
}
