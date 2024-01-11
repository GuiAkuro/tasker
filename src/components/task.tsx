import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string;
}

interface TaskProps {
  task: Task;
}

export function Task({ task }: TaskProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task: task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-neutral-800 rounded-md p-4 text-neutral-100 relative border-2 border-red-500/40 border-dashed  min-h-[110px]"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={task.id}
      className="bg-neutral-800 rounded-md p-4 text-neutral-100 min-h-[110px]"
    >
      <h3 className="mb-2">{task.title}</h3>
      <div className="text-neutral-400 text-sm">{task.description}</div>
    </div>
  );
}
