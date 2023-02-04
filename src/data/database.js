import fs from "node:fs/promises";

const databasePath = new URL("db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#perist();
      });
  }

  async #perist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) =>
          row[key].includes(value)
        );
      });
    }
    return data;
  }

  async insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    await this.#perist();
    return data;
  }

  async update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex >= 0) {
      const updatedUser = { id, ...data };
      this.#database[table][rowIndex] = updatedUser;
      this.#perist();
      return updatedUser;
    }
    return null;
  }

  async delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);
    if (rowIndex >= 0) {
      this.#database[table].splice(rowIndex, 1);
      this.#perist();
    }
  }
}
