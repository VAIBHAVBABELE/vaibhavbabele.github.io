// Array of syllabus PDFs (filename and title)
const syllabusPDFs = [
    { title: "B. Tech CSE 1st Year Syllabus", url: "https://www.iict.ac.in/BTech_1stYear_Syllabus_2022-23.pdf" },
    { title: "B. Tech CSE 2nd Year Syllabus", url: "https://aimt.edu.in/wp-content/uploads/2025/01/B.Tech_2nd_Yr_CSE.pdf" },
    { title: "B. Tech CSE 3rd Year Syllabus", url: "https://drive.google.com/file/d/1XQFZyS0RDGzPPPpMgz7SkyX8DgAuXiwc/view?usp=sharing" },
    { title: "B. Tech CSE 4th Year Syllabus", url: "https://aktu.ac.in/pdf/syllabus/syllabus2122/BTech%20CS%204th%20Year%20Syllabus.pdf" },
    { title: "MBA 1st Year Syllabus", url: "https://aktu.ac.in/pdf/syllabus/syllabus2021/MBA%20Common%201st%20Year%20Syllabus%202020_July.pdf" },
    { title: "MBA 2nd Year Syllabus", url: "https://aktu.ac.in/pdf/syllabus/syllabus2122/Updated%20MBA%20_Common_%20%20II%20Year%20Syllabus%202021-22.pdf" }
    // Add more as needed
];

// Populates the PDF list in the HTML
const pdfList = document.getElementById('pdf-list');
syllabusPDFs.forEach(pdf => {
    const div = document.createElement('div');
    div.className = 'pdf-item';
    div.innerHTML = `
        <div class="pdf-title">${pdf.title}</div>
        <button class="open-btn" onclick="openPDF('${pdf.url}')">Open PDF</button>
    `;
    pdfList.appendChild(div);
});

// Opens the PDF in a new tab
function openPDF(url) {
    window.open(url, '_blank');
}
