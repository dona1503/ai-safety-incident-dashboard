// import { useState } from "react";

// const severities = ["Low", "Medium", "High"] as const;

// const ReportIncident = () => {
//   const [newTitle, setNewTitle] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [newSeverity, setNewSeverity] = useState<typeof severities[number]>("Low");

//   const handleSubmit = () => {
//     if (!newTitle.trim() || !newDescription.trim()) {
//       alert("Please fill in all fields!");
//       return;
//     }
//     // Handle form submission
//   };

//   return (
//     <div className="form-container">
//       <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "10px" }}>
//         <h3>Report New Incident</h3>
//         <div>
//           <input
//             type="text"
//             placeholder="Title"
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             style={{ padding: "0.75rem", width: "100%", border: "1px solid #ccc", borderRadius: "5px" }}
//           />
//         </div>
//         <div>
//           <textarea
//             placeholder="Description"
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             style={{ padding: "0.75rem", width: "100%", height: "100px", border: "1px solid #ccc", borderRadius: "5px" }}
//           />
//         </div>
//         <div>
//           <label>Severity: </label>
//           <select
//             value={newSeverity}
//             onChange={(e) => setNewSeverity(e.target.value as typeof severities[number])}
//             style={{ padding: "0.3rem 0.5rem", borderRadius: "5px" }}
//           >
//             {severities.map((sev) => (
//               <option key={sev} value={sev}>
//                 {sev}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button onClick={handleSubmit} style={{ padding: "0.75rem 1.5rem", background: "#28a745", color: "#fff" }}>
//           Submit Incident 🚀
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReportIncident;
