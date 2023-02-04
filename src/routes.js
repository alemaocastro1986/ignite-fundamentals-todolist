import { Database } from "./data/database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { Task } from "./entities/Task.js";

const database = new Database();
export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/"),
    handler: async (request, response) => {
      const message = { project: "tasks", version: "1.0.0" };
      return response.json(message);
    },
  },
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: async (request, response) => {
      const { search } = request.query;
      let tasks;
      if (search) {
        tasks = database.select("tasks", {
          title: search,
          description: search,
        });
      } else {
        tasks = database.select("tasks");
      }

      return response.json(tasks);
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: async (request, response) => {
      const { title, description } = request.body;
      const task = Task.create({ title, description });
      await database.insert("tasks", task);
      return response.writeHead(201).json({ message: "Task created" });
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: async (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;
      const [alreadyExistsTask] = await database.select("tasks", { id });
      if (alreadyExistsTask) {
        const task = Task.create(alreadyExistsTask, alreadyExistsTask.id);
        task.title = title ?? alreadyExistsTask.title;
        task.description = description ?? alreadyExistsTask.description;
        const { id, ...rest } = task;
        const updateTask = {
          ...rest,
          updated_at: new Date(),
        };
        const updatedTask = await database.update("tasks", id, updateTask);
        return response.writeHead(200).json(updatedTask);
      }
      return response.writeHead(404).json({ message: "Task not found" });
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: async (request, response) => {
      const { id } = request.params;
      const [alreadyExistsTask] = await database.select("tasks", { id });
      if (alreadyExistsTask) {
        const task = Task.create(alreadyExistsTask, alreadyExistsTask.id);
        task.completed_at = !task.completed_at ? new Date() : null;
        const { id, ...rest } = task;
        const updateTask = {
          ...rest,
          updated_at: new Date(),
        };
        const updatedTask = await database.update("tasks", id, updateTask);
        return response.writeHead(200).json(updatedTask);
      }
      return response.writeHead(404).json({ message: "Task not found" });
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: async (request, response) => {
      const { id } = request.params;
      const [alreadyExistsTask] = await database.select("tasks", { id });
      if (!alreadyExistsTask)
        return response.writeHead(404).json({ message: "Task not found" });
      database.delete("tasks", id);
      return response.writeHead(204).end();
    },
  },
];
