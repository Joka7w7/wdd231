const courses = [
    { code: 'WDD 130', name: 'Web Fundamentals', credits: 1, completed: true },
    { code: 'WDD 131', name: 'Dynamic Web Fundamentals', credits: 2, completed: true },
    { code: 'WDD 231', name: 'Front-end Frameworks', credits: 3, completed: false },

    { code: 'CSE 110', name: 'Programing Building Blacks', credits: 1, completed: true },
    { code: 'CSE 111', name: 'Programing with Functions', credits: 2, completed: true },
    { code: 'CSE 210', name: 'Programing with Classes', credits: 3, completed: false },
];

function displayCourses(filteredCourses) {
    const container = document.getElementById('courseContainer');
    const totalCredits = document.getElementById('totalCredits');
    container.innerHTML = '';

    let credits = 0;
    filteredCourses.forEach(course => {
        credits += course.credits;
        const div = document.createElement('div');
        div.textContent = `${course.code}`;
        div.className = course.completed ? 'completed' : 'incomplete';
        container.appendChild(div);
    });

    totalCredits.textContent = `The total credits for courses listed above is ${credits}`;
}

document.getElementById('allBtn').addEventListener('click', () => {
    displayCourses(courses);
});
document.getElementById('cseBtn').addEventListener('click', () => {
    displayCourses(courses.filter(c => c.code.includes('CSE')));
});
document.getElementById('wddBtn').addEventListener('click', () => {
    displayCourses(courses.filter(c => c.code.includes('WDD')));
});

window.addEventListener('DOMContentLoaded', () => displayCourses(courses));
