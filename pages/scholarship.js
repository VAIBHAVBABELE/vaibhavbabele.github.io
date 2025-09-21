document.addEventListener("DOMContentLoaded", () => {

  const scholarships = [
   
    { title: "Amazon Future Engineer Scholarship 2024-25", deadline: "2025-11-30", award: "Award up to 50,000 and other benefits", Eligibility: "Female students pursuing BE/B.Tech/Integrated M.Tech.", applyLink: "https://www.amazonfutureengineer.in/scholarship%20and%20internship-%202025", logo: "Logo-image/image0.png" },
    { title: "Reliance Foundation Scholarships 2025-26", deadline: "2025-10-4", award: "Up to 2,00,000", Eligibility: "For UG Students.", applyLink: "https://www.scholarships.reliancefoundation.org/UG_Scholarship.aspx", logo: "Logo-image/image1.png" },
    { title: "University of Delhi Financial Support Scheme (FSS) 2025-26", deadline: "2025-9-23", award: "Up to 100% fee waiver", Eligibility: "Full-time UG/PG students.", applyLink: "https://www.buddy4study.com/scholarship/university-of-delhi-financial-support-scheme-fss", logo: "Logo-image/image2.png" },
    { title: "Legrand Empowering Scholarship Program 2025-26", deadline: "2025-09-30", award: "60% of annual tuition fees up to INR 60,000 per year", Eligibility: "Girls pursuing B.Tech/B.E/B.Arch./B.B.A/B.Com.", applyLink: "https://www.buddy4study.com/page/legrand-empowering-scholarship-program", logo: "Logo-image/image3.png" },
    { title: "OakNorth STEM Scholarship Programme 2025-26", deadline: "2025-09-30", award: "INR 30,000 (one-time)", Eligibility: "Girl students pursuing UG courses in STEM.", applyLink: "https://www.buddy4study.com/page/oaknorth-stem-scholarship-program", logo: "Logo-image/image4.png" },
    { title: "Raman Kant Munjal Scholarships 2025-26", deadline: "2025-09-30", award: "Up to INR 5,50,000", Eligibility: "For students pursuing finance-related UG courses.", applyLink: "https://www.buddy4study.com/page/raman-kant-munjal-scholarships", logo: "Logo-image/image5.png" },
    { title: "Kotak Kanya Scholarship 2025-26", deadline: "2025-09-30", award: "INR 1.5 lakh* per year", Eligibility: "Meritorious girls in the first year of graduation programs.", applyLink: "https://www.buddy4study.com/page/kotak-kanya-scholarship", logo: "Logo-image/image6.png" },
    { title: "Legrand Empowering Scholarship Program 2025-26", deadline: "2025-09-30", award: "80% of annual course fees up to INR 1,00,000 per year", Eligibility: "Open to differently-abled girl students, Covid-affected students.", applyLink: "https://www.buddy4study.com/page/legrand-empowering-scholarship-program", logo: "Logo-image/image3.png" },
    { title: "IDFC FIRST Bank Engineering Scholarship 2025-29", deadline: "2025-09-30", award: "Scholarship of INR 1 Lakhs per year", Eligibility: "Open to students currently enrolled in the first year of their B.Tech or B.E. program.", applyLink: "https://www.buddy4study.com/page/idfc-first-bank-engineering-scholarship", logo: "Logo-image/image7.png" },
    { title: "Reliance Foundation Scholarships 2025-26", deadline: "2025-10-04", award: "Up to 6,00,000", Eligibility: "For PG students.", applyLink: "https://www.scholarships.reliancefoundation.org/PG_Scholarship.aspx", logo: "Logo-image/image1.png" },
    { title: "Deutsche Bank Engineering Scholarship 2025-26", deadline: "2025-10-05", award: "Up to 1,00,000 and other benefits", Eligibility: "Female engineering students.", applyLink: "https://www.buddy4study.com/scholarship/deutsche-bank-engineering-scholarship", logo: "Logo-image/image8.png" },
    { title: "JK Tyre Shiksha Sarthi Scholarship Program 2025-26", deadline: "2025-10-06", award: "Up to INR 25,000", Eligibility: "Open to female students and enrolled in general or professional undergraduate courses or diploma courses.", applyLink: "https://www.buddy4study.com/page/jk-tyre-shiksha-sarthi-scholarship-program", logo: "Logo-image/image9.png" },
    { title: "Infosys Foundation STEM Stars Scholarship Program 2025-26", deadline: "2025-10-30", award: "Up to INR 1 lakh per annum", Eligibility: "First-year girl students pursuing UG courses in STEM disciplines.", applyLink: "https://www.buddy4study.com/page/infosys-stem-stars-scholarship", logo: "Logo-image/image10.png" },
    { title: "Parivartan ECSS Programme 2025-26", deadline: "2025-10-30", award: "Up to INR 75,000", Eligibility: "Students pursuing postgraduate courses.", applyLink: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme", logo: "Logo-image/image11.png" },
    { title: "Parivartan ECSS Programme 2025-26", deadline: "2025-10-30", award: "Up to INR 50,000", Eligibility: "students pursuing undergraduate courses.", applyLink: "https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme", logo: "Logo-image/image11.png" },
    { title: "Dr. Reddy's Foundation Sashakt Scholarship 2025", deadline: "2025-10-30", award: "80,000 per year for 3 years", Eligibility: "Female students applying for B.Sc in Natural/Pure Sciences,B.Tech, or M.B.B.S degree programmes.", applyLink: "https://www.buddy4study.com/scholarship/sashakt-scholarship", logo: "Logo-image/image12.png" },
    { title: "All India Council For Technical Education (AICTE) Scholarships 2025-26", deadline: "2025-10-31", award: "50,000 per annum for every year of study", Eligibility: "Students pursuing diploma/degree courses.", applyLink: "https://www.buddy4study.com/page/all-india-council-for-technical-education-aicte-scholarships", logo: "Logo-image/image13.png" },
    { title: "NSP Mukhya Mantri Protsahan Yojana, Himachal Pradesh 2025-26", deadline: "2025-10-31", award: "A one-time award of 75,000", Eligibility: "Students of Himachal Pradesh enrolled in UG degree courses. ", applyLink: "https://www.buddy4study.com/page/scholarships-by-the-department-of-higher-education-govt-of-himachal-pradesh", logo: "Logo-image/image14.png" },
    { title: "U-Go Scholarship Program", deadline: "2025-10-31", award: "Up to INR 60000 per year for the length of the program", Eligibility: "For UG girl students pursuing professional courses.", applyLink: "https://www.buddy4study.com/page/ugo-scholarship-program", logo: "Logo-image/image15.png" },
    { title: "NSP University Grants Commission (UGC) Scholarships 2024-25", deadline: "2025-10-31", award: "15,000 per month for 10 months in a year", Eligibility: "Students pursuing a full-time regular PG program.", applyLink: "https://www.buddy4study.com/page/nsp-university-grants-commission-ugc-scholarships", logo: "Logo-image/image16.png" },
    { title: "SBI Platinum Jubilee Asha Scholarship 2025", deadline: "2025-11-15", award: "Up to INR 2,00,000 for one year", Eligibility: "students pursuing graduation from IITs.", applyLink: "https://www.buddy4study.com/page/sbi-asha-scholarship-program", logo: "Logo-image/image17.png" },
    { title: "SBI Platinum Jubilee Asha Scholarship 2025", deadline: "2025-11-15", award: "Up to INR 75,000", Eligibility: "students pursuing UG programmes.", applyLink: "https://www.buddy4study.com/page/sbi-asha-scholarship-program", logo: "Logo-image/image17.png" },
    { title: "State Merit Scholarship for UG/PG Students, Haryana 2025-26", deadline: "2025-11-30", award: "A monthly scholarship of up to 900", Eligibility: "students enrolled in Graduate, Postgraduate and Doctorate.", applyLink: "https://www.buddy4study.com/scholarship/state-merit-scholarship-for-ug-pg-students-haryana", logo: "Logo-image/image18.png" },
    { title: "Nirankari Rajmata Scholarship Scheme 2025-26", deadline: "2025-11-30", award: "Tuition fees up to 75,000 per annum", Eligibility: "1st Year students in selected courses.", applyLink: "https://www.buddy4study.com/scholarship/nirankari-rajmata-scholarship-scheme", logo: "Logo-image/image19.png" },
    { title: "Buddy4Study - IDFC FIRST Bank Education Loan Programme", deadline: "2025-12-31", award: "Collateral free loan amount of up to INR 40 lakh ", Eligibility: "For UG and PG students.", applyLink: "https://www.buddy4study.com/page/buddy4study-idfc-first-bank-education-loan-programme", logo: "Logo-image/image7.png" },
    { title: "Propelld Domestic Education Loan Programme", deadline: "2025-12-31", award: "Loan amount ranging from INR 50,000 to INR 10 Lakh", Eligibility: "UG and PG students.", applyLink: "https://www.buddy4study.com/page/buddy4study-propelld-domestic-education-loan-programme", logo: "Logo-image/image20.png" },
    { title: "ICICI Bank Education Loan Programme", deadline: "2025-12-31", award: "Loan up to INR 1 crore", Eligibility: "For UG, PG and PG diploma.", applyLink: "https://www.buddy4study.com/page/buddy4study-icici-bank-education-loan-programme", logo: "Logo-image/image21.png" },
    { title: "Axis Bank Domestic Education Loan Program", deadline: "2025-12-31", award: "Starting from INR 50,000 with no upper limit & funding up to 100%", Eligibility: "Students must have obtained admission to courses like Medicine, Engineering, Management, etc.", applyLink: "https://www.buddy4study.com/page/buddy4study-axis-bank-education-loan-program", logo: "Logo-image/image22.png" },
    { title: "ICICI Bank International Education Loan Programme", deadline: "2025-12-31", award: "Loan up to INR 2 crore ", Eligibility: "For UG, PG and PG diploma.", applyLink: "https://www.buddy4study.com/page/buddy4study-icici-bank-education-loan-programme", logo: "Logo-image/image21.png" },
    { title: "Charpak Exchange Scholarship 2025", deadline: "2025-10-15", award: "A living allowance of INR 89,018 approx and other benefits", Eligibility: "Bachelor's and Master's degree students.", applyLink: "https://www.buddy4study.com/scholarship/charpak-exchange-scholarship", logo: "Logo-image/image23.png" },
    { title: "Amity University Scholarship 2025", deadline: "2025-10-31", award: "Scholarship of up to 100% tuition fee wavier", Eligibility: "Students willing to pursue UG and PG studies at Amity University.", applyLink: "https://www.buddy4study.com/scholarship/amity-university-scholarship", logo: "Logo-image/image24.png" },
    { title: "Azim Premji Scholarship 2025", deadline: "2025-09-30", award: "30,000 per month", Eligibility: "Female UG applicants.", applyLink: "https://www.buddy4study.com/scholarship/azim-premji-scholarship", logo: "Logo-image/image25.png" },
    { title: "BPL Scholarship Scheme for College Students, Chhattisgarh 2025-26", deadline: "2025-09-30", award: "500/month for 10 months for PG | 330/month for 10 months for UG ", Eligibility: "Students studying in UG/PG level.", applyLink: "https://www.buddy4study.com/scholarship/bpl-scholarship-scheme-for-college-students-chhattisgarh", logo: "Logo-image/image26.png" },
    { title: "Swami Dayanand India Scholarship 2025-26", deadline: "2025-09-30", award: "Up to 50,000", Eligibility: "JEE/NEET passouts.", applyLink: "https://www.buddy4study.com/scholarship/swami-dayanand-india-scholarship", logo: "Logo-image/image27.png" },
    { title: "Knight Hennessy Scholars Scholarship, Stanford University 2026", deadline: "2025-10-08", award: "Multiple awards", Eligibility: "Students having a bachelor's degree.", applyLink: "https://www.buddy4study.com/scholarship/knight-hennessy-scholars-scholarship-stanford-university", logo: "Logo-image/image28.png" },
    { title: "Baba Gurbachan Singh Scholarship Scheme 2025-26", deadline: "2025-11-30", award: "50,000 per annum or tuition/annual fees payable in each year", Eligibility: "students pursuing degree and diploma courses.", applyLink: "https://www.buddy4study.com/scholarship/baba-gurbachan-singh-scholarship-scheme", logo: "Logo-image/image29.png" },


  ];

  const container = document.getElementById("cards-container");
  const searchInput = document.getElementById("search-input");

  function renderCards() {
    container.innerHTML = "";
    const today = new Date();
    const query = searchInput.value.toLowerCase();

    scholarships.forEach(item => {
      const fullText = (item.title + " " + item.provider + " " + item.award + " " + item.Eligibility).toLowerCase();
      if (!fullText.includes(query)) 
        return;

      const deadlineDate = new Date(item.deadline);
      let diffTime = deadlineDate - today;
      let daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let badgeClass = "deadline-badge";
      let badgeText = "";
      if (daysLeft > 0) {
        badgeText = `${daysLeft} day${daysLeft > 1 ? 's' : ''} to go`;
        if (daysLeft <= 7) badgeClass += " urgent";
      } else {
        badgeText = "Deadline Closed";
        badgeClass += " closed";
      }

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <div class="card-top">
          <img src="${item.logo || 'path/to/placeholder.png'}" alt="${item.provider} logo" class="logo" loading="lazy" onerror="this.style.display='none'">

          <div class="${badgeClass}">${badgeText}</div>
        </div>

        <div class="card-body">
         <h4>${item.title}</h4>
         <p class="deadline"><strong>Deadline:</strong> ${deadlineDate.toLocaleDateString()}</p>
         <p class="award">🏆<strong>Award:</strong> ${item.award}</p>  
         <p class="eligibility">🎓<strong>Eligibility:</strong> ${item.Eligibility}</p>
         <a href="${item.applyLink}" target="_blank" class="apply-btn" ${daysLeft <= 0 ? 'style="pointer-events:none; opacity:0.6;"' : ''}>Apply Now</a>

        </div> 
        `;

      container.appendChild(card);
    });
  }

  searchInput.addEventListener("input", renderCards);

  renderCards(); 
});

// =================== FAQs TOGGLE ===================
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    item.addEventListener("click", () => {
    item.classList.toggle("active"); 
    });
  });
});
