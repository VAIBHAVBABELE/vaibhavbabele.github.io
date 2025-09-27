// Performance Analytics JavaScript with Firebase Integration

class PerformanceAnalyticsFirebase {
    constructor() {
        this.grades = [];
        this.attendance = [];
        this.goals = [];
        this.studyTime = [];
        this.charts = {};
        this.unsubscribe = {
            grades: null,
            attendance: null,
            goals: null,
            studyTime: null
        };
        this.init();
    }

    async init() {
        // Wait for authentication to be ready
        await this.waitForAuthentication();
        
        // Check if user is authenticated
        if (!window.utils || !window.utils.isAuthenticated()) {
            this.showLoginRequired();
            return;
        }

        await this.setupEventListeners();
        await this.loadData();
        this.updateStats();
        this.renderCharts();
        this.renderGoals();
        this.renderGrades();
        this.generateInsights();
    }

    async waitForAuthentication() {
        return new Promise((resolve) => {
            if (window.currentUser) {
                resolve();
                return;
            }
            
            // Wait for auth state change
            const checkAuth = () => {
                if (window.currentUser) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 100);
                }
            };
            checkAuth();
        });
    }
    showLoginRequired() {
        const container = document.querySelector('.main');
        if (container) {
            container.innerHTML = `
                <div class="login-required">
                    <div class="login-required-content">
                        <i class="fas fa-lock"></i>
                        <h2>Login Required</h2>
                        <p>Please login to access the Performance Analytics</p>
                        <button class="btn btn-primary" onclick="window.location.href='../pages/auth.html'">
                            <i class="fas fa-sign-in-alt"></i>
                            Login Now
                        </button>
                    </div>
                </div>
            `;
        }
    }

    async setupEventListeners() {
        // Set current date for forms
        const today = new Date().toISOString().slice(0, 10);
        const gradeDateInput = document.getElementById('gradeDate');
        const attendanceDateInput = document.getElementById('attendanceDate');
        
        if (gradeDateInput) gradeDateInput.value = today;
        if (attendanceDateInput) attendanceDateInput.value = today;

        // Auto-save on form changes
        const gradeForm = document.getElementById('gradeForm');
        const attendanceForm = document.getElementById('attendanceForm');
        const goalForm = document.getElementById('goalForm');

        if (gradeForm) {
            gradeForm.addEventListener('input', this.debounce(() => {
                // Auto-save functionality can be added here if needed
                console.log('Form input changed');
            }, 1000));
        }

        if (attendanceForm) {
            attendanceForm.addEventListener('input', this.debounce(() => {
                // Auto-save functionality can be added here if needed
                console.log('Form input changed');
            }, 1000));
        }

        if (goalForm) {
            goalForm.addEventListener('input', this.debounce(() => {
                // Auto-save functionality can be added here if needed
                console.log('Form input changed');
            }, 1000));
        }
    }

    // Load data from Firebase
    async loadData() {
        try {
            if (!window.dbFunctions) {
                console.error('Firebase not initialized');
                return;
            }

            // Set up real-time listeners for all collections with user-specific data
            console.log('Setting up real-time listeners for user:', window.currentUser?.uid);
            
            this.unsubscribe.grades = window.dbFunctions.listenToCollection('grades', (grades) => {
                console.log('Real-time grades update received:', grades.length, 'grades for user');
                this.grades = grades;
                this.updateStats();
                this.renderCharts();
                this.renderGrades();
                this.generateInsights();
            }, window.currentUser?.uid);

            // Also manually load grades once
            const gradesResult = await window.dbFunctions.getDocuments('grades');
            if (gradesResult.success) {
                console.log('Manually loaded grades:', gradesResult.data.length);
                this.grades = gradesResult.data;
            }

            this.unsubscribe.attendance = window.dbFunctions.listenToCollection('attendance', (attendance) => {
                console.log('Real-time attendance update received:', attendance.length, 'attendance records for user');
                this.attendance = attendance;
                this.updateStats();
                this.renderCharts();
                this.generateInsights();
            }, window.currentUser?.uid);

            // Also manually load attendance once
            const attendanceResult = await window.dbFunctions.getDocuments('attendance');
            if (attendanceResult.success) {
                console.log('Manually loaded attendance:', attendanceResult.data.length);
                this.attendance = attendanceResult.data;
            }

            this.unsubscribe.goals = window.dbFunctions.listenToCollection('goals', (goals) => {
                console.log('Real-time goals update received:', goals.length, 'goals for user');
                this.goals = goals;
                this.renderGoals();
                this.generateInsights();
            }, window.currentUser?.uid);

            // Also manually load goals once
            const goalsResult = await window.dbFunctions.getDocuments('goals');
            if (goalsResult.success) {
                console.log('Manually loaded goals:', goalsResult.data.length);
                this.goals = goalsResult.data;
            }

            this.unsubscribe.studyTime = window.dbFunctions.listenToCollection('studyTime', (studyTime) => {
                console.log('Real-time study time update received:', studyTime.length, 'study time records for user');
                this.studyTime = studyTime;
                this.renderCharts();
            }, window.currentUser?.uid);

        } catch (error) {
            console.error('Error loading data:', error);
            window.utils.showNotification('Error loading data', 'error');
        }
    }

    // Save grade to Firebase
    async saveGrade() {
        const form = document.getElementById('gradeForm');
        if (!form || !form.checkValidity()) {
            if (form) form.reportValidity();
            return;
        }

        if (!window.utils.isAuthenticated()) {
            window.utils.showNotification('Please login to save grades', 'warning');
            return;
        }

        // Get form elements safely
        const getElementValue = (id) => {
            const element = document.getElementById(id);
            return element ? (element.value || '') : '';
        };

        const gradeData = {
            subject: getElementValue('gradeSubject'),
            type: getElementValue('gradeType'),
            title: getElementValue('gradeTitle'),
            value: getElementValue('gradeValue'),
            date: getElementValue('gradeDate'),
            maxMarks: getElementValue('gradeMaxMarks') || null,
            notes: getElementValue('gradeNotes')
        };

        try {
            const result = await window.dbFunctions.addDocument('grades', gradeData);
            
            if (result.success) {
                window.utils.showNotification('Grade added successfully!', 'success');
                
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addGradeModal'));
                if (modal) modal.hide();
                form.reset();
                this.setCurrentDate();
            } else {
                window.utils.showNotification('Error saving grade: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error saving grade:', error);
            window.utils.showNotification('Error saving grade', 'error');
        }
    }

    // Delete grade from Firebase
    async deleteGrade(gradeId) {
        if (!confirm('Are you sure you want to delete this grade?')) {
            return;
        }

        try {
            const result = await window.dbFunctions.deleteDocument('grades', gradeId);
            
            if (result.success) {
                window.utils.showNotification('Grade deleted successfully!', 'success');
            } else {
                window.utils.showNotification('Error deleting grade: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting grade:', error);
            window.utils.showNotification('Error deleting grade', 'error');
        }
    }

    // Save attendance to Firebase
    async saveAttendance() {
        const form = document.getElementById('attendanceForm');
        if (!form || !form.checkValidity()) {
            if (form) form.reportValidity();
            return;
        }

        if (!window.utils.isAuthenticated()) {
            window.utils.showNotification('Please login to save attendance', 'warning');
            return;
        }

        // Get form elements safely
        const getElementValue = (id) => {
            const element = document.getElementById(id);
            return element ? (element.value || '') : '';
        };

        const attendanceData = {
            subject: getElementValue('attendanceSubject'),
            date: getElementValue('attendanceDate'),
            status: getElementValue('attendanceStatus'),
            notes: getElementValue('attendanceNotes')
        };

        try {
            const result = await window.dbFunctions.addDocument('attendance', attendanceData);
            
            if (result.success) {
                window.utils.showNotification('Attendance updated successfully!', 'success');
                
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addAttendanceModal'));
                if (modal) modal.hide();
                form.reset();
                this.setCurrentDate();
            } else {
                window.utils.showNotification('Error saving attendance: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            window.utils.showNotification('Error saving attendance', 'error');
        }
    }

    // Save goal to Firebase
    async saveGoal() {
        const form = document.getElementById('goalForm');
        if (!form || !form.checkValidity()) {
            if (form) form.reportValidity();
            return;
        }

        if (!window.utils.isAuthenticated()) {
            window.utils.showNotification('Please login to save goals', 'warning');
            return;
        }

        // Get form elements safely
        const getElementValue = (id) => {
            const element = document.getElementById(id);
            return element ? (element.value || '') : '';
        };

        const goalData = {
            title: getElementValue('goalTitle'),
            subject: getElementValue('goalSubject'),
            target: getElementValue('goalTarget'),
            deadline: getElementValue('goalDeadline'),
            description: getElementValue('goalDescription'),
            progress: 0,
            status: 'active'
        };

        try {
            const result = await window.dbFunctions.addDocument('goals', goalData);
            
            if (result.success) {
                window.utils.showNotification('Goal added successfully!', 'success');
                
                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('addGoalModal'));
                if (modal) modal.hide();
                form.reset();
                this.setCurrentDate();
            } else {
                window.utils.showNotification('Error saving goal: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error saving goal:', error);
            window.utils.showNotification('Error saving goal', 'error');
        }
    }

    // Update goal progress
    async updateGoalProgress(goalId, progress) {
        try {
            const result = await window.dbFunctions.updateDocument('goals', goalId, {
                progress: Math.min(100, Math.max(0, progress)),
                status: progress >= 100 ? 'completed' : 'active'
            });
            
            if (result.success) {
                window.utils.showNotification('Goal progress updated!', 'success');
            } else {
                window.utils.showNotification('Error updating goal: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error updating goal:', error);
            window.utils.showNotification('Error updating goal', 'error');
        }
    }

    // Delete goal
    async deleteGoal(goalId) {
        if (!confirm('Are you sure you want to delete this goal?')) {
            return;
        }

        try {
            const result = await window.dbFunctions.deleteDocument('goals', goalId);
            
            if (result.success) {
                window.utils.showNotification('Goal deleted successfully!', 'success');
            } else {
                window.utils.showNotification('Error deleting goal: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
            window.utils.showNotification('Error deleting goal', 'error');
        }
    }

    // Statistics calculation
    updateStats() {
        this.updateOverallGPA();
        this.updateBestSubject();
        this.updateImprovement();
        this.updateAttendance();
    }

    updateOverallGPA() {
        if (this.grades.length === 0) {
            const element = document.getElementById('overallGPA');
            if (element) element.textContent = '0.00';
            return;
        }

        const numericGrades = this.grades.map(grade => this.parseGrade(grade.value)).filter(g => g !== null);
        if (numericGrades.length === 0) {
            const element = document.getElementById('overallGPA');
            if (element) element.textContent = '0.00';
            return;
        }

        const average = numericGrades.reduce((sum, grade) => sum + grade, 0) / numericGrades.length;
        const element = document.getElementById('overallGPA');
        if (element) element.textContent = average.toFixed(2);
    }

    updateBestSubject() {
        if (this.grades.length === 0) {
            const element = document.getElementById('bestSubject');
            if (element) element.textContent = '-';
            return;
        }

        const subjectAverages = {};
        this.grades.forEach(grade => {
            const numericGrade = this.parseGrade(grade.value);
            if (numericGrade !== null) {
                if (!subjectAverages[grade.subject]) {
                    subjectAverages[grade.subject] = { sum: 0, count: 0 };
                }
                subjectAverages[grade.subject].sum += numericGrade;
                subjectAverages[grade.subject].count += 1;
            }
        });

        let bestSubject = '-';
        let bestAverage = 0;

        Object.keys(subjectAverages).forEach(subject => {
            const average = subjectAverages[subject].sum / subjectAverages[subject].count;
            if (average > bestAverage) {
                bestAverage = average;
                bestSubject = subject;
            }
        });

        const element = document.getElementById('bestSubject');
        if (element) element.textContent = bestSubject;
    }

    updateImprovement() {
        if (this.grades.length < 2) {
            const element = document.getElementById('improvement');
            if (element) element.textContent = '0%';
            return;
        }

        const sortedGrades = this.grades
            .map(grade => ({ ...grade, numericGrade: this.parseGrade(grade.value) }))
            .filter(grade => grade.numericGrade !== null)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (sortedGrades.length < 2) {
            const element = document.getElementById('improvement');
            if (element) element.textContent = '0%';
            return;
        }

        const firstHalf = sortedGrades.slice(0, Math.floor(sortedGrades.length / 2));
        const secondHalf = sortedGrades.slice(Math.floor(sortedGrades.length / 2));

        const firstAverage = firstHalf.reduce((sum, grade) => sum + grade.numericGrade, 0) / firstHalf.length;
        const secondAverage = secondHalf.reduce((sum, grade) => sum + grade.numericGrade, 0) / secondHalf.length;

        const improvement = ((secondAverage - firstAverage) / firstAverage) * 100;
        const element = document.getElementById('improvement');
        if (element) element.textContent = `${improvement >= 0 ? '+' : ''}${improvement.toFixed(1)}%`;
    }

    updateAttendance() {
        if (this.attendance.length === 0) {
            const element = document.getElementById('attendance');
            if (element) element.textContent = '0%';
            return;
        }

        const presentCount = this.attendance.filter(a => a.status === 'Present').length;
        const totalCount = this.attendance.length;
        const attendancePercentage = (presentCount / totalCount) * 100;

        const element = document.getElementById('attendance');
        if (element) element.textContent = `${attendancePercentage.toFixed(1)}%`;
    }

    parseGrade(gradeValue) {
        if (!gradeValue) return null;

        // Handle percentage grades (e.g., "85%", "85")
        const percentageMatch = gradeValue.match(/(\d+(?:\.\d+)?)/);
        if (percentageMatch) {
            const value = parseFloat(percentageMatch[1]);
            if (value >= 0 && value <= 100) {
                return value;
            }
        }

        // Handle letter grades
        const letterGrades = {
            'A+': 95, 'A': 90, 'A-': 85,
            'B+': 80, 'B': 75, 'B-': 70,
            'C+': 65, 'C': 60, 'C-': 55,
            'D+': 50, 'D': 45, 'D-': 40,
            'F': 0
        };

        const upperGrade = gradeValue.toUpperCase().trim();
        if (letterGrades[upperGrade] !== undefined) {
            return letterGrades[upperGrade];
        }

        // Handle GPA scale (0-4 or 0-10)
        const gpaMatch = gradeValue.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
        if (gpaMatch) {
            const obtained = parseFloat(gpaMatch[1]);
            const total = parseFloat(gpaMatch[2]);
            if (total > 0) {
                return (obtained / total) * 100;
            }
        }

        return null;
    }

    // Chart rendering
    renderCharts() {
        this.renderTrendsChart();
        this.renderSubjectChart();
        this.renderAttendanceChart();
        this.renderStudyTimeChart();
    }

    renderTrendsChart() {
        const ctx = document.getElementById('trendsChart');
        if (!ctx) return;
        
        if (this.charts.trends) {
            this.charts.trends.destroy();
        }

        const period = document.getElementById('trendPeriod')?.value || 'all';
        const filteredGrades = this.filterGradesByPeriod(period);

        if (filteredGrades.length === 0) {
            this.showEmptyChart(ctx, 'No grade data available');
            return;
        }

        const labels = filteredGrades.map(grade => {
            const date = new Date(grade.date);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const data = filteredGrades.map(grade => this.parseGrade(grade.value)).filter(g => g !== null);

        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Grade Trend',
                    data: data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderSubjectChart() {
        const ctx = document.getElementById('subjectChart');
        if (!ctx) return;
        
        if (this.charts.subject) {
            this.charts.subject.destroy();
        }

        if (this.grades.length === 0) {
            this.showEmptyChart(ctx, 'No subject data available');
            return;
        }

        const subjectAverages = {};
        this.grades.forEach(grade => {
            const numericGrade = this.parseGrade(grade.value);
            if (numericGrade !== null) {
                if (!subjectAverages[grade.subject]) {
                    subjectAverages[grade.subject] = { sum: 0, count: 0 };
                }
                subjectAverages[grade.subject].sum += numericGrade;
                subjectAverages[grade.subject].count += 1;
            }
        });

        const labels = Object.keys(subjectAverages);
        const data = labels.map(subject => {
            const avg = subjectAverages[subject].sum / subjectAverages[subject].count;
            return avg;
        });

        const colors = [
            '#667eea', '#764ba2', '#28a745', '#ffc107', 
            '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14'
        ];

        this.charts.subject = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderAttendanceChart() {
        const ctx = document.getElementById('attendanceChart');
        if (!ctx) return;
        
        if (this.charts.attendance) {
            this.charts.attendance.destroy();
        }

        if (this.attendance.length === 0) {
            this.showEmptyChart(ctx, 'No attendance data available');
            return;
        }

        const last30Days = this.attendance.filter(a => {
            const date = new Date(a.date);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return date >= thirtyDaysAgo;
        });

        const dailyAttendance = {};
        last30Days.forEach(record => {
            if (!dailyAttendance[record.date]) {
                dailyAttendance[record.date] = { present: 0, total: 0 };
            }
            dailyAttendance[record.date].total += 1;
            if (record.status === 'Present') {
                dailyAttendance[record.date].present += 1;
            }
        });

        const labels = Object.keys(dailyAttendance).sort();
        const data = labels.map(date => {
            const day = dailyAttendance[date];
            return day.total > 0 ? (day.present / day.total) * 100 : 0;
        });

        this.charts.attendance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                datasets: [{
                    label: 'Attendance %',
                    data: data,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: '#28a745',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderStudyTimeChart() {
        const ctx = document.getElementById('studyTimeChart');
        if (!ctx) return;
        
        if (this.charts.studyTime) {
            this.charts.studyTime.destroy();
        }

        // Generate sample study time data if none exists
        if (this.studyTime.length === 0) {
            this.generateSampleStudyTime();
            return;
        }

        const last7Days = this.studyTime.slice(-7);
        const labels = last7Days.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        });
        const data = last7Days.map(day => day.hours);

        this.charts.studyTime = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Study Hours',
                    data: data,
                    backgroundColor: 'rgba(23, 162, 184, 0.8)',
                    borderColor: '#17a2b8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    generateSampleStudyTime() {
        const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            const studyData = {
                date: date.toISOString().slice(0, 10),
                hours: Math.floor(Math.random() * 8) + 2,
                subjects: subjects.slice(0, Math.floor(Math.random() * 3) + 2)
            };
            
            // Save to Firebase
            window.dbFunctions.addDocument('studyTime', studyData);
        }
    }

    showEmptyChart(ctx, message) {
        if (!ctx || !ctx.canvas) {
            console.warn('Canvas context not available for empty chart');
            return;
        }
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#6c757d';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }

    filterGradesByPeriod(period) {
        const now = new Date();
        const cutoff = new Date();

        switch (period) {
            case '1month':
                cutoff.setMonth(now.getMonth() - 1);
                break;
            case '3months':
                cutoff.setMonth(now.getMonth() - 3);
                break;
            case '6months':
                cutoff.setMonth(now.getMonth() - 6);
                break;
            default:
                return this.grades;
        }

        return this.grades.filter(grade => new Date(grade.date) >= cutoff);
    }

    // Goals rendering
    renderGoals() {
        const goalsList = document.getElementById('goalsList');
        if (!goalsList) return;
        
        if (this.goals.length === 0) {
            goalsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-target"></i>
                    <h3>No Goals Set</h3>
                    <p>Set your first academic goal to start tracking your progress!</p>
                    <button class="btn btn-primary" onclick="showGoalModal()">
                        <i class="fas fa-plus"></i> Add Goal
                    </button>
                </div>
            `;
            return;
        }

        goalsList.innerHTML = this.goals.map(goal => {
            const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== 'completed';
            const statusClass = goal.status === 'completed' ? 'completed' : (isOverdue ? 'overdue' : '');
            
            return `
                <div class="goal-item ${statusClass}">
                    <div class="goal-header">
                        <h6 class="goal-title">${goal.title}</h6>
                        <div class="goal-progress">
                            <span>${goal.progress}%</span>
                            <div class="progress" style="width: 100px;">
                                <div class="progress-bar ${this.getProgressBarClass(goal.progress)}" 
                                     style="width: ${goal.progress}%"></div>
                            </div>
                        </div>
                    </div>
                    ${goal.description ? `<p class="goal-description">${goal.description}</p>` : ''}
                    <div class="goal-meta">
                        <div class="goal-deadline">
                            <i class="fas fa-calendar"></i>
                            <span>${goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'No deadline'}</span>
                        </div>
                        <div class="goal-actions">
                            <button class="btn btn-sm btn-outline-primary" onclick="updateGoalProgress('${goal.id}', ${Math.min(100, goal.progress + 10)})">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteGoal('${goal.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getProgressBarClass(progress) {
        if (progress >= 80) return 'bg-success';
        if (progress >= 60) return 'bg-info';
        if (progress >= 40) return 'bg-warning';
        return 'bg-danger';
    }

    // Grades rendering
    renderGrades() {
        const tbody = document.getElementById('gradesTableBody');
        if (!tbody) return;
        
        if (this.grades.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <div class="empty-state py-4">
                            <i class="fas fa-graduation-cap"></i>
                            <h5>No Grades Added</h5>
                            <p>Add your first grade to start tracking your performance!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.grades.map(grade => {
            const numericGrade = this.parseGrade(grade.value);
            const gradeClass = this.getGradeClass(numericGrade);
            
            return `
                <tr>
                    <td><strong>${grade.subject}</strong></td>
                    <td>${grade.title}</td>
                    <td>
                        <span class="grade-badge ${gradeClass}">${grade.value}</span>
                    </td>
                    <td>${new Date(grade.date).toLocaleDateString()}</td>
                    <td>
                        <div class="grade-actions">
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteGrade('${grade.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    getGradeClass(numericGrade) {
        if (numericGrade >= 90) return 'grade-excellent';
        if (numericGrade >= 80) return 'grade-good';
        if (numericGrade >= 70) return 'grade-average';
        return 'grade-poor';
    }

    filterGrades() {
        const subjectFilter = document.getElementById('subjectFilter')?.value;
        const tbody = document.getElementById('gradesTableBody');
        if (!tbody) return;
        
        let filteredGrades = this.grades;
        if (subjectFilter) {
            filteredGrades = this.grades.filter(grade => grade.subject === subjectFilter);
        }

        if (filteredGrades.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        <div class="empty-state py-4">
                            <i class="fas fa-search"></i>
                            <h5>No Grades Found</h5>
                            <p>No grades match the selected filter.</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredGrades.map(grade => {
            const numericGrade = this.parseGrade(grade.value);
            const gradeClass = this.getGradeClass(numericGrade);
            
            return `
                <tr>
                    <td><strong>${grade.subject}</strong></td>
                    <td>${grade.title}</td>
                    <td>
                        <span class="grade-badge ${gradeClass}">${grade.value}</span>
                    </td>
                    <td>${new Date(grade.date).toLocaleDateString()}</td>
                    <td>
                        <div class="grade-actions">
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteGrade('${grade.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Insights generation
    generateInsights() {
        const insightsList = document.getElementById('insightsList');
        if (!insightsList) return;
        
        const insights = [];

        // Grade-based insights
        if (this.grades.length > 0) {
            const numericGrades = this.grades.map(grade => this.parseGrade(grade.value)).filter(g => g !== null);
            const average = numericGrades.reduce((sum, grade) => sum + grade, 0) / numericGrades.length;

            if (average >= 85) {
                insights.push({
                    type: 'positive',
                    title: 'Excellent Performance!',
                    description: `Your average grade of ${average.toFixed(1)}% is outstanding. Keep up the great work!`
                });
            } else if (average >= 75) {
                insights.push({
                    type: 'positive',
                    title: 'Good Performance',
                    description: `Your average grade of ${average.toFixed(1)}% shows solid academic progress.`
                });
            } else if (average < 60) {
                insights.push({
                    type: 'negative',
                    title: 'Needs Improvement',
                    description: `Your average grade of ${average.toFixed(1)}% suggests you might need to focus more on your studies.`
                });
            }

            // Subject performance insights
            const subjectAverages = {};
            this.grades.forEach(grade => {
                const numericGrade = this.parseGrade(grade.value);
                if (numericGrade !== null) {
                    if (!subjectAverages[grade.subject]) {
                        subjectAverages[grade.subject] = { sum: 0, count: 0 };
                    }
                    subjectAverages[grade.subject].sum += numericGrade;
                    subjectAverages[grade.subject].count += 1;
                }
            });

            Object.keys(subjectAverages).forEach(subject => {
                const avg = subjectAverages[subject].sum / subjectAverages[subject].count;
                if (avg < 60) {
                    insights.push({
                        type: 'warning',
                        title: `${subject} Needs Attention`,
                        description: `Your ${subject} average is ${avg.toFixed(1)}%. Consider spending more time on this subject.`
                    });
                }
            });
        }

        // Attendance insights
        if (this.attendance.length > 0) {
            const presentCount = this.attendance.filter(a => a.status === 'Present').length;
            const attendancePercentage = (presentCount / this.attendance.length) * 100;

            if (attendancePercentage < 75) {
                insights.push({
                    type: 'warning',
                    title: 'Low Attendance',
                    description: `Your attendance is ${attendancePercentage.toFixed(1)}%. Regular attendance is crucial for academic success.`
                });
            } else if (attendancePercentage >= 90) {
                insights.push({
                    type: 'positive',
                    title: 'Excellent Attendance',
                    description: `Your attendance of ${attendancePercentage.toFixed(1)}% shows great commitment to your studies.`
                });
            }
        }

        // Goal insights
        const activeGoals = this.goals.filter(goal => goal.status === 'active');
        const overdueGoals = activeGoals.filter(goal => goal.deadline && new Date(goal.deadline) < new Date());

        if (overdueGoals.length > 0) {
            insights.push({
                type: 'negative',
                title: 'Overdue Goals',
                description: `You have ${overdueGoals.length} overdue goal(s). Consider revising your timeline or priorities.`
            });
        }

        if (insights.length === 0) {
            insights.push({
                type: 'positive',
                title: 'Keep Going!',
                description: 'Continue adding grades and attendance data to get personalized insights.'
            });
        }

        insightsList.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <h6 class="insight-title">${insight.title}</h6>
                <p class="insight-description">${insight.description}</p>
            </div>
        `).join('');
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setCurrentDate() {
        const today = new Date().toISOString().slice(0, 10);
        const gradeDateInput = document.getElementById('gradeDate');
        const attendanceDateInput = document.getElementById('attendanceDate');
        
        if (gradeDateInput) gradeDateInput.value = today;
        if (attendanceDateInput) attendanceDateInput.value = today;
    }

    // Data export/import
    exportData() {
        const data = {
            grades: this.grades,
            attendance: this.attendance,
            goals: this.goals,
            studyTime: this.studyTime,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-data-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        window.utils.showNotification('Data exported successfully!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        let imported = 0;
                        
                        // Import grades
                        for (const grade of data.grades || []) {
                            const result = await window.dbFunctions.addDocument('grades', {
                                subject: grade.subject,
                                type: grade.type,
                                title: grade.title,
                                value: grade.value,
                                date: grade.date,
                                maxMarks: grade.maxMarks,
                                notes: grade.notes
                            });
                            if (result.success) imported++;
                        }
                        
                        // Import attendance
                        for (const attendance of data.attendance || []) {
                            const result = await window.dbFunctions.addDocument('attendance', {
                                subject: attendance.subject,
                                date: attendance.date,
                                status: attendance.status,
                                notes: attendance.notes
                            });
                            if (result.success) imported++;
                        }
                        
                        // Import goals
                        for (const goal of data.goals || []) {
                            const result = await window.dbFunctions.addDocument('goals', {
                                title: goal.title,
                                subject: goal.subject,
                                target: goal.target,
                                deadline: goal.deadline,
                                description: goal.description,
                                progress: goal.progress || 0,
                                status: goal.status || 'active'
                            });
                            if (result.success) imported++;
                        }
                        
                        window.utils.showNotification(`Imported ${imported} items successfully!`, 'success');
                    } catch (error) {
                        window.utils.showNotification('Error importing data', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Cleanup when page unloads
    destroy() {
        Object.values(this.unsubscribe).forEach(unsubscribe => {
            if (unsubscribe) unsubscribe();
        });
    }
}

// Global functions
let performanceAnalytics;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    performanceAnalytics = new PerformanceAnalyticsFirebase();
});

// Cleanup when page unloads
window.addEventListener('beforeunload', function() {
    if (performanceAnalytics) {
        performanceAnalytics.destroy();
    }
});

// Global functions for HTML onclick handlers
function saveGrade() {
    performanceAnalytics.saveGrade();
}

function saveAttendance() {
    performanceAnalytics.saveAttendance();
}

function saveGoal() {
    performanceAnalytics.saveGoal();
}

function deleteGrade(gradeId) {
    performanceAnalytics.deleteGrade(gradeId);
}

function deleteGoal(goalId) {
    performanceAnalytics.deleteGoal(goalId);
}

function updateGoalProgress(goalId, progress) {
    performanceAnalytics.updateGoalProgress(goalId, progress);
}

function filterGrades() {
    performanceAnalytics.filterGrades();
}

function updateTrendsChart() {
    performanceAnalytics.renderTrendsChart();
}

function exportData() {
    performanceAnalytics.exportData();
}

function importData() {
    performanceAnalytics.importData();
}

function showAddGradeModal() {
    if (!window.utils.isAuthenticated()) {
        window.utils.showNotification('Please login to add grades', 'warning');
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('addGradeModal'));
    modal.show();
}

function showAddAttendanceModal() {
    if (!window.utils.isAuthenticated()) {
        window.utils.showNotification('Please login to add attendance', 'warning');
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('addAttendanceModal'));
    modal.show();
}

function showGoalModal() {
    if (!window.utils.isAuthenticated()) {
        window.utils.showNotification('Please login to add goals', 'warning');
        return;
    }
    const modal = new bootstrap.Modal(document.getElementById('addGoalModal'));
    modal.show();
}

console.log('Performance Analytics with Firebase loaded successfully!');
