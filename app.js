// 初始任务数据
const initialTasks = [
  { id: 1, content: "完成UI布局", status: "todo" },
  { id: 2, content: "编写样式", status: "todo" }
];

// 渲染任务到对应列
function renderTasks() {
  const todoList = document.getElementById("todo-list");
  todoList.innerHTML = ""; // 清空现有内容
  initialTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.textContent = task.content;
    todoList.appendChild(card);
  });
}

// 页面加载后执行
window.onload = renderTasks;