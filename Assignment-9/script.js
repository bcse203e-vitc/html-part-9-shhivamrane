function openForm(service) {
    document.getElementById("appointmentForm").style.display = "block";
    document.getElementById("service").value = service;
}

function closeForm() {
    document.getElementById("appointmentForm").style.display = "none";
}

document.getElementById("bookingForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const dateTime = document.getElementById("dateTime").value.trim();
    const agree = document.getElementById("agree").checked;
    
    let valid = true;
    
    if (fullName === "") {
        valid = false;
        document.getElementById("nameError").textContent = "Full name is required.";
    } else {
        document.getElementById("nameError").textContent = "";
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        valid = false;
        document.getElementById("emailError").textContent = "Please enter a valid email.";
    } else {
        document.getElementById("emailError").textContent = "";
    }

    if (!/^\d{10}$/.test(phone)) {
        valid = false;
        document.getElementById("phoneError").textContent = "Phone number must be 10 digits.";
    } else {
        document.getElementById("phoneError").textContent = "";
    }

    if (new Date(dateTime) <= new Date()) {
        valid = false;
        document.getElementById("dateTimeError").textContent = "Please select a future date and time.";
    } else {
        document.getElementById("dateTimeError").textContent = "";
    }

    if (!agree) {
        valid = false;
        document.getElementById("agreeError").textContent = "You must agree to the terms.";
    } else {
        document.getElementById("agreeError").textContent = "";
    }
    
    if (valid) {
        const appointment = {
            name: fullName,
            service: document.getElementById("service").value,
            dateTime: dateTime,
            status: "Pending"
        };

        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert(`Thank you, ${fullName}! Your appointment for ${appointment.service} on ${new Date(appointment.dateTime).toLocaleString()} is confirmed.`);
        closeForm();
        loadAppointments();
    }
});

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const appointmentsTable = document.getElementById("appointments");
    
    appointmentsTable.innerHTML = "";

    appointments.forEach(app => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.service}</td>
            <td>${new Date(app.dateTime).toLocaleString()}</td>
            <td>${app.status}</td>
            <td><button class="status-update" onclick="updateStatus('${app.name}', '${app.service}')">Update Status</button></td>
        `;
        appointmentsTable.appendChild(row);
    });
}

function filterAppointments() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const statusFilter = document.getElementById("statusFilter").value;

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const filteredAppointments = appointments.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery) || app.service.toLowerCase().includes(searchQuery);
        const matchesStatus = statusFilter ? app.status === statusFilter : true;
        return matchesSearch && matchesStatus;
    });

    const appointmentsTable = document.getElementById("appointments");
    appointmentsTable.innerHTML = "";
    filteredAppointments.forEach(app => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${app.name}</td>
            <td>${app.service}</td>
            <td>${new Date(app.dateTime).toLocaleString()}</td>
            <td>${app.status}</td>
            <td><button class="status-update" onclick="updateStatus('${app.name}', '${app.service}')">Update Status</button></td>
        `;
        appointmentsTable.appendChild(row);
    });
}

function updateStatus(name, service) {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const updatedAppointments = appointments.map(app => {
        if (app.name === name && app.service === service) {
            app.status = app.status === "Pending" ? "Confirmed" : "Completed";
        }
        return app;
    });

    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    loadAppointments();
}

window.onload = loadAppointments;
