const User = mongoose.model('User', userSchema);

// Define the pagination parameters
const perPage = 10; // Number of documents to retrieve per page
const page = 2; // The page number you want to retrieve (1-based index)

// Calculate the number of documents to skip
const skipCount = (page - 1) * perPage;

// Perform the query with pagination
User.find({})
  .skip(skipCount) // Skip the specified number of documents
  .limit(perPage) // Limit the number of documents to retrieve
  .exec((err, users) => {
    if (err) throw err;

    // Process and send the 'users' result to your application
    console.log(users);
  });

/*

1.  You define the perPage variable to specify how many documents you want to retrieve per page,
    and the page variable to specify which page you want to retrieve. 
    The page variable is 1-based, so
    page = 1 corresponds to the first page, 
    page = 2 to the second page, and so on.

2.  The formula skipCount = (page - 1) * perPage 
    calculates how many documents to skip to get to the desired page.

3.  You perform the query using the Mongoose find() method, specifying an empty query object {} to retrieve all documents.

4.  You use the .skip(skipCount) method to skip the specified number of documents, and 
    .limit(perPage) to limit the number of documents to retrieve for the current page.

5.  In the exec() callback, you can process and send the retrieved users to your application.

6.  By changing the page variable, you can navigate through the result set in a paginated manner. 
    This allows you to retrieve and display data in smaller, more manageable chunks, 
    which is especially useful when dealing with large datasets.

*/