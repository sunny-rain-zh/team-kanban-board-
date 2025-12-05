/**
 * 团队任务看板 - 创建/删除任务功能
 * 开发者B负责实现
 */

// ========== 本地存储工具函数 ==========
/**
 * 保存任务数组到localStorage
 * @param {Array} tasks - 任务数组，每个任务格式：{id, content, status}
 */
function saveTasks(tasks) {
    try {
        localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('保存任务失败：', error);
        alert('任务保存失败，请检查浏览器存储权限！');
    }
}

/**
 * 从localStorage获取任务数组
 * @returns {Array} 任务数组，无数据时返回空数组
 */
function getTasks() {
    try {
        const rawTasks = localStorage.getItem('kanbanTasks');
        return rawTasks ? JSON.parse(rawTasks) : [];
    } catch (error) {
        console.error('获取任务失败：', error);
        alert('任务读取失败，将清空本地任务数据！');
        saveTasks([]); // 出错时清空无效数据
        return [];
    }
}

// ========== 任务操作核心函数 ==========
/**
 * 创建新任务
 * @param {string} content - 任务内容
 */
function createTask(content) {
    // 输入校验
    const trimmedContent = content.trim();
    if (!trimmedContent) {
        alert('任务内容不能为空，请输入有效内容！');
        return;
    }
    if (trimmedContent.length > 50) {
        alert('任务内容最多50个字，请精简内容后重试！');
        return;
    }

    // 获取现有任务
    const tasks = getTasks();
    // 生成新任务（ID使用时间戳+随机数，降低重复概率）
    const newTask = {
        id: Date.now() + '-' + Math.floor(Math.random() * 1000),
        content: trimmedContent,
        status: 'todo' // 新任务默认加入待办列
    };

    // 保存并重新渲染任务
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

/**
 * 删除指定ID的任务
 * @param {string} taskId - 任务ID
 */
function deleteTask(taskId) {
    if (!confirm('确定要删除该任务吗？删除后无法恢复！')) {
        return;
    }

    // 过滤删除的任务
    let tasks = getTasks();
    const taskCount = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    // 验证是否删除成功（防止ID匹配错误）
    if (tasks.length === taskCount) {
        alert('任务删除失败，未找到指定任务！');
        return;
    }

    // 保存并重新渲染任务
    saveTasks(tasks);
    renderTasks();
}

// ========== 任务渲染函数 ==========
/**
 * 渲染所有任务到对应列中
 */
function renderTasks() {
    const tasks = getTasks();
    // 清空所有任务列表
    const taskLists = {
        todo: document.getElementById('todo-list'),
        'in-progress': document.getElementById('in-progress-list'),
        done: document.getElementById('done-list')
    };
    Object.values(taskLists).forEach(list => {
        if (list) list.innerHTML = '';
    });

    // 遍历任务生成DOM元素
    tasks.forEach(task => {
        // 跳过状态不合法的任务
        if (!taskLists[task.status]) {
            console.warn('任务状态不合法，跳过渲染：', task);
            return;
        }

        // 创建任务卡片
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.dataset.id = task.id;

        // 任务内容
        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = task.content;

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // 组装任务卡片
        taskCard.appendChild(taskContent);
        taskCard.appendChild(deleteBtn);

        // 插入对应任务列表
        taskLists[task.status].appendChild(taskCard);
    });
}

// ========== 页面初始化 ==========
/**
 * 页面加载完成后初始化事件绑定和任务渲染
 */
function initKanban() {
    // 获取DOM元素
    const taskInput = document.getElementById('task-input');
    const createBtn = document.getElementById('create-task-btn');

    // 绑定创建任务按钮点击事件
    if (createBtn && taskInput) {
        createBtn.addEventListener('click', () => {
            createTask(taskInput.value);
            taskInput.value = ''; // 清空输入框
            taskInput.focus(); // 聚焦输入框，优化体验
        });

        // 绑定Enter键创建任务
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // 阻止换行
                createTask(taskInput.value);
                taskInput.value = '';
            }
        });
    } else {
        console.error('未找到创建任务的DOM元素，请检查HTML结构！');
    }

    // 初始渲染任务
    renderTasks();
}

// 页面加载完成后执行初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKanban);
} else {
    initKanban(); // 若页面已加载完成，直接执行
}