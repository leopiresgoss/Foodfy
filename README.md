# Foodfy
Rocketseat Bootcamp Final Project using NODE.JS

## Objective
 Foodfy is a catalog of several recipes with the option to manage, add and delete them.
 
## Installation 
 * Install [NodeJs](https://nodejs.org/en/download/)
 * For the database, download [PostgreSQL](https://www.postgresql.org/download/) and [Postbird](https://www.electronjs.org/apps/postbird)
 * Create the database at Postbird by running this query: 
 ```bash
CREATE DATABASE foodfydb;
```
 * Access foodfydb at Postbird and then copy and paste the rest of the \foodfydb.sql file
 * Run the pasted query query 
 * In your terminal, access the project repo and run:
  ```bash
npm install
```
  ```bash
 node seed.js
```
## Obs
#### [Mailtrap](https://mailtrap.io/) was used to send fake emails to test login and password reset.
#### If you want to test this option, change the settings in: \src\lib\mailer.js

## Acknowledgment 
 Thank you the entire Rocketseat team for providing me this first contact with the programming :purple_heart:
