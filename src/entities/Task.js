import { timeStamp } from "node:console";
import { randomUUID } from "node:crypto";

export class Task {
  id = null;
  title = null;
  description = null;
  completed_at = null;
  created_at = null;
  updated_at = null;

  constructor(
    { title, description, completed_at, created_at, updated_at },
    id = null
  ) {
    this.id = id ?? randomUUID();
    this.title = title;
    this.description = description;
    this.completed_at = completed_at || null;
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? new Date();
  }

  static create(
    { title, description, completed_at, created_at, updated_at },
    id
  ) {
    return new Task(
      { title, description, completed_at, created_at, updated_at },
      id
    );
  }
}
