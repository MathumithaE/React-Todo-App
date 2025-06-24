import React from "react";
import Task from "./Task"; // ✅ Ensure Task.js exists in the same folder
function App1() {
return (
<div>
{/* <h1>To-do App</h1> */}
<Task /> {/* ✅ Correct usage of the Task component */}
</div>
);
}
export default App1;