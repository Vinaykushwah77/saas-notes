import React, { useState } from "react";

type NoteEditorProps = {
  initialValue?: string;
  onSave: (content: string) => void;
};

export default function NoteEditor({ initialValue = "", onSave }: NoteEditorProps) {
  const [content, setContent] = useState(initialValue);

  const handleSave = () => {
    if (content.trim() === "") {
      alert("Note cannot be empty!");
      return;
    }
    onSave(content);
    setContent("");
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg space-y-4">
      <textarea
        className="w-full border rounded p-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Note
      </button>
    </div>
  );
}
