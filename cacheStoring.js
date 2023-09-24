const express = require('express');
const fetch = require('node-fetch');
const redis = require('redis');

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.PORT || 6379;

//connect to redis
const client = redis.createClient(REDIS_PORT)
client.connect();
client.on('connect', () => {
console.log('connected');
});

const app = express();

// Set response
function setResponse(username, repos) {
  return `<h2>${username} has ${repos} Github repos</h2>`;
}

// Make request to Github for data
async function getRepos(req, res, next) {
  try {
    console.log('Fetching Data...');

    const { username } = req.params;
    console.time(`START time`);
    const response = await fetch(`https://api.github.com/users/${username}`);

    const data = await response.json();

    const repos = data.public_repos;

    // Set data to Redis
    //(req.param, time limit to store data in cache in seconds, result)
    client.setex(username, 3600, repos);

    res.send(setResponse(username, repos));

    console.timeEnd(`END time`);

  } catch (err) {
    console.error(err);
    res.status(500);
  }
}

// Cache middleware
async function cache(req, res, next) {
  const { username } = req.params;
  const data = await client.get(username);
  if (data !== null) {
    res.send(setResponse(username, data));
  } else {
    next();
  }
}

console.time(`START GET time`);
                            //(get cache data, set cache data)
    app.get('/repos/:username', cache, getRepos);
console.timeEnd(`END GET time`);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
