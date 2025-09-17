window.onload = function () {
    // Get parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name') || 'Valued Contributor';
    const level = urlParams.get('level') || '1';
    const prs = urlParams.get('prs') || '0';
    const rank = urlParams.get('rank') || '1';
    const score = urlParams.get('score') || '0';
    const program = urlParams.get('program') || 'gssoc';

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
    document.getElementById('rank').textContent = rank;
    document.getElementById('score').textContent = score;

    // Set the issue date to the current date
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('issue-date').textContent = today.toLocaleDateString('en-US', options);

    const orgLogos = document.querySelectorAll(".org-logo");
    const orgLabels = document.querySelectorAll(".org-label");
    const contributionText = document.querySelector(".contribution-text");
    const certificateWrapper = document.getElementById('certificate-wrapper');
    const downloadBtn = document.getElementById('download-btn');
    const badgeCircle = document.querySelector(".badge-circle");
    const mainTitle = document.querySelector(".main-title");

    if (program === 'osci') {
        // OSCI theme
        orgLogos[0].src = "../../osci-logo.png";
        orgLabels[0].textContent = "Open Source Connect India";

        orgLabels[1].textContent = "";

        certificateWrapper.style.backgroundColor = "#FFFFFF";
        certificateWrapper.style.color = "#000000";
        certificateWrapper.style.border = "10px solid";
        certificateWrapper.style.borderImage = "linear-gradient(to right, #FF9933, #FFFFFF, #138808) 1";
        certificateWrapper.style.borderRadius = "12px";

        mainTitle.style.color = "#138808";
        badgeCircle.style.backgroundColor = "#138808";
        badgeCircle.style.color = "#ffffff";
        downloadBtn.style.setProperty("background-color", "#138808", "important");
        downloadBtn.style.setProperty("color", "#ffffff", "important");


        contributionText.innerHTML = `
            For their outstanding contribution to the <strong>Nitra Mitra</strong> project, this certificate
            recognizes the successful merge of <strong id="pr-count">${prs}</strong> pull request(s),
            and achievement of the <strong id="level">${levelText[level] || 'Beginner'}</strong> contribution level with <strong><span
            id="score">${score}</span> Points</strong> under the <i><strong>Open Source Connect India 2025</strong></i> program.<br><br>
            <strong>Rank Achieved:</strong> <span class="rank-highlight" id="rank">${rank}</span> in the project.
        `;
    } else {

        orgLogos[0].src = "../../gssoc25-logo.jpg";


        // Contribution text
        contributionText.innerHTML = `
            For their outstanding contribution to the <strong>Nitra Mitra</strong> project, this certificate
            recognizes the successful merge of <strong id="pr-count">${prs}</strong> pull request(s),
            and achievement of the <strong id="level">${levelText[level] || 'Beginner'}</strong> contribution level with <strong><span
            id="score">${score}</span> Points</strong> under the <i><strong>GirlScript Summer of Code 2025</strong></i> program.<br><br>
            <strong>Rank Achieved:</strong> <span class="rank-highlight" id="rank">${rank}</span> in the project.
        `;
    }

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
