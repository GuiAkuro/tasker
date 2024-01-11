import { Plus, Trash } from "lucide-react";
import { Task } from "./task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";

export interface Column {
  id: string;
  title: string;
  color: string;
}

interface ColumnProps {
  column: Column;
  deleteColumn: (id: string) => void;
  addNewTask: (columnId: string) => void;
  tasks: Array<Task>;
}

export function Column({
  deleteColumn,
  addNewTask,
  column,
  tasks,
}: ColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "column",
      column: column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const tasksId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-neutral-800/40 max-w-[360px] min-w-[260px] w-full border-red-500/40 border-2 rounded-md border-dashed"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="max-w-[360px] min-w-[260px] w-full bg-neutral-900 p-2 rounded-md"
      key={column.id}
    >
      <div>
        <h2
          {...attributes}
          {...listeners}
          className="flex items-center gap-2 text-neutral-100 my-2"
        >
          <div className={`${column.color} rounded-full h-2 w-2`}></div>
          <div>{column.title}</div>
          <div className="text-neutral-600">{tasks.length}</div>
        </h2>

        <button
          onClick={() => addNewTask(column.id)}
          className="bg-neutral-800 rounded-md h-10 w-full flex items-center justify-center"
        >
          <Plus size={20} color="#ffffff" />
        </button>

        <button
          onClick={() => deleteColumn(column.id)}
          className="bg-neutral-800 rounded-md h-10 w-full flex items-center justify-center mt-2"
        >
          <Trash size={20} color="#ffffff" />
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
