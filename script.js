// ===== DOM ELEMENTS =====
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const errorDiv = document.getElementById("error");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const paginationDiv = document.getElementById("pagination");

// ===== GLOBAL VARIABLES =====
let allJobs = [];
let currentPage = 1;
const jobsPerPage = 20;

// ===== API FUNCTIONS =====
async function fetchJobs(keyword = "", category = "") {
  try {
    // Show loading state
    resultsDiv.innerHTML = "Loading...";
    errorDiv.classList.add("hidden");
    paginationDiv.classList.add("hidden");

    // Build API URL with search parameters
    let url = `https://remotive.com/api/remote-jobs?`;
    const params = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (keyword) params.push(`search=${encodeURIComponent(keyword)}`);
    params.push(`limit=100`);
    url += params.join("&");

    // Fetch data from API
    const res = await fetch(url);
    const data = await res.json();

    // Handle empty results
    if (!data.jobs || data.jobs.length === 0) {
      resultsDiv.innerHTML = "";
      errorDiv.textContent = "No results found.";
      errorDiv.classList.remove("hidden");
      paginationDiv.classList.add("hidden");
      allJobs = [];
      return;
    }

    // Store jobs and display first page
    allJobs = data.jobs;
    currentPage = 1;
    displayCurrentPage();
  } catch (error) {
    // Handle API errors
    resultsDiv.innerHTML = "";
    errorDiv.textContent = "Failed to fetch jobs. Please try again.";
    errorDiv.classList.remove("hidden");
    paginationDiv.classList.add("hidden");
    allJobs = [];
  }
}

/**
 * Perform search with current input values
 */
function performSearch() {
  fetchJobs(searchInput.value, categorySelect.value);
}

// ===== DISPLAY FUNCTIONS =====

/**
 * Display the current page of jobs
 */
function displayCurrentPage() {
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);

  // Handle empty results
  if (allJobs.length === 0) {
    resultsDiv.innerHTML = "";
    paginationDiv.classList.add("hidden");
    return;
  }

  // Calculate which jobs to show on current page
  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  const jobsToShow = allJobs.slice(start, end);

  // Display jobs and update pagination
  displayJobs(jobsToShow);
  updatePagination(totalPages);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatJobType(jobType) {
  return jobType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function displayJobs(jobs) {
  resultsDiv.innerHTML = "";

  jobs.forEach((job, idx) => {
    const jobEl = document.createElement("div");
    jobEl.classList.add("job");

    // Create tags HTML (show first 3 tags, indicate if more exist)
    const tagsHtml =
      job.tags && job.tags.length > 0
        ? `<div class="job-tags">${job.tags
            .slice(0, 3)
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}${
            job.tags.length > 3
              ? `<span class="tag-more">+${job.tags.length - 3}</span>`
              : ""
          }</div>`
        : "";

    // Create salary HTML if available
    const salaryHtml = job.salary
      ? `<div class="job-salary">💰 ${job.salary}</div>`
      : `<div class="job-salary">Unknown Salary</div>`;

    // Build job card HTML
    jobEl.innerHTML = `
      <div class="job-header">
        <div class="job-logo">
          <img src="${job.company_logo}" alt="${
      job.company_name
    }" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="logo-fallback">${job.company_name
            .charAt(0)
            .toUpperCase()}</div>
        </div>
        <div class="job-info">
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company_name}</div>
          <div class="job-meta">
            <span class="job-category">${job.category}</span> • 
            <span class="job-type">${formatJobType(job.job_type)}</span> • 
            <span class="job-location">${job.candidate_required_location}</span>
          </div>
          <div class="job-date">📅 Posted ${formatDate(
            job.publication_date
          )}</div>
        </div>
      </div>
      
      ${tagsHtml}
      ${salaryHtml}
      
      <div class="job-actions">
        <button class="preview-btn" onclick="previewJob(${
          job.id
        })">👁️ Preview</button>
        <a class="apply-btn" href="${
          job.url
        }" target="_blank" rel="noopener">Apply Now</a>
      </div>
    `;

    resultsDiv.appendChild(jobEl);
  });
}

// ===== MODAL FUNCTIONS =====

function previewJob(jobId) {
  const job = allJobs.find((j) => j.id === jobId);
  if (!job) return;

  // Create modal HTML
  const modal = document.createElement("div");
  modal.className = "job-modal";
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-logo">
            <img src="${job.company_logo}" alt="${
    job.company_name
  }" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div class="logo-fallback">${job.company_name
              .charAt(0)
              .toUpperCase()}</div>
          </div>
          <div class="modal-job-info">
            <h2>${job.title}</h2>
            <h3>${job.company_name}</h3>
            <div class="modal-meta">
              <span>${job.category}</span> • 
              <span>${formatJobType(job.job_type)}</span> • 
              <span>${job.candidate_required_location}</span>
            </div>
            <div class="modal-date">Posted ${formatDate(
              job.publication_date
            )}</div>
          </div>
          <button class="modal-close" onclick="closeModal()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="modal-tags">
            ${
              job.tags
                ? job.tags
                    .map((tag) => `<span class="tag">${tag}</span>`)
                    .join("")
                : ""
            }
          </div>
          ${
            job.salary
              ? `<div class="modal-salary">💰 Salary: ${job.salary}</div>`
              : ""
          }
          <div class="modal-description">
            ${job.description}
          </div>
        </div>
        
        <div class="modal-footer">
          <a class="apply-btn" href="${
            job.url
          }" target="_blank" rel="noopener">Apply Now</a>
        </div>
      </div>
    </div>
  `;

  // Add modal to page and prevent body scroll
  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";
}

/**
 * Close the job preview modal
 */
function closeModal() {
  const modal = document.querySelector(".job-modal");
  if (modal) {
    modal.remove();
    document.body.style.overflow = "auto";
  }
}

// ===== PAGINATION FUNCTIONS =====

function updatePagination(totalPages) {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
  paginationDiv.classList.remove("hidden");
}

// ===== EVENT LISTENERS =====

// Previous page button
prevPageBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayCurrentPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Next page button
nextPageBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(allJobs.length / jobsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayCurrentPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// Search button click
searchBtn.addEventListener("click", performSearch);

// Enter key press in search input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

// Category change
categorySelect.addEventListener("change", () => {
  performSearch();
});

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

// ===== INITIALIZATION =====
// Load initial jobs when page loads
fetchJobs();
