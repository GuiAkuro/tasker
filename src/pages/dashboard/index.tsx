import { KanbanBoard } from "./kanban-board";
import { KanbanBoardProvider } from "./kanban-board-context";

export function DashboardPage() {
  return (
    <div className="h-screen overflow-auto bg-neutral-900">
      <KanbanBoardProvider>
        <KanbanBoard />
      </KanbanBoardProvider>
    </div>
  );
}
