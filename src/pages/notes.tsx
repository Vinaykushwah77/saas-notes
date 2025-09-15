import { useEffect, useState } from "react";
import Router from "next/router";

type Note = { id: string; title: string; content: string };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw || !token) Router.push("/");
    else setUser(JSON.parse(raw));
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await fetch("/api/notes", { headers: { Authorization: `Bearer ${token}` }});
    if (res.status === 401) return Router.push("/");
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
  }

  async function createNote() {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) { alert("Create failed"); return; }
    setTitle(""); setContent("");
    fetchNotes();
  }

  async function deleteNote(id: string) {
    const res = await fetch(`/api/notes/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
    if (res.ok) fetchNotes();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Notes</h1>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <input 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea 
          placeholder="Content" 
          value={content} 
          onChange={e => setContent(e.target.value)}
          className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button 
          onClick={createNote} 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create
        </button>
      </div>

      <ul className="space-y-4">
        {notes.map(n => (
          <li key={n.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">{n.title}</h3>
            <p className="text-gray-700 my-2">{n.content}</p>
            <button 
              onClick={() => deleteNote(n.id)}
              className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
