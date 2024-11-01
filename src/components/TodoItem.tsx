import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useState, useEffect } from 'react';
import { updateTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorMessages';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (id: number) => void;
  loadingId: number | null;
  loading: boolean;
  setError: (errorType: ErrorType | null) => void;
  fetchTodos: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleDeleteTodo,
  loadingId,
  loading,
  setError,
  fetchTodos,
}) => {
  const { id, completed, title } = todo;
  const [isChecked, setIsChecked] = useState(completed);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsChecked(completed);
  }, [completed]);

  const handleCheckboxChange = () => {
    const newCompletedState = !isChecked;

    setIsChecked(newCompletedState);

    setIsUpdating(true);
    updateTodo(id, { completed: newCompletedState })
      .then(updatedTodo => {
        if (updatedTodo.completed !== newCompletedState) {
          setIsChecked(updatedTodo.completed);
        }

        fetchTodos();
      })
      .catch(() => {
        setIsChecked(isChecked);
        setError('update');
      })
      .finally(() => setIsUpdating(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: isChecked,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleCheckboxChange}
          disabled={loading}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      {(loadingId === id || isUpdating) && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
