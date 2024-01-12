import { useContext, useMemo, useState } from "react";
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
import { Card, Task } from "./card";
import { useQuery } from "react-query";
import { getBoard } from "../../http/board";
import { KanbanBoardContext } from "./kanban-board-context";

export function KanbanBoard() {
  const board = useQuery("board", async () => (await getBoard).data, {
    onSuccess: (data) => {
      setColumns(data.columns);
      setTasks(data.tasks);
    },
  });

  const { columns, setColumns, setTasks, addNewColumn } =
    useContext(KanbanBoardContext);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  if (board.isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
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
              <Column key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && <Column column={activeColumn} />}
            {activeTask && <Card task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
