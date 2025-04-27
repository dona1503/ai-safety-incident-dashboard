import { useState } from "react";
import './App.css';
import { mockIncidents } from "./data";
import { Incident } from "./types/incident";

const severities = ["All", "Low", "Medium", "High"] as const;

function App() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [filter, setFilter] = useState<typeof severities[number]>("All");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [detailsVisible, setDetailsVisible] = useState<Set<number>>(new Set());
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSeverity, setNewSeverity] = useState<typeof severities[number]>("Low");
  const [showToast, setShowToast] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSeverity, setEditSeverity] = useState<typeof severities[number]>("Low");

  const filteredIncidents = incidents
    .filter((incident) =>
      filter === "All" ? true : incident.severity === filter
    )
    .sort((a, b) => {
      const dateA = new Date(a.reported_at).getTime();
      const dateB = new Date(b.reported_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleSubmit = () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    const newIncident: Incident = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      severity: newSeverity,
      reported_at: new Date().toISOString(),
    };

    setIncidents([newIncident, ...incidents]);
    setNewTitle("");
    setNewDescription("");
    setNewSeverity("Low");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const startEditing = (incident: Incident) => {
    setEditId(incident.id);
    setEditTitle(incident.title);
    setEditDescription(incident.description);
    setEditSeverity(incident.severity);
  };

  const saveEdit = () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Please fill all fields for editing!");
      return;
    }

    const updatedIncidents = incidents.map((incident) =>
      incident.id === editId
        ? { ...incident, title: editTitle, description: editDescription, severity: editSeverity }
        : incident
    );

    setIncidents(updatedIncidents);
    setEditId(null);
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1>AI Safety Incident Dashboard</h1>

      {showToast && (
        <div className="toast-message">
          ✅ Incident reported successfully!
        </div>
      )}

      <div className="control-section">
        <label>Filter by Severity: </label>
        {severities.map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? "active-btn" : ""}`}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="control-section">
        <label>Sort by Date: </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
          style={{ padding: "0.3rem 0.5rem", borderRadius: "5px" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <ul>
        {filteredIncidents.map((incident) => (
          <li key={incident.id} className="incident-card">
            {editId === incident.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  style={{ padding: "0.5rem", borderRadius: "5px" }}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  style={{ padding: "0.5rem", borderRadius: "5px" }}
                />
                <select
                  value={editSeverity}
                  onChange={(e) =>
                    setEditSeverity(e.target.value as typeof severities[number])
                  }
                  style={{ padding: "0.5rem", borderRadius: "5px" }}
                >
                  {severities.slice(1).map((sev) => (
                    <option key={sev} value={sev}>
                      {sev}
                    </option>
                  ))}
                </select>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={saveEdit}
                    style={{
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      backgroundColor: "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <strong>{incident.title}</strong> - {incident.severity} -{" "}
                {new Date(incident.reported_at).toLocaleDateString()}

                {detailsVisible.has(incident.id) && (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: "#000000",
                      borderRadius: "8px",
                      fontStyle: "normal",
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    {incident.description}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => {
                      const newDetailsVisible = new Set(detailsVisible);
                      if (newDetailsVisible.has(incident.id)) {
                        newDetailsVisible.delete(incident.id);
                      } else {
                        newDetailsVisible.add(incident.id);
                      }
                      setDetailsVisible(newDetailsVisible);
                    }}
                    style={{
                      padding: "0.4rem 0.9rem",
                      background: "linear-gradient(135deg, #007bff, #0056b3)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    {detailsVisible.has(incident.id) ? "Hide Details 👀" : "View Details 🔍"}
                  </button>

                  <button
                    onClick={() => startEditing(incident)}
                    style={{
                      padding: "0.4rem 0.9rem",
                      background: "linear-gradient(135deg, #8e2de2, #4a00e0)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(142, 45, 226, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    Edit ✏️
                  </button>

                  <button
                    onClick={() => {
                      const updated = incidents.filter((i) => i.id !== incident.id);
                      setIncidents(updated);
                    }}
                    style={{
                      padding: "0.4rem 0.9rem",
                      background: "linear-gradient(135deg, #dc3545, #a71d2a)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "0.95rem",
                      transition: "transform 0.2s ease, box-shadow 0.3s ease",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    Delete ❌
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="form-container">
        <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "10px", marginBottom: "2rem" }}>
          <h3>Report New Incident</h3>
          <div style={{ marginBottom: "1rem", padding: "0.5rem" }}>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{
                padding: "0.75rem",
                width: "100%",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem", padding: "0.5rem" }}>
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{
                padding: "0.75rem",
                width: "100%",
                height: "100px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Severity: </label>
            <select
              value={newSeverity}
              onChange={(e) =>
                setNewSeverity(e.target.value as typeof severities[number])
              }
              style={{ padding: "0.3rem 0.5rem", borderRadius: "5px" }}
            >
              {severities.slice(1).map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            style={{
              padding: "0.75rem 1.5rem",
              background: "linear-gradient(to right, #28a745, #218838)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease, background-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Submit Incident 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
