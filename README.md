# next-people
NextJS app for people management

Deployed to: https://next-people.herokuapp.com/

## Run the app locally with docker
```
# Boot it up
docker-compose up -d
```
Visit http://localhost:3000 * Note that the first time you visit the page, NextJS compiles the page source so you'll need to refresh the page for the app to display correctly.

## Run Tests
* Note that currently the tests delete the local database entries to test the CRUD operations. This will eventually be refactored to use a separate test database.
```
# Run bash inside the next-app container
docker-compose exec next-app bash

# Run Tests
npm run test

# Exit the container
exit
```

## View the database
Mongo Admin interface at http://localhost:8081. After you've added at least one person you can view the People database collection at http://localhost:8081/db/express-mongo/people
