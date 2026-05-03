// Initialize localStorage
function initializeStorage() {
    if (!localStorage.getItem('leaveRequests')) {
        localStorage.setItem('leaveRequests', JSON.stringify([]));
    }
    if (!localStorage.getItem('employees')) {
        localStorage.setItem('employees', JSON.stringify([
            { id: 1, name: 'Aqeeb', department: 'IT' },
            { id: 2, name: 'Ahmed', department: 'HR' },
            { id: 3, name: 'Fatima', department: 'Finance' },
            { id: 4, name: 'Ali', department: 'Operations' },
            { id: 5, name: 'Zainab', department: 'IT' }
        ]));
    }
}

// Get all leave requests
function getLeaveRequests() {
    return JSON.parse(localStorage.getItem('leaveRequests')) || [];
}

// Save leave requests
function saveLeaveRequests(requests) {
    localStorage.setItem('leaveRequests', JSON.stringify(requests));
    updateDashboard();
}

// Add a new leave request
function addLeaveRequest(name, department, type, fromDate, toDate, reason) {
    const requests = getLeaveRequests();
    const newRequest = {
        id: Date.now(),
        name,
        department,
        type,
        fromDate,
        toDate,
        reason,
        status: 'Pending',
        appliedDate: new Date().toLocaleDateString()
    };
    requests.push(newRequest);
    saveLeaveRequests(requests);
    return newRequest;
}

// Update leave request status
function updateLeaveStatus(id, status) {
    const requests = getLeaveRequests();
    const request = requests.find(r => r.id === id);
    if (request) {
        request.status = status;
        saveLeaveRequests(requests);
    }
}

// Approve leave
function approve(id) {
    updateLeaveStatus(id, 'Approved');
    loadPendingRequests();
    alert('Leave Approved Successfully!');
}

// Reject leave
function reject(id) {
    updateLeaveStatus(id, 'Rejected');
    loadPendingRequests();
    alert('Leave Rejected Successfully!');
}

// Load pending requests for approval page
function loadPendingRequests() {
    const requests = getLeaveRequests().filter(r => r.status === 'Pending');
    const container = document.getElementById('pendingRequestsContainer');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (requests.length === 0) {
        container.innerHTML = '<p>No pending requests</p>';
        return;
    }
    
    requests.forEach(request => {
        const div = document.createElement('div');
        div.className = 'request';
        div.innerHTML = `
            <p><strong>${request.name}</strong> (${request.department})</p>
            <p>Leave Type: ${request.type}</p>
            <p>From: ${request.fromDate} To: ${request.toDate}</p>
            <p>Reason: ${request.reason}</p>
            <p>Applied: ${request.appliedDate}</p>
            <button onclick="approve(${request.id})" class="btn-approve">Approve</button>
            <button onclick="reject(${request.id})" class="btn-reject">Reject</button>
        `;
        container.appendChild(div);
    });
}

// Load leave history
function loadLeaveHistory() {
    const requests = getLeaveRequests();
    const tbody = document.getElementById('historyTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (requests.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No leave history</td></tr>';
        return;
    }
    
    requests.forEach(request => {
        const row = document.createElement('tr');
        const statusClass = `status-${request.status.toLowerCase()}`;
        row.innerHTML = `
            <td>${request.name}</td>
            <td>${request.department}</td>
            <td>${request.type}</td>
            <td>${request.fromDate} to ${request.toDate}</td>
            <td class="${statusClass}"><strong>${request.status}</strong></td>
            <td>${request.appliedDate}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update dashboard statistics
function updateDashboard() {
    const requests = getLeaveRequests();
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    const totalEmployees = employees.length;
    const totalLeaves = requests.length;
    const pendingLeaves = requests.filter(r => r.status === 'Pending').length;
    const approvedLeaves = requests.filter(r => r.status === 'Approved').length;
    const rejectedLeaves = requests.filter(r => r.status === 'Rejected').length;
    
    const dashboardCards = document.querySelectorAll('.dashboard-stat');
    if (dashboardCards.length > 0) {
        if (dashboardCards[0]) dashboardCards[0].textContent = `Total Employees: ${totalEmployees}`;
        if (dashboardCards[1]) dashboardCards[1].textContent = `Leaves Applied: ${totalLeaves}`;
        if (dashboardCards[2]) dashboardCards[2].textContent = `Pending: ${pendingLeaves}`;
        if (dashboardCards[3]) dashboardCards[3].textContent = `Approved: ${approvedLeaves}`;
        if (dashboardCards[4]) {
            dashboardCards[4].textContent = `Rejected: ${rejectedLeaves}`;
        }
    }
}

// Handle leave application form
function submitLeaveForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('employeeName').value;
    const department = document.getElementById('department').value;
    const type = document.getElementById('leaveType').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const reason = document.getElementById('reason').value;
    
    if (!name || !department || !fromDate || !toDate || !reason) {
        alert('Please fill all fields');
        return;
    }
    
    if (new Date(fromDate) > new Date(toDate)) {
        alert('From date cannot be after To date');
        return;
    }
    
    addLeaveRequest(name, department, type, fromDate, toDate, reason);
    alert('Leave application submitted successfully!');
    document.getElementById('leaveForm').reset();
    setTimeout(() => {
        window.location.href = 'history.html';
    }, 500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    updateDashboard();
    
    const leaveForm = document.getElementById('leaveForm');
    if (leaveForm) {
        leaveForm.addEventListener('submit', submitLeaveForm);
    }
    
    if (document.getElementById('pendingRequestsContainer')) {
        loadPendingRequests();
    }
    
    if (document.getElementById('historyTableBody')) {
        loadLeaveHistory();
    }
});
