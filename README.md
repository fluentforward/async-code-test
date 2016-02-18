# async-code-test
Example of approaches to asynchronous code and testing in Node.js

In this example, we will show a callback based approach to making API calls, in addition to a a promise based approach and a generator based approach using 'co'

 Each function will perform the same action of fetching
 a list of 'posts' from an API, and then for the first
 post, will fetch details of the user that created that post
 in a seperate API call.

 The function will then return the name of the user and
 title of the post
 
 This project demonstrates not only the differences in the application code with these approaches, but also the differences in test approach.
