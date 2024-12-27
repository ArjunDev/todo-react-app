import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaTrashAlt} from "react-icons/fa";
import "./style.css"

function TodoList(){

  const [tasks, setTasks] = useState([]);
  const [inputData, setInputData] = useState("");
  const [status, setStatus] = useState("all");
  const [allTasks, setAllTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  // Initialize tasks from localStorage
  useEffect(() => {
    const storedCompletedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    const storedPendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];

    // Combine stored tasks and update state
    const combinedTasks = [...storedCompletedTasks, ...storedPendingTasks];
    setAllTasks(combinedTasks);
    setCompletedTasks(storedCompletedTasks);
    setPendingTasks(storedPendingTasks);

    // Initialize visible tasks based on status
    setTasks(
      status === "completed"
        ? storedCompletedTasks
        : status === "pending"
        ? storedPendingTasks
        : combinedTasks
    );

    console.log("Initialized tasks from localStorage:", {
      allTasks: combinedTasks,
      completedTasks: storedCompletedTasks,
      pendingTasks: storedPendingTasks,
    });
  }, []); // Runs only once on mount

  // Update tasks and localStorage when state changes
  useEffect(() => {
    const combinedTasks = [...pendingTasks, ...completedTasks];
    setAllTasks(combinedTasks);

    // Update visible tasks based on the current status
    setTasks(
      status === "completed"
        ? completedTasks
        : status === "pending"
        ? pendingTasks
        : combinedTasks
    );

    // Save updated tasks to localStorage
    localStorage.setItem("allTasks", JSON.stringify(combinedTasks));
    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
    console.log("Hello from [pendingTasks, completedTasks, status]")
  }, [pendingTasks, completedTasks, status]);

  
  function getInputText(event){
    setInputData(event.target.value);
  }

  function addTask(){
    if(inputData.trim() !== ""){
      setPendingTasks([...pendingTasks, { todo: inputData, completed: false }]);
      setInputData(""); 
      // to set input box text to empty after clicking on add btn
    }
  }

  function handleCheckBox(index) {

    const updatedTask = allTasks.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );//toggling the completed status based on index clicked

    const completedTodo = updatedTask.filter((item) => item.completed === true);
    const pendingTodo = updatedTask.filter((item) => item.completed !== true);

    setCompletedTasks(completedTodo);
    setPendingTasks(pendingTodo);
    setAllTasks(updatedTask);
  }

  function handleSelection(event) {
    const selected = event.target.value;
    setStatus(selected);
  
    // Filter tasks based on the selection
    const filteredTasks =
      selected === "completed"
        ? completedTasks.map((task) => task)
        : selected === "pending"
        ? pendingTasks.map((task) => task)
        : allTasks;
    
    setTasks(filteredTasks);
  }

  function deleteTask(index) {
    if (status === "pending") {
      const updatedTasks = pendingTasks.filter((_, i) => i !== index);
      setPendingTasks(updatedTasks);

    } else if (status === "completed") {
      const updatedTasks = completedTasks.filter((_, i) => i !== index);
      setCompletedTasks(updatedTasks);

    } else {
      const updatedTasks = allTasks.filter((_, i) => i !== index);
      const newPending = updatedTasks.filter(task => !task.completed);
      const newCompleted = updatedTasks.filter(task => task.completed);
      setAllTasks(updatedTasks);
      setPendingTasks(newPending);
      setCompletedTasks(newCompleted);
    }
  }
  
  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTodo = [...tasks];
      [updatedTodo[index], updatedTodo[index - 1]] = [updatedTodo[index - 1], updatedTodo[index]];
      updateStateAfterReorder(updatedTodo);
    }
  }
  
  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTodo = [...tasks];
      [updatedTodo[index + 1], updatedTodo[index]] = [updatedTodo[index], updatedTodo[index + 1]];
      updateStateAfterReorder(updatedTodo);
    }
  }
  
  function updateStateAfterReorder(updatedTodo) {

    if(status === "pending"){
      setTasks(updatedTodo);
      setPendingTasks(updatedTodo);
    }
    if(status === "completed"){
      setTasks(updatedTodo);
      setCompletedTasks(updatedTodo);
    } else if(status === "all"){
      setTasks(updatedTodo);
      setAllTasks(updatedTodo);
    }
  }

return(
  <div className="container">
    <h1>ToDo List</h1>
    <div className="input-container">
      <input className="input-area"
              type="text" 
              placeholder="Enter a task..."
              value={inputData}
              onChange={getInputText}
      />
      <button onClick={addTask} className="add-btn">Add</button>
    </div>
    <div className="selection-container">
      <label>Show: </label>
      <select name="todos" value={status} onChange={handleSelection}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <ul>
      {tasks.length > 0 ? (
        tasks.map((item, index) => (
          <li key={index} className={item.completed ? "completed-task" : ""}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => handleCheckBox(index)}
            />
            <span className="task-text">{item.todo}</span>
            <FaTrashAlt className="delete-btn" onClick={() => deleteTask(index)} />
            <FaArrowUp className="up-btn" onClick={() => moveTaskUp(index)} />
            <FaArrowDown className="down-btn" onClick={() => moveTaskDown(index)} />
          </li>))) : (
        <h2 className="no-tasks-msg">No tasks </h2>
      )}
    </ul>
  </div>
)
}
export default TodoList