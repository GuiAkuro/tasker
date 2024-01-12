import { client, mock } from "../lib/axios";

mock.onGet("/board").reply(200, {
  id: 1,
  columns: [
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
  ],
  tasks: [
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
  ],
});

export const getBoard = client.get("/board");
