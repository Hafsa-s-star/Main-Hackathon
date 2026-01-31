// ______ Index.html START_____
function showLogin() {
    document.getElementById("signupBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function showSignup() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("signupBox").style.display = "block";
}

// SIGNUP
function signup() {
    let name = suName.value.trim();
    let email = suEmail.value.trim();
    let password = suPassword.value;
    let confirm = suConfirm.value;

    // Empty fields check
    if (!name || !email || !password || !confirm) {
        Swal.fire("Missing Fields", "Please fill all fields", "warning");
        return;
    }

    // Password match check
    if (password !== confirm) {
        Swal.fire("Password Error", "Passwords do not match", "error");
        return;
    }

    if (!isValidEmail(email)) {
        Swal.fire("Invalid Email", "Please enter a valid email address", "error");
        return;
    }

    // Save user
    let user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    Swal.fire("Success", "Account created successfully!", "success").then((result) => {
        if (result.isConfirmed) {
            window.location.href = "dashboard.html";
        }
    });
}

// LOGIN
function login() {
    let email = liEmail.value.trim();
    let password = liPassword.value;

    if (!email || !password) {
        Swal.fire("Missing Fields", "Please enter email and password", "warning");
        return;
    }

    let savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
        Swal.fire("No Account", "Please sign up first", "info");
        return;
    }

    if (!isValidEmail(email)) {
        Swal.fire("Invalid Email", "Please enter a valid email", "error");
        return;
    }

    if (email === savedUser.email && password === savedUser.password) {
        Swal.fire("Welcome 🎉", "Login successful", "success").then((result) => {
            if (result.isConfirmed) {
                window.location.href = "dashboard.html";
            }
        });
    } else {
        Swal.fire("Login Failed", "Invalid email or password", "error");
    }
}

function isValidEmail(email) {
    let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

//  _____ Index.html END______

// _______ Dashboard.html START_______
// Protect dashboard (important)
let user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "index.html"; // login page
}

function createResume() {
    Swal.fire("Create Resume", "Redirect to resume builder page", "info");
    window.location.href = "create-resume.html";
}

function viewResumes() {
    Swal.fire("My Resumes", "Redirect to resume list page", "info");
    window.location.href = "my-resumes.html";
}

function logout() {
    Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("user");   // clear login
            window.location.replace("index.html"); // go to login
        }
    });
}

let myUser = JSON.parse(localStorage.getItem("user"));
if (!myUser) {
  window.location.replace("index.html");
}

// _____ Dashboard.html END______

// ______Create-resume.html START______
 window.onload = function() {
  const editResume = JSON.parse(localStorage.getItem("editResume"));
  if(editResume){
    // Fill form fields
    document.getElementById("fullName").value = editResume.fullName;
    document.getElementById("email").value = editResume.email;
    document.getElementById("country").value = editResume.country;
    document.getElementById("city").value = editResume.city;
    document.getElementById("profession").value = editResume.profession;
    document.getElementById("education").value = editResume.education;
    document.getElementById("experience").value = editResume.experience;
    document.getElementById("skills").value = editResume.skills;
    document.getElementById("languages").value = editResume.languages;
    document.getElementById("conclusion").value = editResume.conclusion;

    // Store the id in a hidden field so applyTemplate knows it
    document.getElementById("resumeId").value = editResume.id;

    // Remove after prefill to avoid conflict
    localStorage.removeItem("editResume");
  }
}

// Templates
  function applyTemplate(templateNumber) {
  // Get form data
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const country = document.getElementById("country").value;
  const city = document.getElementById("city").value;
  const profession = document.getElementById("profession").value;
  const education = document.getElementById("education").value;
  const experience = document.getElementById("experience").value;
  const skills = document.getElementById("skills").value;
  const languages = document.getElementById("languages").value;
  const conclusion = document.getElementById("conclusion").value;
  const resumeId = document.getElementById("resumeId").value; // get id if editing

  // Validate fields
  if (!fullName || !email || !country || !city || !profession || !education || !experience || !skills || !languages || !conclusion) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: '❌ Please fill all fields before selecting a template!',
      confirmButtonColor: '#3085d6'
    });
    return;
  }

  let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

  if (resumeId) {
    // Edit existing resume
    resumes = resumes.map(r => {
      if (r.id == resumeId) { // match by id
        return {
          ...r,
          fullName,
          email,
          country,
          city,
          profession,
          education,
          experience,
          skills,
          languages,
          conclusion,
          template: templateNumber
        };
      }
      return r;
    });
  } else {
    // Create new resume
    const newResume = {
      id: Date.now(),
      fullName,
      email,
      country,
      city,
      profession,
      education,
      experience,
      skills,
      languages,
      conclusion,
      template: templateNumber
    };
    resumes.push(newResume);
  }

  localStorage.setItem("resumes", JSON.stringify(resumes));

  // Redirect
  window.location.href = "my-resumes.html";
}


// ______ create-resume.html END______

// ______ my-resumes.html START______
 const resumesList = document.getElementById("resumesList");
let resumes = JSON.parse(localStorage.getItem("resumes")) || [];

if (resumes.length === 0) {
  resumesList.innerHTML = "<p>No resumes found. Create one first.</p>";
} else {
  resumesList.innerHTML = resumes.map(resume => `
    <div class="col-md-6">
      <div class="card p-3 shadow-sm" style="border-left: 8px solid ${getAccent(resume.template)};">
        <h3 style="color:${getAccent(resume.template)};">${resume.fullName}</h3>
        <p><strong>Profession:</strong> ${resume.profession}</p>
        <p><strong>Email:</strong> ${resume.email}</p>
        <p><strong>Location:</strong> ${resume.city}, ${resume.country}</p>
        <hr>
        <p><strong>Education:</strong> ${resume.education}</p>
        <p><strong>Experience:</strong> ${resume.experience}</p>
        <p><strong>Skills:</strong> ${resume.skills}</p>
        <p><strong>Languages:</strong> ${resume.languages}</p>
        <p><strong>Profile Summary:</strong> ${resume.conclusion}</p>
        <div class="mt-2">
          <button class="btn btn-primary btn-sm me-2" onclick="editResume(${resume.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteResume(${resume.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Helper function to get accent color for template
function getAccent(templateNumber){
  switch(templateNumber){
    case 1: return "#ff7e5f"; // Classic
    case 2: return "#2575fc"; // Modern
    case 3: return "#ffd200"; // Minimalist
    case 4: return "#006064"; // Professional
    default: return "#333";
  }
}

// Edit resume
function editResume(id){
  const resumes = JSON.parse(localStorage.getItem("resumes")) || [];
  const resume = resumes.find(r => r.id === id);
  if(resume){
    localStorage.setItem("editResume", JSON.stringify(resume));
    window.location.href = "create-resume.html"; // redirect to form with data
  }
}

// Delete resume
function deleteResume(id){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let resumes = JSON.parse(localStorage.getItem("resumes")) || [];
      resumes = resumes.filter(r => r.id !== id);
      localStorage.setItem("resumes", JSON.stringify(resumes));
      Swal.fire('Deleted!', 'Your resume has been deleted.', 'success').then(()=>{
        location.reload();
      });
    }
  });
}

function backToCreate() {
    window.location.href = "create-resume.html";
}
//   _________ my-resume END________