'use strict';

// Initialize EmailJS with your public key
emailjs.init('7Yl7bQ7W4Nv2Dlipe');

// Element toggle function
const elementToggleFunc = function (elem) {
    elem.classList.toggle("active");
};

// Sidebar toggle functionality for mobile
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", function () {
    elementToggleFunc(sidebar);
});

// Testimonials modal functionality
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
};

testimonialsItem.forEach(item => {
    item.addEventListener("click", function () {
        modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
        modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
        modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
        modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
        testimonialsModalFunc();
    });
});

modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// Custom select and filter functionality
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");

select.addEventListener("click", function () {
    elementToggleFunc(this);
});

selectItems.forEach(item => {
    item.addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        elementToggleFunc(select);
        filterFunc(selectedValue);
    });
});

const filterFunc = function (selectedValue) {
    filterItems.forEach(item => {
        if (selectedValue === "all" || selectedValue === item.dataset.category) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

let lastClickedBtn = filterBtn[0];
filterBtn.forEach(btn => {
    btn.addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        selectValue.innerText = this.innerText;
        filterFunc(selectedValue);
        lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
    });
});

// Form validation and email sending functionality
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const btnText = document.getElementById('btn-text');

formInputs.forEach(input => {
    input.addEventListener("input", function () {
        if (form.checkValidity()) {
            formBtn.removeAttribute("disabled");
        } else {
            formBtn.setAttribute("disabled", "");
        }
    });
});

form.addEventListener('submit', function(event) {
    event.preventDefault();
    btnText.innerText = 'Sending...';
    const serviceID = 'service_44zkpos';  // Your serviceID
    const templateID = 'template_fh7w42f';  // Your templateID

    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            btnText.innerText = 'Send Email';
            alert('Sent!');
        }, (err) => {
            console.log(err);  // Log the error details for debugging
            btnText.innerText = 'Send Email';
            alert('Failed to send email. Please try again later.');
        })
        .finally(() => {
            document.querySelector('[name="fullname"]').value = "";
            document.querySelector('[name="email"]').value = "";
            document.querySelector('[name="message"]').value = "";
        });
});

// Page navigation functionality
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navigationLinks.forEach(link => {
    link.addEventListener("click", function () {
        pages.forEach(page => {
            if (this.innerHTML.toLowerCase() === page.dataset.page) {
                page.classList.add("active");
                navigationLinks.forEach(nav => nav.classList.remove("active"));
                link.classList.add("active");
                window.scrollTo(0, 0);
            } else {
                page.classList.remove("active");
            }
        });
    });
});

// Disable right-click functionality
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
});
