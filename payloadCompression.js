//npm install express compression brotli

const express = require('express');
const compression = require('compression');
const brotli = require('brotli');

const app = express();

// Enable Brotli compression
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  brotli: {
    quality: 6,
  },
}));

// Define an API endpoint that returns plain text
app.get('/api/text', (req, res) => {
  res.send('This is a Brotli-compressed text response.');
});

// Define an API endpoint that returns JSON data
app.get('/api/json', (req, res) => {
  const jsonData = {
    message: 'This is a Brotli-compressed JSON response.',
  };
  res.json(jsonData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


/*

In this example:

We've set up a simple Express application.

We've enabled Brotli compression using the compression middleware,

We configure compression to use Brotli compression for responses by setting the filter option.
It checks for a custom request header x-no-compression, and if present and set to a truthy value,
it skips compression for that request.

We specify Brotli options in the brotli property of the compression middleware.
You can adjust the quality option to control the trade-off between compression speed 
and file size (0 is the fastest, 11 is the best compression).

We've defined two API endpoints:
/api/text: This endpoint returns plain text.
/api/json: This endpoint returns JSON data.

For both endpoints, the server will apply Brotli compression to the responses automatically 
when appropriate, based on the client's Accept-Encoding header.

*/

//P.S: You can enable compression on responses using cloudflare