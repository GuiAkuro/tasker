import { useMemo, useState } from "react";
import { Column } from "./column";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Task } from "./task";

const defaultColumns: Array<Column> = [
  {
    id: "column-1",
    title: "New Request",
    color: "bg-[#fb4f57]",
  },
  {
    id: "column-2",
    title: "In Progress",
    color: "bg-[#ffffff]",
  },
  {
    id: "column-3",
    title: "Done",
    color: "bg-[#41c43e]",
  },
];

const defaultTasks: Array<Task> = [
  {
    id: "task-1",
    columnId: "column-1",
    title: "My Task #1",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-2",
    columnId: "column-1",
    title: "My Task #2",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-3",
    columnId: "column-1",
    title: "My Task #3",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-4",
    columnId: "column-2",
    title: "My Task #4",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-5",
    columnId: "column-2",
    title: "My Task #5",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-6",
    columnId: "column-2",
    title: "My Task #6",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-7",
    columnId: "column-3",
    title: "My Task #7",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-8",
    columnId: "column-3",
    title: "My Task #8",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
  {
    id: "task-9",
    columnId: "column-3",
    title: "My Task #9",
    description:
      "this is my task and should be done as quick as it is possible to be done.",
  },
];

export function Board() {
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState(defaultColumns);
  const [tasks, setTasks] = useState(defaultTasks);

  const columnsId = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(pointerSensor);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column") {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    if (!event.over) {
      return;
    }

    const activeColumnId = event.active.id;
    const overColumnId = event.over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (column) => column.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (column) => column.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    if (!event.over) {
      return;
    }

    const activeTaskId = event.active.id;
    const overId = event.over.id;

    if (activeTaskId === overId) {
      return;
    }

    const isActiveTask = event.active.data.current?.type === "task";
    const isOverTask = event.over.data.current?.type === "task";

    if (!isActiveTask) {
      return;
    }

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeTaskId
        );

        const overIndex = tasks.findIndex((task) => task.id === overId);

        tasks[activeTaskIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overIndex);
      });
    }

    const isOverColumn = event.over.data.current?.type === "column";

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex(
          (task) => task.id === activeTaskId
        );

        tasks[activeTaskIndex].columnId = overId as string;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  }

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
    <div>
      <div>
        <button
          className="bg-neutral-800 rounded-md h-10 px-4 flex items-center justify-center"
          onClick={addNewColumn}
        >
          add Column
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex overflow-auto">
          <SortableContext items={columnsId}>
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.columnId === column.id)}
                deleteColumn={deleteColumn}
                addNewTask={addNewTask}
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <Column
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteColumn={deleteColumn}
                addNewTask={addNewTask}
              />
            )}

            {activeTask && <Task task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
