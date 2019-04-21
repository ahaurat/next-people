# next-people
NextJS app for people management

Deployed to: https://next-people.herokuapp.com/

## Run the app locally with docker
```
# Clone the repo
git clone https://github.com/ahaurat/next-people

# Install packages
cd next-people
npm install

# Boot it up
docker-compose up -d

# Look at the logs
docker-compose logs -f
```
Visit http://localhost:3000 * Note that the first time you visit the page, NextJS compiles the page source so you may need to refresh the page for the app to display correctly.

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
Mongo Admin interface can be viewed at http://localhost:8081. After you've added at least one person, you can view the People database collection at http://localhost:8081/db/express-mongo/people

## References and included technologies
https://github.com/zeit/next.js

https://mochajs.org/

Some inspiration for testing from:
https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai

This post helped me get the tests working with the NextJS express implementation:
https://github.com/zeit/next.js/issues/1300#issuecomment-282910431

## TODO
Add some tests for the react components
