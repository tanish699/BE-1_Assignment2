const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to log request timestamps
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Load tasks from JSON file
const loadTasks = () => {
    try {
        const data = fs.readFileSync('tasks.json', 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

// Save tasks to JSON file
const saveTasks = (tasks) => {
    fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Route to show all tasks
app.get('/tasks', (req, res) => {
    const tasks = loadTasks();
    res.render('tasks', { tasks });
});

// Route to get a specific task by ID
app.get('/task', (req, res) => {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id == req.query.id);
    if (task) {
        res.render('task', { task });
    } else {
        res.status(404).send('Task not found');
    }
});

// Route to add a new task
app.post('/add-task', (req, res) => {
    const tasks = loadTasks();
    const newTask = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.redirect('/tasks');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
