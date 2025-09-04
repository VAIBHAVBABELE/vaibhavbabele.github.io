// ats-score-checker/scripts.js
import { extractKeywordsFromJD, calculateScore, analyzeSections, formattingHints, calculateReadability, normalizeText } from './ats-analysis.js';

// PDF.js worker config
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Utility function to strip HTML
function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Enhanced parsers with progress indicators
async function parseDocx(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return stripHtml(result.value);
  } catch (e) {
    console.error('DOCX parse error', e);
    throw new Error('Failed to parse DOCX. Try converting to PDF or TXT.');
  }
}

async function parsePdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(i => i.str).join(' ');
      fullText += pageText + '\n\n';
      if (i >= 20) break; // Limit for performance
    }
    return fullText;
  } catch (e) {
    console.error('PDF parse error', e);
    throw new Error('Failed to parse PDF. Ensure it\'s text-based, not scanned.');
  }
}

async function parseTxt(file) {
  return await file.text();
}

async function parseResume(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return await parsePdf(file);
  if (name.endsWith('.docx') || name.endsWith('.doc')) return await parseDocx(file);
  if (name.endsWith('.txt')) return await parseTxt(file);
  throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT.');
}

// UI elements
const fileInput = document.getElementById('resume-file');
const fileNameEl = document.getElementById('file-name');
const parseStatus = document.getElementById('parsing-status');
const analyzeBtn = document.getElementById('analyze-btn');
const clearBtn = document.getElementById('clear-btn');
const jdText = document.getElementById('jd-text');
const scoreNumber = document.getElementById('score-number');
const scoreBreakdown = document.getElementById('score-breakdown');
const matchedContainer = document.getElementById('matched-keywords');
const missingContainer = document.getElementById('missing-keywords');
const preview = document.getElementById('resume-preview');
const sectionChecks = document.getElementById('section-checks');
const downloadBtn = document.getElementById('download-suggestions');
const scoreChartCtx = document.getElementById('scoreChart').getContext('2d');

let lastParsedText = '';
let lastSuggestionsText = '';
let chartInstance = null;

// Drag & drop support
const dropArea = document.querySelector('.file-input-label div');
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('border-primary');
});
dropArea.addEventListener('dragleave', () => dropArea.classList.remove('border-primary'));
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('border-primary');
  const file = e.dataTransfer.files[0];
  if (file) {
    fileInput.files = e.dataTransfer.files;
    handleFileChange(file);
  }
});

// File change handler
async function handleFileChange(file) {
  fileNameEl.textContent = `${file.name} — ${(file.size / 1024 | 0)} KB`;
  parseStatus.innerHTML = '<i class="fa fa-spinner icon-spin me-1"></i> Parsing resume...';
  try {
    const text = await parseResume(file);
    lastParsedText = text;
    preview.textContent = text.slice(0, 1500) + (text.length > 1500 ? '...' : '');
    parseStatus.innerHTML = '<i class="fa fa-check-circle text-success me-1"></i> Resume parsed successfully.';
  } catch (err) {
    parseStatus.innerHTML = '<i class="fa fa-exclamation-triangle text-danger me-1"></i> ' + err.message;
    preview.textContent = 'Parsing failed.';
  }
}

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFileChange(file);
});

// Clear handler
clearBtn.addEventListener('click', () => {
  fileInput.value = '';
  fileNameEl.textContent = 'Drag & drop or click to upload';
  jdText.value = '';
  scoreNumber.textContent = '—';
  scoreBreakdown.innerHTML = '';
  matchedContainer.innerHTML = '';
  missingContainer.innerHTML = '';
  preview.textContent = 'Upload a resume to see the preview.';
  sectionChecks.innerHTML = '';
  parseStatus.innerHTML = '<i class="fa fa-info-circle me-1"></i> Ready to parse your resume.';
  lastParsedText = '';
  lastSuggestionsText = '';
  downloadBtn.disabled = true;
  if (chartInstance) chartInstance.destroy();
});

