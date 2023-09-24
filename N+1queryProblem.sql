-- The N+1 query problem is a common issue in database systems, including PostgreSQL.
-- It occurs when you fetch a list of objects from a database 
-- and then, for each object, make an additional query to retrieve related data.
--  This leads to a large number of database queries, which can severely impact performance.


-- A common solution to the N+1 query problem is to use eager loading, 
-- where you fetch all the necessary data in a single query,
-- rather than making separate queries for each related object. 
-- In PostgreSQL, you can achieve this using PL/pgSQL, a procedural language for PostgreSQL.
-- Below is a code example that demonstrates how to solve the N+1 query problem using PL/pgSQL.

-- Let's assume you have two tables: `authors` and `books`, 
-- where each author can have multiple books. 
-- You want to fetch a list of authors and their associated books.



-- Create sample tables

CREATE TABLE authors (
    author_id serial PRIMARY KEY,
    author_name text
);

CREATE TABLE books (
    book_id serial PRIMARY KEY,
    book_title text,
    author_id integer REFERENCES authors(author_id)
);

-- Sample data
INSERT INTO authors (author_name) VALUES
    ('Author 1'),
    ('Author 2');

INSERT INTO books (book_title, author_id) VALUES
    ('Book 1 by Author 1', 1),
    ('Book 2 by Author 1', 1),
    ('Book 1 by Author 2', 2);



-- Now, let's write a PL/pgSQL function to fetch authors and their books using eager loading:

CREATE OR REPLACE FUNCTION get_authors_with_books()
RETURNS TABLE (
    author_id integer,
    author_name text,
    books text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.author_id,
        a.author_name,
        ARRAY_AGG(b.book_title) AS books
    FROM
        authors a
    LEFT JOIN
        books b ON a.author_id = b.author_id
    GROUP BY
        a.author_id, a.author_name;
END;
$$ LANGUAGE plpgsql;



-- Now you can call this function to fetch authors and their books in a single query:

SELECT * FROM get_authors_with_books();


-- This will return a result set with columns for `author_id`, `author_name`, and an array of `books` for each author, 
-- effectively solving the N+1 query problem by loading all necessary data in one go.