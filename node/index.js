require('dotenv').config()
const express = require('express');
const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker')

async function main() {
  const port = process.env?.PORT ?? 3000
  const dbConfig = {
    host: process.env?.DB_HOST ?? "localhost",
    port: process.env?.DB_PORT ?? "3306",
    user: process.env?.DB_USER ?? "root",
    password: process.env?.DB_PASSWORD ?? "root",
    database: process.env?.DB_DATABASE ?? "app"
  }
  const conn = await mysql.createConnection(dbConfig);
  await conn.connect()
  console.log("Connected to database")
  const app = express();

  app.get('/', async (req, res) => {
    try {
      const name = faker.person.fullName()
      await conn.query(`INSERT INTO people (name) VALUES ('${name}')`)
      console.log(`Inserted "${name}" into database`)
      const dbRes = await conn.query(`SELECT name, created_at from people`)
      const names = (dbRes?.[0] ?? []).map(e => `<li>${e.name}</li>`).join("")
      return res
        .send(`
        <h1>Full Cycle Rocks!</h1>
        <h2>People:</h2>
        <ul>${names}</ul>
      `)
    } catch (error) {
      console.error(error)
      return res
        .send(`
        <h1>Full Cycle Rocks!</h1>
        <p>Ops! An error occur, try again later!</p>
      `)
    }
  })

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })

}

main()