// Analyze handler
analyzeBtn.addEventListener('click', async () => {
  if (!lastParsedText) return alert('Please upload a resume first.');
  const jd = jdText.value.trim();
  if (!jd && !confirm('No job description provided. Proceed with general checks?')) return;

  parseStatus.innerHTML = '<i class="fa fa-spinner icon-spin me-1"></i> Analyzing...';
  await runAnalysis(lastParsedText, jd);
  parseStatus.innerHTML = '<i class="fa fa-check-circle text-success me-1"></i> Analysis complete.';
});

// Main analysis
async function runAnalysis(resumeTextRaw, jdRaw) {
  const resumeText = normalizeText(resumeTextRaw);
  const jd = jdRaw || '';

  // Keywords
  const jdKeywords = extractKeywordsFromJD(jd);
  const matched = jdKeywords.filter(kw => resumeText.includes(kw));
  const missing = jdKeywords.filter(kw => !resumeText.includes(kw));

  // Sections
  const { checks, score: sectionsScore } = analyzeSections(resumeTextRaw);

  // Formatting
  const hints = formattingHints(resumeTextRaw);

  // Readability
  const readabilityScore = calculateReadability(resumeTextRaw);

  // Score
  const { final, kwScore, sectionsScore: sPct, formattingScore: fPct, readabilityScore: rPct } = calculateScore({
    totalKeywords: jdKeywords.length,
    matchedCount: matched.length,
    sectionsScore,
    formattingScore: hints.length ? (1 - hints.length * 0.1) : 1.0,
    readabilityScore
  });

  // Update UI
  scoreNumber.textContent = final;
  scoreBreakdown.innerHTML = `
    <div class="chip">Keywords: <strong>${kwScore}</strong> <div class="progress"><div class="progress-bar bg-success" style="width:${kwScore}%"></div></div></div>
    <div class="chip">Sections: <strong>${sPct}%</strong> <div class="progress"><div class="progress-bar bg-info" style="width:${sPct}%"></div></div></div>
    <div class="chip">Formatting: <strong>${fPct}%</strong> <div class="progress"><div class="progress-bar bg-warning" style="width:${fPct}%"></div></div></div>
    <div class="chip">Readability: <strong>${rPct}%</strong> <div class="progress"><div class="progress-bar bg-primary" style="width:${rPct}%"></div></div></div>
  `;

  // Keywords UI with tooltips
  matchedContainer.innerHTML = matched.length ? matched.map(k => `<span class="badge bg-success text-white me-1 mb-1" data-tippy-content="Matched in resume">${k}</span>`).join('') : '<span class="small-muted">No matches — add keywords!</span>';
  missingContainer.innerHTML = missing.length ? missing.map(k => `<span class="badge bg-danger text-white me-1 mb-1" data-tippy-content="Add this keyword">${k}</span>`).join('') : '<span class="small-muted">Perfect match!</span>';

  // Section checks with icons
  sectionChecks.innerHTML = Object.entries(checks).map(([key, val]) => `
    <li class="list-group-item d-flex justify-content-between align-items-center">
      ${key.charAt(0).toUpperCase() + key.slice(1)}: <span class="${val ? 'section-ok' : 'section-miss'}"><i class="fa fa-${val ? 'check' : 'times'}-circle me-1"></i>${val ? 'Found' : 'Missing'}</span>
    </li>
  `).join('');

  // Chart
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(scoreChartCtx, {
    type: 'doughnut',
    data: {
      labels: ['Keywords', 'Sections', 'Formatting', 'Readability'],
      datasets: [{ data: [kwScore, sPct, fPct, rPct], backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#007bff'] }]
    },
    options: { cutout: '70%', plugins: { legend: { position: 'bottom' } } }
  });

  // Suggestions text
  lastSuggestionsText = buildSuggestionsText({ final, kwScore, sPct, fPct, rPct, matched, missing, checks, hints });
  downloadBtn.disabled = false;

  // Init tooltips
  tippy('[data-tippy-content]', { theme: 'light-border' });

  preview.scrollIntoView({ behavior: 'smooth' });
}

function buildSuggestionsText({ final, kwScore, sPct, fPct, rPct, matched, missing, checks, hints }) {
  let out = `ATS Score Report — Enhanced by Grok\n\nOverall Score: ${final}/100\n\nBreakdown:\n- Keywords: ${kwScore}\n- Sections: ${sPct}%\n- Formatting: ${fPct}%\n- Readability: ${rPct}%\n\nMatched Keywords: ${matched.join(', ') || 'None'}\n\nMissing Keywords: ${missing.join(', ') || 'None'}\n\nSection Checks:\n${Object.entries(checks).map(([k, v]) => `- ${k.charAt(0).toUpperCase() + k.slice(1)}: ${v ? 'Yes' : 'No'}`).join('\n')}\n\nFormatting & Readability Hints:\n${hints.map(h => '- ' + h).join('\n') || '- None'}\n\nAdvanced Recommendations:\n1. Incorporate missing keywords into skills and experience sections.\n2. Improve readability by shortening sentences and using active voice.\n3. Add missing sections like Summary or GitHub for tech roles.\n4. Test with multiple JDs for versatility.\n\nPowered by Nitra Mitra — Optimized UI by Grok.`;
  return out;
}

// Download
downloadBtn.addEventListener('click', () => {
  const blob = new Blob([lastSuggestionsText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ats-report.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Sample JD
document.getElementById('sample-jd-btn').addEventListener('click', () => {
  jdText.value = `Seeking a Full-Stack Developer with 3+ years in JavaScript, React.js, Node.js, Express, MongoDB/SQL, AWS/GCP, Docker, Git, CI/CD, Agile/Scrum. Strong in problem-solving, TDD (Jest/Mocha), and REST/GraphQL APIs. Experience with microservices preferred.`;
});

// Samples
const sampleOptimized = `Harsh Vardhan Sahu\nEmail: harsh.vardhan@example.com | Phone: +91-123-456-7890 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/Harsh Vardhan Sahu\n\nProfessional Summary:\nDynamic Full-Stack Developer with 5+ years building scalable web apps using React, Node.js, and SQL. Boosted app performance by 40% at previous role.\n\nSkills:\nJavaScript, React.js, Node.js, Express, REST APIs, GraphQL, SQL, MongoDB, AWS, Docker, Git, Agile, Jest, CI/CD\n\nProfessional Experience:\nSenior Developer — TechCorp (2020-Present)\n- Led development of React-based dashboard, increasing user retention by 25%\n- Implemented Node.js microservices with Docker, reducing deployment time by 50%\n\nEducation:\nB.S. Computer Science — University of Example (2016)\n\nProjects:\n- E-commerce Platform: Built full-stack app with React and Node.js, handling 10k+ users.`;

const sampleSimple = `Harsh Vardhan Sahu\nharsh.vardhan@example.com | +91-987-654-3210 | linkedin.com/in/jHarsh Vardhan Sahu\n\nObjective:\nEntry-level Software Engineer eager to contribute to innovative teams with strong foundational skills.\n\nSkills:\nJavaScript, React, Node.js, SQL, Git\n\nEducation:\nB.S. Computer Science — State University (2023)\n\nExperience:\nIntern — Startup Inc. (2022-2023)\n- Assisted in front-end development using React.\n- Collaborated on API integrations with Node.js.`;

document.getElementById('download-opt-tech').addEventListener('click', () => downloadText(sampleOptimized, 'optimized-resume.txt'));
document.getElementById('download-simple').addEventListener('click', () => downloadText(sampleSimple, 'simple-resume.txt'));

document.getElementById('preview-opt-tech').addEventListener('click', () => showModal('Optimized Technical Resume', sampleOptimized));
document.getElementById('view-sample-1').addEventListener('click', () => showModal('Optimized Technical Resume', sampleOptimized));
document.getElementById('preview-simple').addEventListener('click', () => showModal('Simple Clean Resume', sampleSimple));
document.getElementById('view-sample-2').addEventListener('click', () => showModal('Simple Clean Resume', sampleSimple));

function downloadText(text, filename) {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function showModal(title, content) {
  document.getElementById('sampleModalTitle').textContent = title;
  document.getElementById('sampleModalContent').textContent = content;
  new bootstrap.Modal(document.getElementById('sampleModal')).show();
}

// Ctrl+Enter shortcut
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') analyzeBtn.click();
});

// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.innerHTML = `<i class="fa fa-${isDark ? 'sun' : 'moon'} me-1"></i> ${isDark ? 'Light Mode' : 'Dark Mode'}`;
});

// Language toggle
const translations = {
  en: {
    title: 'Resume ATS Score Checker',
    heroSubtitle: 'Upload your resume (PDF / DOCX / TXT), paste a job description or keywords, and receive an advanced ATS compatibility score with detailed insights and AI-like suggestions.',
    uploadLabel: '1) Upload Your Resume',
    uploadInfo: 'Supported formats: <b>PDF</b>, <b>DOCX</b>, <b>TXT</b>. All processing happens securely in your browser—no data is sent to servers.',
    jdLabel: '2) Paste Job Description or Keywords',
    jdTip: 'Pro Tip: Include role-specific terms, skills, and tools for accurate matching. Advanced keyword extraction will handle the rest.',
    analyzeBtn: '<i class="fa fa-rocket me-1"></i> Analyze Now',
    clearBtn: '<i class="fa fa-trash me-1"></i> Clear',
    tipsTitle: 'Advanced Formatting Tips',
    tip1: 'Ensure your resume includes clear sections for Skills, Experience, Education. Add email, phone, and LinkedIn at the top for ATS parsing.',
    tip2: 'Integrate job-specific keywords naturally into your summary and achievements to boost matching scores.',
    tip3: 'Avoid tables, images, or fancy fonts. Use standard headings and bullet points for better compatibility.',
    resultsTitle: 'Analysis Results',
    resultsSubtitle: 'Detailed score breakdown, insights, and actionable recommendations.',
    matchedKeywords: 'Matched Keywords',
    missingKeywords: 'Missing / Suggested Keywords',
    resumePreview: 'Extracted Resume Preview (First 1,500 chars)',
    sectionChecks: 'Section & Formatting Checks',
    templateTitle: 'Example Resume Templates',
    template1: 'Optimized Technical Resume',
    template1Desc: 'Keyword-rich, quantifiable achievements, ATS-friendly structure.',
    template2: 'Simple Clean Resume',
    template2Desc: 'Minimalist design for quick edits and broad compatibility.'
  },
  hi: {
    title: 'रिज्यूमे ATS स्कोर चेकर',
    heroSubtitle: 'अपना रिज्यूमे (PDF / DOCX / TXT) अपलोड करें, जॉब डिस्क्रिप्शन या कीवर्ड्स पेस्ट करें, और विस्तृत अंतर्दृष्टि और AI-जैसे सुझावों के साथ उन्नत ATS संगतता स्कोर प्राप्त करें।',
    uploadLabel: '1) अपना रिज्यूमे अपलोड करें',
    uploadInfo: 'समर्थित प्रारूप: <b>PDF</b>, <b>DOCX</b>, <b>TXT</b>। सभी प्रोसेसिंग आपके ब्राउज़र में सुरक्षित रूप से होती है—कोई डेटा सर्वर पर नहीं भेजा जाता।',
    jdLabel: '2) जॉब डिस्क्रिप्शन या कीवर्ड्स पेस्ट करें',
    jdTip: 'प्रो टिप: सटीक मिलान के लिए भूमिका-विशिष्ट शब्द, कौशल और उपकरण शामिल करें। उन्नत कीवर्ड निष्कर्षण बाकी का ध्यान रखेगा।',
    analyzeBtn: '<i class="fa fa-rocket me-1"></i> अब विश्लेषण करें',
    clearBtn: '<i class="fa fa-trash me-1"></i> साफ करें',
    tipsTitle: 'उन्नत प्रारूपण सुझाव',
    tip1: 'सुनिश्चित करें कि आपके रिज्यूमे में कौशल, अनुभव, शिक्षा के लिए स्पष्ट अनुभाग शामिल हों। ATS पार्सिंग के लिए शीर्ष पर ईमेल, फोन और लिंक्डइन जोड़ें।',
    tip2: 'मिलान स्कोर बढ़ाने के लिए जॉब-विशिष्ट कीवर्ड्स को अपने सारांश और उपलब्धियों में स्वाभाविक रूप से शामिल करें।',
    tip3: 'टेबल, छवियों, या फैंसी फ़ॉन्ट से बचें। बेहतर संगतता के लिए मानक शीर्षक और बुलेट पॉइंट्स का उपयोग करें।',
    resultsTitle: 'विश्लेषण परिणाम',
    resultsSubtitle: 'विस्तृत स्कोर ब्रेकडाउन, अंतर्दृष्टि, और कार्रवाई योग्य सिफारिशें।',
    matchedKeywords: 'मिलान किए गए कीवर्ड्स',
    missingKeywords: 'गायब / सुझाए गए कीवर्ड्स',
    resumePreview: 'निकाला गया रिज्यूमे पूर्वावलोकन (पहले 1,500 अक्षर)',
    sectionChecks: 'अनुभाग और प्रारूपण जांच',
    templateTitle: 'उदाहरण रिज्यूमे टेम्पलेट',
    template1: 'अनुकूलित तकनीकी रिज्यूमे',
    template1Desc: 'कीवर्ड-समृद्ध, मात्रात्मक उपलब्धियां, ATS-अनुकूल संरचना।',
    template2: 'साधारण स्वच्छ रिज्यूमे',
    template2Desc: 'त्वरित संपादन और व्यापक संगतता के लिए न्यूनतम डिज़ाइन।'
  }
};

let currentLang = 'en';
const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  langToggle.innerHTML = `<i class="fa fa-language me-1"></i> ${currentLang === 'en' ? 'हिन्दी' : 'English'}`;
  updateLanguage();
});

function updateLanguage() {
  const t = translations[currentLang];
  document.querySelector('.hero h1').textContent = t.title;
  document.querySelector('.hero p.lead').textContent = t.heroSubtitle;
  document.querySelector('.card p.mb-3').innerHTML = t.uploadInfo;
  document.querySelector('.card h5.mb-3').textContent = t.uploadLabel;
  document.querySelector('.form-label.fw-semibold').textContent = t.jdLabel;
  document.querySelector('.form-text').textContent = t.jdTip;
  document.getElementById('analyze-btn').innerHTML = t.analyzeBtn;
  document.getElementById('clear-btn').innerHTML = t.clearBtn;
  document.querySelector('.card h6.mb-3').textContent = t.tipsTitle;
  document.querySelector('#collapseOne .accordion-body').textContent = t.tip1;
  document.querySelector('#collapseTwo .accordion-body').textContent = t.tip2;
  document.querySelector('#collapseThree .accordion-body').textContent = t.tip3;
  document.querySelector('.col-lg-7 .card h5.mb-1').textContent = t.resultsTitle;
  document.querySelector('.col-lg-7 .card .small-muted').textContent = t.resultsSubtitle;
  document.querySelectorAll('.fw-semibold')[1].textContent = t.matchedKeywords;
  document.querySelectorAll('.fw-semibold')[2].textContent = t.missingKeywords;
  document.querySelectorAll('.fw-semibold')[3].textContent = t.resumePreview;
  document.querySelectorAll('.fw-semibold')[4].textContent = t.sectionChecks;
  document.querySelector('.mt-4 h6.fw-bold').textContent = t.templateTitle;
  document.querySelectorAll('.template-card strong')[0].textContent = t.template1;
  document.querySelectorAll('.template-card p')[0].textContent = t.template1Desc;
  document.querySelectorAll('.template-card strong')[1].textContent = t.template2;
  document.querySelectorAll('.template-card p')[1].textContent = t.template2Desc;
}