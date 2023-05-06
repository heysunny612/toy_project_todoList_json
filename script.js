(function () {
  'use strict';

  const API_URL = 'http://localhost:3000/todos';
  const $todos = document.querySelector('.todos');
  const $todoForm = document.querySelector('.todo_form');
  const $todoInput = document.querySelector('.todo_input');

  // TODO DOM 생성
  const createTodos = (todo) => {
    const { id, content, completed } = todo;
    const $item = document.createElement('div');
    $item.dataset.id = id;
    $item.className = 'item';
    $item.innerHTML = `
      <div class="content">
        <input type="checkbox" class="todo_checkbox" 
        ${completed ? 'checked' : ''} />
        <label>${content}</label>
        <input type="text" value="${content}" />
      </div>
      <div class="item_buttons content_buttons">
        <button class="todo_edit_button"><i class="far fa-edit"></i></button>
        <button class="todo_remove_button"><i class="far fa-trash-alt"></i></button>
      </div>
      <div class="item_buttons edit_buttons">
        <button class="todo_edit_confirm_button"><i class="fas fa-check"></i></button>
        <button class="todo_edit_cancel_button"><i class="fas fa-times"></i></button>
      </div>
      `;
    return $item;
  };

  //만들어진 TODO DOM을 HTML문서에 SHOW
  const showTodos = (todos) => {
    $todos.innerHTML = '';
    todos.forEach((todo) => {
      const todosList = createTodos(todo);
      $todos.appendChild(todosList);
    });
  };

  //DB 불러오기
  const getTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const sortLatest = data.reverse();
      showTodos(sortLatest);
    } catch (error) {
      console.log(error);
    }
  };

  //입력 받은 데이터 추가
  const onAddTodo = (e) => {
    e.preventDefault();
    const content = $todoInput.value;
    if (!content) return;
    const todo = {
      content,
      completed: false,
    };
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(todo),
    }).catch((error) => console.error(error.message));
  };

  // CHECKBOX가 선택되었을경우 TRUE 아닌 경우 FALSE로 변경
  const onCheckEvent = (e) => {
    if (e.target.className !== 'todo_checkbox') return;
    const item = e.target.closest('.item');
    const id = item.dataset.id;
    const completed = e.target.checked;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ completed }),
    }).catch((error) => console.error(error.message));
  };

  //수정하기 버튼 눌렀을때 이벤트
  const changeEditMode = (e) => {
    const item = e.target.closest('.item');
    const [content, contentButtons, editButtons] = item.children;
    const [_, label, input] = content.children;
    const text = input.value;

    //수정 버튼을 눌렀을때
    if (e.target.className === 'todo_edit_button') {
      contentButtons.style.display = 'none';
      editButtons.style.display = 'block';
      label.style.display = 'none';
      input.style.display = 'block';
      input.value = '';
      input.value = text;
      input.focus();
    }

    //캔슬 버튼을 눌렀을때
    if (e.target.className === 'todo_edit_cancel_button') {
      contentButtons.style.display = 'block';
      editButtons.style.display = 'none';
      label.style.display = 'block';
      input.style.display = 'none';
      input.value = label.innerText;
    }
    return;
  };

  //수정 컨펌 버튼을 눌렀을때
  const editTodos = (e) => {
    if (e.target.className !== 'todo_edit_confirm_button') return;

    const item = e.target.closest('.item');
    const id = item.dataset.id;
    const editInput = item.querySelector('input[type="text"]');
    const content = editInput.value;

    fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ content }),
    }).catch((error) => console.error(error.message));
  };

  //삭제버튼을 눌렀을 때
  const deleteTodos = (e) => {
    if (e.target.className !== 'todo_remove_button') return;

    const item = e.target.closest('.item');
    const id = item.dataset.id;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' }) //
      .catch((error) => console.error(error.message));
  };

  const init = () => {
    window.addEventListener('DOMContentLoaded', () => {
      getTodos();
      pagination();
    });

    $todoForm.addEventListener('submit', onAddTodo);
    $todos.addEventListener('click', onCheckEvent);
    $todos.addEventListener('click', changeEditMode);
    $todos.addEventListener('click', editTodos);
    $todos.addEventListener('click', deleteTodos);
  };
  init();
})();
