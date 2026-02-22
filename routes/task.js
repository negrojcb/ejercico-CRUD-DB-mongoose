const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Create a new task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific task
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

// Middleware to get task by ID
async function getTask(req, res, next) {
  let task;
  const taskId = req.params.id || req.params._id;
  try {
    task = await Task.findById(taskId);
    if (task == null) {
      return res.status(404).json({ message: "Cannot find task" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}
// PUT /markAsCompleted/:_id
// Marca una tarea como completada
router.put("/markAsCompleted/:id", getTask, async (req, res) => {
  try {
    res.task.completed = true; // siempre la marca como completada
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /id/:_id
// Actualiza SOLO el título de la tarea
router.put("/id/:id", getTask, async (req, res) => {
  // Validar que venga title
  if (req.body.title == null || req.body.title.trim() === "") {
    return res.status(400).json({ message: "El campo 'title' es obligatorio" });
  }

  // Bloquear cambios al campo completed desde este endpoint
  if (req.body.completed !== undefined) {
    return res.status(400).json({
      message:
        "No se puede modificar 'completed' desde este endpoint. Solo 'title'.",
    });
  }

  try {
    res.task.title = req.body.title;
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Delete a task
router.delete("/:id", getTask, async (req, res) => {
  try {
    await res.task.deleteOne();
    res.json({ message: "Deleted Task" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
