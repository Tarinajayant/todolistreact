import React, { useState, useEffect } from "react";
import "./styles.css";
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch todo items from the API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      // Create a new todo item object
      const newTodoItem = {
        title: newTodo,
        completed: false
      };

      // Make POST request to add the new todo item
      fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTodoItem)
      })
        .then((response) => response.json())
        .then((data) => {
          setTodos([...todos, data]);
          setNewTodo("");
        })
        .catch((error) => {
          console.error("Error adding todo:", error);
        });
    }
  };

  const handleUpdateTodo = (id, updatedTitle) => {
    // Find the todo item in the list
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, title: updatedTitle };
      }
      return todo;
    });

    // Make PUT request to update the todo item
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTodos.find((todo) => todo.id === id))
    })
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const handleDeleteTodo = (id) => {
    // Make DELETE request to remove the todo item
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const handleToggleComplete = (id) => {
    // Find the todo item in the list
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    // Make PUT request to update the todo item
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedTodos.find((todo) => todo.id === id))
    })
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  const filteredTodos =
    filter === "all"
      ? todos
      : filter === "completed"
      ? todos.filter((todo) => todo.completed)
      : todos.filter((todo) => !todo.completed);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Todo List</h1>
      <div className="input-container mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a todo item"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="btn btn-primary ml-2" onClick={handleAddTodo}>
          Add Todo
        </button>
      </div>
      <div className="filter-container mb-3">
        <button
          className={`btn btn-outline-secondary ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-outline-secondary ${
            filter === "completed" ? "active" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          className={`btn btn-outline-secondary ${
            filter === "active" ? "active" : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
      </div>
      <ul className="list-group">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className={`list-group-item ${
              todo.completed ? "list-group-item-success" : ""
            }`}
          >
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              <span className="ml-2">{todo.title}</span>
              <div className="button-container">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => {
                    const updatedTitle = prompt(
                      "Enter the updated title:",
                      todo.title
                    );
                    if (updatedTitle && updatedTitle.trim() !== "") {
                      handleUpdateTodo(todo.id, updatedTitle);
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
