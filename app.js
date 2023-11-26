const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const path = require("path");
let db = null;

const dbPath = path.join(__dirname, "cricketTeam.db");

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("server Running at http://localhost:4000");
    });
  } catch (e) {
    console.log(`Db Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbServer();

app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    select * from cricket_team;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const addPlayerQuery = `
  insert into cricket_team 
  (player_name,jersey_number,role) 
  values
   ('${player_name}',${jersey_number},'${role}');`;

  const dbResponse = await db.run(addPlayerQuery);

  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
    select * from cricket_team where player_id=${playerId};`;
  const playerArray = await db.get(getPlayer);
  response.send(playerArray);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updatePlayer = `
    update cricket_team 
    set player_name='${player_name}',
        jersey_number=${jersey_number},
        role='${role}'
     where player_id=${playerId}`;
  const updatedPlayer = await db.run(updatePlayer);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `delete from cricket_team where player_id= ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
