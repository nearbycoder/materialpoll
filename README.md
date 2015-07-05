# Material Poll
### This is a open source implementation of the strawpoll.me site. [DEMO](http://materialpoll.tk)
* Server built with Node, Express, Mongo and Socket.io
* Client built with Yo Angular and materializecss

#####Notes: if deploying to server make sure to add rewrites for html5Mode or change url within app to add hash
<pre>
NGINX
  server {
    server_name my-app;

    root /path/to/app;

    location / {
        try_files $uri $uri/ /index.html;
    }
}</pre>

#### Make sure to rename config.js.example to config.js with your mongodb connection string.

##### Create Poll
![Material Poll](img/material1.png?raw=true "Material Poll")
##### Vote on Poll
![Material Poll](img/material2.png?raw=true "Material Poll")
##### See Results
![Material Poll](img/material3.png?raw=true "Material Poll")
