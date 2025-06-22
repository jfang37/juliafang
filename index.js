// CONSTANTS
const section_btn_ids = [
    "about-me-btn", "experience-btn", "projects-btn", "contact-btn"
]
const section_ids = [
    "about-me", "experience", "projects", "contact"
]
const sec_map = new Map();
for (let i = 0; i < section_btn_ids.length; i++) {
    sec_map.set(section_btn_ids[i], section_ids[i]);
}
let isAnimating = true;

// ON PAGE INITIAL LOAD
const header = document.querySelector('.header')
const snow_julia = document.getElementById("snow-julia");
const julia_sitting = document.getElementById("julia-sitting");
const experience_items = document.querySelectorAll('.experience-item');
const section_btns = [...document.querySelectorAll('.section-btn')];
const sections = [...document.querySelectorAll('.section')];
const intro_btn = document.getElementById("intro-btn");
let active_sec = document.getElementById("intro");
let active_btn = null;
let active_item = null;

// NAVIGATION
intro_btn.addEventListener("click", () => {
    if (active_btn) {
        active_btn.classList.remove("active-section");
        active_btn = null;
    }
    window.scrollTo({top: 0, behavior: "smooth"});
})
section_btns.forEach((sec) => {
    sec.addEventListener('click', activateSection);
})

// INTERSECTION OBSERVER
let direction = 'up';
let prevYPosition = 0;

function shouldUpdate(entry, direction) {
    return (entry.isIntersecting && direction === 'up') ||
        (!entry.isIntersecting && direction === 'down');
}

const callback = (entries) => {
    entries.forEach((entry) => {
        if (window.scrollY > prevYPosition) {
            direction = 'down';
        } else {
            direction = 'up';
        }

        prevYPosition = window.scrollY;

        // if down and true, then activate target
        if (direction === 'down' && entry.isIntersecting) {
            const button_id = entry.target.id + "-btn";
            const button = document.getElementById(button_id);
            activateSectionButton(button);
        } else if (direction === 'up' && entry.isIntersecting) {
            const button_id = entry.target.id + "-btn";
            const button = document.getElementById(button_id);
            activateSectionButton(button);
        }
    })
}

const options = {
    rootMargin: "-75px",
    threshold: 0
}

if (window.innerWidth > 1024) {
    const observer = new IntersectionObserver(callback, options);
    sections.forEach((sec) => {
        observer.observe(sec);
    })
}

// FORM SUBMISSION
const form = document.getElementById('form');
const result = document.getElementById('result');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Please wait..."

    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
                result.innerHTML = "Form submitted successfully";
            } else {
                console.log(response);
                result.innerHTML = json.message;
            }
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
        })
        .then(function() {
            form.reset();
            setTimeout(() => {
                result.style.display = "none";
            }, 3000);
        });
});

// ANIMATE SNOW_JULIA
animate_snow_julia();

/*-------------------- FUNCTIONS ------------------ */
function animate_snow_julia() {
    snow_julia.animate(
        [
            { transform: 'translateX(150%)' },
            { transform: 'translateX(0%)' }
        ],
        {
            duration: 500,
            iterations: 1
        }
    )
}

// happens on click
function activateSection(e) {    
    activateSectionButton(e.target);

    // scroll into view
    const section_target = document.getElementById(sec_map.get(active_btn.id));
    section_target.scrollIntoView({behavior: "smooth"});
}

function activateSectionButton(section_btn) {
    // deactivate currently active button
    active_btn?.classList.remove("active-section");
    // set new active button
    active_btn = section_btn;
    active_btn.classList.add("active-section");
}