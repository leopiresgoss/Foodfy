# Foodfy
 Desafio final do Bootcamp da Rocketseat. 

## Objetivo
 Catálogo de diversas receitas com a opção para administrar, adicionar e deletar as mesmas.
 
## Instalação 
 * Instale o [NodeJs](https://nodejs.org/en/download/)
 * Para o banco de dados, foi utilizado o [PostgreSQL](https://www.postgresql.org/download/) e [Postbird](https://www.electronjs.org/apps/postbird)
 * Crie o banco de dados no Postbird rodando a query: 
 ```bash
CREATE DATABASE foodfydb;
```
 * Acesse o foodfydb e, então, copie e cole o restante do arquivo \foodfydb.sql
 * Rode a query 
 * No VS Code, rode:
  ```bash
npm install
```
  ```bash
 node seed.js
```
## Observação
#### Foi utilizado o [Mailtrap](https://mailtrap.io/) para o envio falso de emails para testar o login e reset de senha.
#### Caso queira utilizar essa opção, altere as configurações em: \src\lib\mailer.js

## Agradecimentos 
 Com muito carinho, saudo toda a equipe da Rocketseat por ter me proporcionado esse primeiro contato com a programação :purple_heart:
