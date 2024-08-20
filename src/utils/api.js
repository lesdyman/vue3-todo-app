import { client } from "./client";

export const getTodos = () => {
  return client.get("/todos?userId=889");
};

export const createTodo = (title) => {
  return client.post("/todos", {
    title: title,
    completed: false,
    userId: 889,
  });
};

export const updateTodo = ({id, title, completed}) => {
  return client.patch(`/todos/${id}`, {
    title,
    completed,
  });
};

export const deleteTodo = (todoId) => {
  return client.delete(`/todos/${todoId}`);
};
