document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const totalCount = document.getElementById('total-count');
    const completedCount = document.getElementById('completed-count');
    const emptyState = document.getElementById('empty-state');

    let tasks = [];
    let currentFilter = 'all';

    // Event Listeners
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (taskInput.value.trim()) {
            addTask(taskInput.value.trim());
            taskInput.value = '';
            taskInput.focus();
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterTasks();
        });
    });

    function addTask(taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        tasks.push(task);
        renderTask(task);
        updateCounters();
        updateEmptyState();
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <button class="delete-btn">Delete</button>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            toggleTask(task.id);
        });

        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id);
        });

        taskList.appendChild(li);
    }

    function toggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            const li = document.querySelector(`li[data-id="${taskId}"]`);
            li.classList.toggle('completed');
            updateCounters();
            filterTasks();
        }
    }

    function deleteTask(taskId) {
        const li = document.querySelector(`li[data-id="${taskId}"]`);
        if (li) {
            li.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== taskId);
                taskList.removeChild(li);
                updateCounters();
                filterTasks();
                updateEmptyState();
            }, 300);
        }
    }

    function filterTasks() {
        taskList.querySelectorAll('li').forEach(li => {
            const taskId = parseInt(li.dataset.id);
            const task = tasks.find(t => t.id === taskId);
            
            let shouldShow = true;
            if (currentFilter === 'active') {
                shouldShow = !task.completed;
            } else if (currentFilter === 'completed') {
                shouldShow = task.completed;
            }
            
            li.classList.toggle('hidden', !shouldShow);
        });
    }

    function updateCounters() {
        totalCount.textContent = tasks.length;
        completedCount.textContent = tasks.filter(t => t.completed).length;
    }

    function updateEmptyState() {
        const visibleTasks = taskList.querySelectorAll('li:not(.hidden)').length;
        emptyState.classList.toggle('show', visibleTasks === 0);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);