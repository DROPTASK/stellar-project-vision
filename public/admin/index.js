
// This file ensures proper loading of the CMS
console.log("Admin CMS initializing...");

// If there are issues loading the CMS directly, this can help with debugging
window.handleCMSError = function(error) {
  console.error("CMS Error:", error);
  document.getElementById('admin-root').innerHTML = `
    <div class="admin-login-form">
      <h1>Error loading CMS</h1>
      <p>${error.message || "Unknown error"}</p>
      <button onclick="location.reload()">Try Again</button>
    </div>
  `;
};
