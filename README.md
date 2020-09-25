# Fault-Reporting-System
This project was created by my FYP team and myself. Since creation I have taken to cleaning, debugging and deploying the system alone :cry:

Fault Reporting system!
There is 2 font end client interface to this system and also one server and one NoSql database.

@Frontend Client@
[BCH-OPS] >Web Application< --Dashboard branch-- reactNative
*important note the web application can only start if the server is running and the API endpoints in the web client is correctly pointed at the server*
The web client allows users to retrieve the various objects in the database and display them. The web client consumes the API from the server.
The client allows for GET PUT POST and DELETE
To access the web client index, there is an authentication page using google firebase's authentication. 

[Fault Report] >Mobile application< --mobile branch-- reactNative and Expo CLI
The mobile client is resposible for sending the fault item, an json object directly to the database.
At the same time, the mobile client can also scan QR codes that represent a string stored in the database. Then matches the QR string and stores value in the json object accordingly

@Backend@
[Server] >Server< --Server branch-- NodeJs
the server is written in JS with nodeJs framework. The server provides endpoints for the client to connect to. 
It also consist of a webhook that on new record of data added into the database it will send an email to any email of choice.

[Database] >Database< --database branch-- NoSql JSON
in this branch will just include the structure of the database to allow everything to work smoothly.
Honestly if there isnt a database if you use google firebase it will be autogenerated.
