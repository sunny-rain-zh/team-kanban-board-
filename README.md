# team-kanban-board-
<template>
  <div class="kanban-board">
    <!-- 待办列 -->
    <div class="kanban-column" @dragover.prevent @drop="handleDrop('todo')">
      <h2>待办</h2>
      <div 
        class="task-card" 
        v-for="task in tasks.todo" 
        :key="task.id"
        draggable="true"
        @dragstart="setDraggedTask(task.id)"
      >
        {{ task.title }}
      </div>
    </div>

    <!-- 进行中列 -->
    <div class="kanban-column" @dragover.prevent @drop="handleDrop('inProgress')">
      <h2>进行中</h2>
      <div 
        class="task-card" 
        v-for="task in tasks.inProgress" 
        :key="task.id"
        draggable="true"
        @dragstart="setDraggedTask(task.id)"
      >
        {{ task.title }}
      </div>
    </div>

    <!-- 完成列 -->
    <div class="kanban-column" @dragover.prevent @drop="handleDrop('done')">
      <h2>完成</h2>
      <div 
        class="task-card" 
        v-for="task in tasks.done" 
        :key="task.id"
        draggable="true"
        @dragstart="setDraggedTask(task.id)"
      >
        {{ task.title }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 存储所有任务（按状态分类）
const tasks = ref({ todo: [], inProgress: [], done: [] });
// 记录当前拖拽的任务ID
let draggedTaskId = null;

// 1. 初始化：从后端获取任务
onMounted(async () => {
  const res = await fetch('/api/tasks');
  const data = await res.json();
  // 按状态分类任务
  tasks.value.todo = data.filter(t => t.status === 'todo');
  tasks.value.inProgress = data.filter(t => t.status === 'inProgress');
  tasks.value.done = data.filter(t => t.status === 'done');
});

// 2. 记录拖拽的任务ID
const setDraggedTask = (id) => {
  draggedTaskId = id;
};

// 3. 拖拽完成：更新任务状态
const handleDrop = async (targetStatus) => {
  if (!draggedTaskId) return;

  // 调用后端接口更新状态
  const res = await fetch(`/api/tasks/${draggedTaskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: targetStatus })
  });
  const updatedTask = await res.json();

  // 4. 前端更新任务列表
  // 从原状态列表移除
  Object.keys(tasks.value).forEach(status => {
    tasks.value[status] = tasks.value[status].filter(t => t.id !== draggedTaskId);
  });
  // 添加到目标状态列表
  tasks.value[targetStatus].push(updatedTask);
};
</script>

<style scoped>
.kanban-board {
  display: flex;
  gap: 20px;
  padding: 24px;
}
.kanban-column {
  min-width: 300px;
  min-height: 400px;
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.kanban-column h2 {
  margin: 0 0 16px;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
}
.task-card {
  background: white;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  cursor: grab;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}
.task-card:hover {
  transform: translateY(-2px);
}
</style>