import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Fetch failed");
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError("Failed to fetch notes.");
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    if (!title || !body) {
      setError("Both title and body are required.");
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!response.ok) throw new Error("Add failed");
      setTitle("");
      setBody("");
      setError("");
      fetchNotes();
    } catch (err) {
      setError("Error adding note.");
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
      fetchNotes();
    } catch (err) {
      setError("Error deleting note.");
    }
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            font-family: Arial, sans-serif;
            padding: 2rem;
            max-width: 700px;
            margin: auto;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .error {
            color: red;
            margin-bottom: 1rem;
          }
          form {
            background: #f9f9f9;
            padding: 1rem;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
          }
          input, textarea {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
          }
          button {
            background: #007bff;
            color: white;
            padding: 0.5rem 1.25rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          button:hover {
            background: #0056b3;
          }
          .note {
            border: 1px solid #ddd;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            background: #fff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          .note h3 {
            margin: 0 0 0.5rem 0;
          }
          .note p {
            margin: 0 0 1rem 0;
          }
          .note button {
            background: #dc3545;
          }
          .note button:hover {
            background: #c82333;
          }
        `}
      </style>

      <h1>Simple Notes App</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={addNote}>
        <input
          type="text"
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Note Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        <button type="submit">Add Note</button>
      </form>

      {notes.length === 0 ? (
        <p>No notes yet. Add one!</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="note">
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
