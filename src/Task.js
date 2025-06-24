import React, { useState, useEffect } from "react";
import "./Task.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Learn ReactJS basics", isCompleted: true, isEditing: false },
    { id: 2, text: "Practice ReactJS", isCompleted: false, isEditing: false },
    { id: 3, text: "Learn Redux", isCompleted: false, isEditing: false },
    { id: 4, text: "Code portfolio in React", isCompleted: false, isEditing: false },
    { id: 5, text: "Learn React Native", isCompleted: false, isEditing: false }
  ]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add new task
  const addTask = () => {
    if (newTask.trim() !== "") {
      const newId = Math.max(...tasks.map(t => t.id), 0) + 1;
      setTasks([...tasks, { 
        id: newId, 
        text: newTask, 
        isCompleted: false, 
        isEditing: false 
      }]);
      setNewTask("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Mark task as completed
  const completeTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  // Enable edit mode
  const editTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isEditing: true } : task
    ));
  };

  // Save edited task
  const saveTask = (id, newText) => {
    if (newText.trim() !== "") {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, text: newText, isEditing: false } : task
      ));
    }
  };

  // Cancel edit
  const cancelEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, isEditing: false } : task
    ));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Delete completed tasks
  const deleteDoneTasks = () => {
    setTasks(tasks.filter(task => !task.isCompleted));
  };

  // Delete all tasks
  const deleteAllTasks = () => {
    setTasks([]);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === "Done") return task.isCompleted;
    if (filter === "Todo") return !task.isCompleted;
    return true; // "All"
  });

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className={`app-container ${mounted ? 'mounted' : ''}`}>
      
      {/* Header */}
      <div className="app-header">
        <h1 className="app-title">Todo Master</h1>
        <p className="app-subtitle">Organize your life, one task at a time</p>
        <div className="stats-container">
          <span className="stat-item">
            <div className="stat-dot completed"></div>
            {completedCount} Completed
          </span>
          <span className="stat-item">
            <div className="stat-dot pending"></div>
            {totalCount - completedCount} Pending
          </span>
          <span className="stat-item">
            <div className="stat-dot total"></div>
            {totalCount} Total
          </span>
        </div>
      </div>

      <div className="main-grid">
        
        {/* Add Task Section */}
        <div className="section-card add-task-section">
          <div className="section-header">
            <div className="section-icon add-icon">+</div>
            <h2 className="section-title">Add New Task</h2>
          </div>
          
          <div className="input-container">
            <div className="input-wrapper">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="task-input"
              />
              <div className="input-glow"></div>
            </div>
            
            <button 
              onClick={addTask}
              disabled={!newTask.trim()}
              className="add-task-btn"
            >
              Add Task
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="section-card filter-section">
          <div className="section-header">
            <div className="section-icon filter-icon">⚡</div>
            <h2 className="section-title">Quick Filters</h2>
          </div>
          
          <div className="filter-buttons">
            {["All", "Todo", "Done"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`filter-btn ${filter === filterOption ? 'active' : ''}`}
              >
                {filterOption}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          {tasks.length > 0 && (
            <div className="quick-actions">
              <button 
                onClick={deleteDoneTasks}
                className="quick-action-btn clear-completed"
              >
                Clear Completed
              </button>
              <button 
                onClick={deleteAllTasks}
                className="quick-action-btn clear-all"
              >
                Clear All Tasks
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="task-list-section">
        <div className="section-card">
          <div className="section-header">
            <div className="section-icon list-icon">📋</div>
            <h2 className="section-title">
              {filter === "All" ? "All Tasks" : filter === "Done" ? "Completed Tasks" : "Pending Tasks"}
            </h2>
            <div className="task-count">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎉</div>
              <p className="empty-text">
                {filter === "Done" ? "No completed tasks yet" : 
                 filter === "Todo" ? "No pending tasks!" : 
                 "No tasks yet. Add one above!"}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="task-item"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="task-content">
                    {task.isEditing ? (
                      <input
                        type="text"
                        defaultValue={task.text}
                        onBlur={(e) => saveTask(task.id, e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            saveTask(task.id, e.target.value);
                          } else if (e.key === 'Escape') {
                            cancelEdit(task.id);
                          }
                        }}
                        autoFocus
                        className="task-edit-input"
                      />
                    ) : (
                      <div className="task-text-container" onClick={() => completeTask(task.id)}>
                        <div className={`task-checkbox ${task.isCompleted ? 'checked' : ''}`}>
                          {task.isCompleted && (
                            <svg className="check-icon" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className={`task-text ${task.isCompleted ? 'completed' : ''}`}>
                          {task.text}
                        </span>
                      </div>
                    )}

                    <div className="task-actions">
                      <button 
                        onClick={() => editTask(task.id)}
                        className="action-btn edit-btn"
                        title="Edit task"
                      >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="action-btn delete-btn"
                        title="Delete task"
                      >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>Built with React • Designed for productivity</p>
      </div>
    </div>
  );
}