marked.setOptions({
  breaks: true,
  gfm: true
});

document.getElementById('resumeForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('resumeInput');
    const file = fileInput.files[0];
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const filenameElement = document.getElementById('filename');
    const summaryElement = document.getElementById('summary');

    result.style.display = 'none';
    loading.style.display = 'block';

    if (!file) {
        loading.style.display = 'none';
        alert("Please upload a resume file.");
        return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    try {
        const response = await fetch('http://localhost:5000/api/resume/analyze', {
            method: 'POST',
            body: formData
        });

        let data;
        try {
            data = await response.json();  // Safely attempt to parse JSON
        } catch (jsonError) {
            throw new Error("Server returned an invalid JSON response.");
        }

        loading.style.display = 'none';

        if (!response.ok) {
            alert(data.error || "Analysis failed.");
            return;
        }

        filenameElement.textContent = data.filename || "N/A";
        summaryElement.innerHTML = marked.parse(data.analysis || "No analysis available");
        result.style.display = 'block';

    } catch (err) {
        loading.style.display = 'none';
        alert("Error: " + err.message);
        console.error("Resume Analysis Error:", err);
    }
});

