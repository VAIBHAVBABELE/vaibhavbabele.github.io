window.onload = function() {
    // Get parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Valued Contributor';
    const level = urlParams.get('level') || '1';
    const prs = urlParams.get('prs') || '0';
    const maintainer = urlParams.get('maintainer') || 'Vaibhav Babele'; 

    // Map level number to a readable string
    const levelText = {
        '1': 'Beginner',
        '2': 'Intermediate',
        '3': 'Advanced'
    };

    // Populate the certificate with the data
    document.getElementById('contributor-name').textContent = decodeURIComponent(name);
    document.getElementById('pr-count').textContent = prs;
    document.getElementById('level').textContent = levelText[level] || 'Beginner';
    document.getElementById('maintainer-name').textContent = maintainer; 

    // Set the issue date to the current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('issue-date').textContent = today.toLocaleDateString('en-US', options);

    // Add event listener to the download button
    document.getElementById('download-btn').addEventListener('click', () => {
        const certificate = document.getElementById('certificate-wrapper');
        const downloadButton = document.getElementById('download-btn');
        
        // Hide the button so it's not in the screenshot
        downloadButton.style.display = 'none';

        html2canvas(certificate, {
            scale: 2 // Increase scale for better quality
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            // Use jsPDF from the window object
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${name}-contribution-certificate.pdf`);

            // Show the button again after download
            downloadButton.style.display = 'block';
        });
    });
};
