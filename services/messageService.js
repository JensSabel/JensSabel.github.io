import { executeQuery } from "../databases/database.js";

const findAll = async () => {
    const result = await executeQuery(
      "SELECT * FROM messages ORDER BY id DESC limit 5;",
    );
    return result.rows;
};

const create = async (sender,message) => {
    await executeQuery(
        "INSERT INTO messages (sender,message) VALUES ($1, $2)",
        sender,
        message,
    )
};

export {findAll, create};