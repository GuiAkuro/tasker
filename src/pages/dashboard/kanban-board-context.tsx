import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { Task } from "./card";
import { Column } from "./column";

interface KanbanBoardContextProps {
  columns: Array<Column>;
  tasks: Array<Task>;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  addNewColumn: () => void;
  deleteColumn: (columnId: string) => void;
  addNewTask: (columnId: string) => void;
}

export const KanbanBoardContext = createContext<KanbanBoardContextProps>(
  {} as KanbanBoardContextProps
);

interface KanbanBoardProviderProps {
  children: ReactNode;
}

export function KanbanBoardProvider({ children }: KanbanBoardProviderProps) {
  const [columns, setColumns] = useState<Array<Column>>([]);
  const [tasks, setTasks] = useState<Array<Task>>([]);

  function addNewColumn() {
    const newColumn: Column = {
      id: `column-${Math.floor(Math.random() * 100)}`,
      title: "New Column",
      color: "bg-blue-500",
    };

    setColumns((columns) => [...columns, newColumn]);
  }

  function deleteColumn(id: string) {
    setColumns((columns) => {
      return columns.filter((column) => column.id !== id);
    });

    setTasks((tasks) => {
      return tasks.filter((task) => task.columnId !== id);
    });
  }

  function addNewTask(columnId: string) {
    const newTask: Task = {
      id: `task-${Math.floor(Math.random() * 100)}`,
      columnId: columnId,
      title: "My New Task",
      description: "this is my new task",
    };

    setTasks((tasks) => [...tasks, newTask]);
  }

  return (
    <KanbanBoardContext.Provider
      value={{
        columns,
        tasks,
        setColumns,
        setTasks,
        addNewColumn,
        deleteColumn,
        addNewTask,
      }}
    >
      {children}
    </KanbanBoardContext.Provider>
  );
}
