
# Complain API

Complain API is an NodeJs API for the insertion and processing of consumer complaints

## Architecture

<p align="center">
<img src="https://i.ibb.co/1zw1gtx/ARQUITETURA-3-D.png"  alt="Nest Logo" />
</p>

The project is structured in three microservices responsible for processing information and a gateway responsible for orchestrating requests. All working around the RabbitMQ message broker.

The microservices need only a instance of the NoSql MongoDB database to run, each.

The api-gateway exposes all necessary endpoints. Ex:

**Company Domain**
 - POST - /api/v1/companies
 - GET - /api/v1/companies
 - GET - /api/v1/companies/{id}
 - PUT - /api/v1/companies

**Complain Domain**
 - POST - /api/v1/complains
 - GET - /api/v1/complains

## Deploy and Run on Cloud

The idea of this project is to run entirely in the **cloud**. So, all services described here will preferably be in the cloud.

### 1. RabbitMQ
First you need to set up a server with RabbitMQ. I recommend using the service from bitnami. There, you will be able to easily create an AWS EC2 instance with an already configured RabbitMQ image. [In this link](https://docs.bitnami.com/aws/get-started-launchpad/) you will find a tutorial on how to link your AWS account with Bitnami.

With the server configured, create a virtual host that will be responsible for being our messaging broker in this project.

At the end of this step, we will have some information needed to configure the services later:
  - Server IP
  - username and password
  - broker access port: standard 5672
  - name of the virtual host created

### 2. MongoDb
In this step, you can create an account on the [MongoDB Atlas service.](https://www.mongodb.com/cloud/atlas) You can see in [this link](https://docs.atlas.mongodb.com/getting-started/) how simple it is to create an instance of a MongoDb database in the services.

At the end of this step, we will have some information needed to configure the services later:
  - Server URL
  - username and password
 
It is recommended that you create a cluster for each microservice (three in total), thus ensuring the high availability of the application.

### 3. API-GATEWAY and Microservices

To publish our applications, we will use application services in the cloud in conjunction with CI / CD practice, such as:
  - [AWS Elastic Beanstalk with AWS CodePipeline](https://aws.amazon.com/elasticbeanstalk/?nc1=h_ls)
  - [App Service with Azure DevOps](https://azure.microsoft.com/en-us/services/app-service/)
  - [Google App Engine with Google Cloud Build](https://cloud.google.com/appengine)
  - [Heroku with Heroku CI](https://www.heroku.com/continuous-integration)
  - [Digital Ocean with App Platform](https://www.digitalocean.com/docs/app-platform/)

In these services you easily integrate your repository (Github for example) with the process of deploying and scaling applications and web services. The service automatically takes care of the implementation, from capacity provisioning, load balancing and automatic scalability to application health monitoring

#### 3.1 API-GATEWAY
Clone the repository:
```bash
https://github.com/felipeomachado/api-gateway
```
**Set the environment variables according to the .env.example file**
```
# RABBITMQ CONFIGURATION
RABBITMQ_USER=your username configured on RabbitMQ service in step 1
RABBITMQ_PASSWORD=your username configured on RabbitMQ service in step 1
RABBITMQ_URL=server-ip:port/virtual-host
```

#### 3.2 MICRO-COMPANY-BACKEND
Clone the repository:
```
https://github.com/felipeomachado/micro-company-backend
```
**Set the environment variables according to the .env.example file**
```
# RABBITMQ CONFIGURATION
RABBITMQ_USER=your username configured on RabbitMQ service in step 1
RABBITMQ_PASSWORD=your password configured on RabbitMQ service in step 1
RABBITMQ_URL=server-ip:port/virtual-host

# MONGODB CONFIGURATION
MONBODB_USER=your username configured on MongoDB service in step 2
MONGODB_PASSWORD=your password configured on MongoDB service in step 2
MONGODB_URL=your url generated on MongoDB service in step 2
MONGODB_DBNAME=your database name configured on MongoDB service in step 2
```

#### 3.3 MICRO-LOCALE-BACKEND
Clone the repository:
```
https://github.com/felipeomachado/micro-locale-backend
```
**Set the environment variables according to the .env.example file**
```
# RABBITMQ CONFIGURATION
RABBITMQ_USER=your username configured on RabbitMQ service in step 1
RABBITMQ_PASSWORD=your password configured on RabbitMQ service in step 1
RABBITMQ_URL=server-ip:port/virtual-host

# MONGODB CONFIGURATION
MONBODB_USER=your username configured on MongoDB service in step 2
MONGODB_PASSWORD=your password configured on MongoDB service in step 2
MONGODB_URL=yout url generated on MongoDB service in step 2
MONGODB_DBNAME=your database name configured on MongoDB service in step 2
```

#### 3.4 MICRO-COMPLAIN-BACKEND
Clone the repository:
```
https://github.com/felipeomachado/micro-complain-backend
```
**Set the environment variables according to the .env.example file**
```
# RABBITMQ CONFIGURATION
RABBITMQ_USER=your username configured on RabbitMQ service in step 1
RABBITMQ_PASSWORD=your password configured on RabbitMQ service in step 1
RABBITMQ_URL=server-ip:port/virtual-host

# MONGODB CONFIGURATION
MONBODB_USER=your username configured on MongoDB service in step 2
MONGODB_PASSWORD=your password configured on MongoDB service in step 2
MONGODB_URL=yout url generated on MongoDB service in step 2
MONGODB_DBNAME=your database name configured on MongoDB service in step 2
```
## Deploy and Run locally
For deploy and run locally, normally follow steps 1 and 2 for configuring cloud services. You can also configure these services locally, but that is not the focus here.

After configuring the messaging and database services, do the same process below for each repository:
### Installation
```bash
$ git clone https://github.com/felipeomachado/micro-company-backend.git
$ cd micro-company-backend
$ npm install
```

### Running the app
Rename the **.env.example** file to .env and set set the environment variables 
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### Test
```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Endpoints
### Company Domain

**POST - /api/v1/companies**
Creates a new company object record. 
Request:
```
{
  "name": 'Company example'
}
```
Response:
```
201 - Created
```

**GET - /api/v1/companies**
Get All companies 
Response:
```
[
  {
    "_id": "5f85b25ba24a2700177cb9b7",
    "name": "Company Example 1",
    "createdAt": "2020-10-13T13:57:47.289Z",
    "updatedAt": "2020-10-13T13:57:47.289Z",
    "__v": 0
  },
  {
    "_id": "5f860cdcd9e858001138d734",
    "name": "Company Example 2",
    "createdAt": "2020-10-13T20:23:56.281Z",
    "updatedAt": "2020-10-13T20:23:56.281Z",
    "__v": 0
  },
]
```
**GET - /api/v1/companies/{_id}**
Get a company by ID 
Request Param: id of a specific company
Response:
```
{
    "_id": "5f85b25ba24a2700177cb9b7",
    "name": "Company Example 1",
    "createdAt": "2020-10-13T13:57:47.289Z",
    "updatedAt": "2020-10-13T13:57:47.289Z",
    "__v": 0
}
```
**PUT- /api/v1/companies/{_id}**
Update a specify company 
Request Param: id of a specific company
Request Body: 
```
{
    "name": "Company Example 10",
}
```

### Locale Domain

**POST - /api/v1/locales**
Creates a new locale object record. 
Request:
```
{
  "cityId": 2111300,
  "cityName": "SAO LUÍS",
  "state": "MA"
}
```
Response:
```
201 - Created
```

**GET - /api/v1/locales**
Get All locales
Response:
```
[
  {
    "_id": "5f8465a86190570d08513d61",
    "cityId": 2111300,
    "cityName": "SAO LUIS",
    "state": "MA",
    "__v": 0
  },
  {
    "_id": "5f8465d96190570d08513d62",
    "cityId": 1911401,
    "cityName": "TERESINA",
    "state": "PI",
    "__v": 0
  }
]
```
**GET - /api/v1/locales/{_id}**
Get a locale by ID 
Request Param: id of a specific locale
Response:
```
{
  "_id": "5f8465a86190570d08513d61",
  "cityId": 2111300,
  "cityName": "SAO LUIS",
  "state": "MA",
  "__v": 0
}
```
**PUT- /api/v1/locales/{_id}**
Update a specify locale
Request Param: id of a specific locale
Request Body: 
```
{
	"cityId": 2111301,
	"cityName": "TERESINA2",
	"state": "PI"
}
```

### Complain Domain

**POST - /api/v1/complains**
Creates a new complain object record. 
Request:
```
{
	"title": "Titulo 1 Reclamação Exemplo",
	"description": "Descrição 1 Reclamação Exemplo",
	"locale":  {
      "_id": "5f8465a86190570d08513d61"
    },
	"company": {
	  "_id": "5f847f2c2630c94014dd2deb"
	}
}
```
Response:
```
201 - Created
```

**GET - /api/v1/complains**
Get complains on a specific locale and/or company
Request Query Params: 
 -- ***cityId*** - the id of a specific locale
 -- ***companyId*** - the id of a specific company
Response:
```
[
  {
    "_id": "5f8480165853302e740692aa",
    "title": "Titulo Reclamação Exemplo 1",
    "description": "Descrição Reclamação Exemplo 1",
    "locale": "5f8465a86190570d08513d61",
    "company": "5f847f202630c94014dd2dea",
    "createdAt": "2020-10-12T16:11:02.516Z",
    "updatedAt": "2020-10-12T16:11:02.516Z",
    "__v": 0
  },
  {
    "_id": "5f8480245853302e740692ab",
    "title": "Titulo 2 Reclamação Exemplo 2",
    "description": "Descrição 2 Reclamação Exemplo 2",
    "locale": "5f8465a86190570d08513d61",
    "company": "5f847f202630c94014dd2dea",
    "createdAt": "2020-10-12T16:11:16.729Z",
    "updatedAt": "2020-10-12T16:11:16.729Z",
    "__v": 0
  },
]
```
**GET - /api/v1/complains/count**
Get how many complains have in a specific locale and/or company
Request Query Params: 
 -- ***cityId*** - the id of a specific locale
 -- ***companyId*** - the id of a specific company
Response:
```
2
```
## LIVE DEMO
You can test request calls using the urls below:

https://api-gateway-reclameaqui.herokuapp.com/api/v1/companies

https://api-gateway-reclameaqui.herokuapp.com/api/v1/locales

https://api-gateway-reclameaqui.herokuapp.com/api/v1/complains