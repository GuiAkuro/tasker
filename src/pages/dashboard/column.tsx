import { MoreVertical, Plus, Trash } from "lucide-react";
import { Card as Card } from "./card";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContext, useMemo, useState } from "react";
import { KanbanBoardContext } from "./kanban-board-context";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";

export interface Column {
  id: string;
  title: string;
  color: string;
}

interface ColumnProps {
  column: Column;
}

export function Column({ column }: ColumnProps) {
  const [open, setOpen] = useState(false);

  const { tasks, deleteColumn, addNewTask } = useContext(KanbanBoardContext);

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

  const columnTasks = tasks.filter((task) => task.columnId === column.id);

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
        <div className="flex items-center justify-between">
          <h2
            {...attributes}
            {...listeners}
            className="flex items-center gap-2 text-neutral-100 my-2"
          >
            <div className={`${column.color} rounded-full h-2 w-2`}></div>
            <div>{column.title}</div>
            <div className="text-neutral-600">{columnTasks.length}</div>
          </h2>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="h-8 hover:outline-none">
                <MoreVertical color="#ffffff" size={16} />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-neutral-700 p-4 rounded-md shadow-lg min-w-[200px]  text-white">
                <DropdownMenu.Item
                  onClick={() => setOpen((open) => !open)}
                  className="flex items-center justify-between cursor-pointer bg-red-400 hover:bg-red-500 gap-4 p-2 rounded-md px-6 hover:outline-none"
                >
                  <Trash color="#ffffff" size={16} />
                  <p className="flex-auto text-center">Excluir Coluna</p>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        <div>
          <button
            onClick={() => addNewTask(column.id)}
            className="bg-neutral-800 rounded-md h-10 w-full flex items-center justify-center"
          >
            <Plus size={20} color="#ffffff" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SortableContext items={tasksId}>
          {columnTasks.map((task) => (
            <Card key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="inset-0 fixed bg-black/60" />
          <Dialog.Content className="bg-white absolute -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 min-w-[300px] z-50 p-4 rounded-md">
            <Dialog.Title>Excluir Coluna?</Dialog.Title>
            <Dialog.Description>
              Deseja realmentre excluir a coluna? Esse processo e irreversível.
            </Dialog.Description>

            <button
              onClick={() => deleteColumn(column.id)}
              className="bg-red-400"
            >
              Excluir
            </button>
            <Dialog.Close>Cancelar</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
