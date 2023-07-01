import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, []);

  const handleDeleteTodo = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddTodoForm({ onAddTodo }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify({ title, completed: false }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        onAddTodo(data);
        setTitle("");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title"
        required
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

function App() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  return (
    <div>
      <TodoList todos={todos} onDeleteTodo={handleDeleteTodo} />
      <AddTodoForm onAddTodo={handleAddTodo} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
