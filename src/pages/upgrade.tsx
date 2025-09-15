import { useState } from "react";
import axios from "axios";

export default function UpgradePage() {
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");

  const handleUpgrade = async () => {
    try {
      const res = await axios.post(`/api/tenants/${slug}/upgrade`);
      setMessage(` Tenant ${slug} upgraded to Pro`);
    } catch (err: any) {
      setMessage(" Upgrade failed: " + err.response?.data?.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Upgrade Tenant to Pro</h1>
      <input
        type="text"
        placeholder="Enter tenant slug (acme or globex)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border rounded p-2 mb-4 w-64"
      />
      <button
        onClick={handleUpgrade}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Upgrade
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
