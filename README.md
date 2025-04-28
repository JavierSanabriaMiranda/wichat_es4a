# wichat_es4a

[![Actions Status](https://github.com/arquisoft/wichat_es4a/workflows/CI%20for%20wichat_es4a/badge.svg)](https://github.com/arquisoft/wichat_es4a/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es4a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es4a)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wichat_es4a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wichat_es4a)
[![Open Issues](https://img.shields.io/github/issues/arquisoft/wichat_es4a)](https://github.com/arquisoft/wichat_es4a/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/arquisoft/wichat_es4a)](https://github.com/arquisoft/wichat_es4a/issues?q=is%3Aissue+is%3Aclosed)
[![Open Pull Requests](https://img.shields.io/github/issues-pr/arquisoft/wichat_es4a)](https://github.com/arquisoft/wichat_es4a/pulls)
[![Closed Pull Requests](https://img.shields.io/github/issues-pr-closed/arquisoft/wichat_es4a)](https://github.com/arquisoft/wichat_es4a/pulls?q=is%3Apr+is%3Aclosed)

[![CodeScene Average Code Health](https://codescene.io/projects/66324/status-badges/average-code-health)](https://codescene.io/projects/66324)
[![CodeScene Hotspot Code Health](https://codescene.io/projects/66324/status-badges/hotspot-code-health)](https://codescene.io/projects/66324)
[![CodeScene System Mastery](https://codescene.io/projects/66324/status-badges/system-mastery)](https://codescene.io/projects/66324)
[![CodeScene general](https://codescene.io/images/analyzed-by-codescene-badge.svg)](https://codescene.io/projects/66324)

<img align="center" src="https://github.com/Arquisoft/wichat_es4a/blob/fb12a447b31793acba7aa8dd72ca83e6fe88f601/webapp/public/images/logo.png" height="200">

## Contributors

<p float="left">
  
  <img src="dog.gif" width="40%" align="right">

</p>

| Name | GitHub Profile |
|------|----------------|
| Andrea Acero Suárez | <a href="https://github.com/AndreaAcero"><img src="https://img.shields.io/badge/UO287876-Andrea%20Acero-blue"></a> |
| Ana Díez Díaz | <a href="https://github.com/UO288302"><img src="https://img.shields.io/badge/UO288302-Ana%20Díez-green"></a> |
| Aitor Gómez Ogueta | <a href="https://github.com/Aitorsiius"><img src="https://img.shields.io/badge/UO294066-Aitor%20Gómez-red"></a> |
| Adriana Herrero González | <a href="https://github.com/adrianaherreroglez"><img src="https://img.shields.io/badge/UO287543-Adriana%20Herrero-pink"></a> |
| Claudia Nistal Martínez | <a href="https://github.com/claudianistal"><img src="https://img.shields.io/badge/UO294420-Claudia%20Nistal-orange"></a> |
| Javier Sanabria Miranda | <a href="https://github.com/JavierSanabriaMiranda"><img src="https://img.shields.io/badge/UO293758-Javier%20Sanabria-yellow"></a> |

## Context

This is a base project for the Software Architecture course in 2024/2025. It is a basic application composed of several components.

- **User service**. Express service that handles the insertion of new users in the system.
- **Auth service**. Express service that handles the authentication of users.
- **LLM service**. Express service that handles the communication with the LLM.
- **Gateway service**. Express service that is exposed to the public and serves as a proxy to the two previous ones.
- **Donation service**. Express service that handles PayPal donations by creating orders, capturing payments, and sending personalized thank-you emails. It connects to PayPal's API.
- **Webapp**. React web application that uses the gateway service to allow basic login and new user features.

Both the user and auth service share a Mongo database that is accessed with mongoose.

## Quick start guide

First, clone the project:

```git clone git@github.com:arquisoft/wichat_es4a.git```

### LLM API key configuration

In order to communicate with the LLM integrated in this project, we need to setup an API key. Two integrations are available in this propotipe: gemini and empaphy. The API key provided must match the LLM provider used.

We need to create two .env files. 
- The first one in the llmservice directory (for executing the llmservice using ```npm start```). The content of this .env file should be as follows:
```
LLM_API_KEY="YOUR-API-KEY"
```
- The second one located in the root of the project (along the docker-compose.yml). This .env file is used for the docker-compose when launching the app with docker. The content of this .env file should be as follows:
```
LLM_API_KEY="YOUR-API-KEY"
```

Note that these files must NOT be uploaded to the github repository (they are excluded in the .gitignore).

An extra configuration for the LLM to work in the deployed version of the app is to create the same .env file (with the LLM_API_KEY variable) in the virtual machine (in the home of the azureuser directory).

### Launching Using docker
For launching the propotipe using docker compose, just type:
```docker compose --profile dev up --build```

### Component by component start
First, start the database. Either install and run Mongo or run it using docker:

```docker run -d -p 27017:27017 --name=my-mongo mongo:latest```

You can use also services like Mongo Altas for running a Mongo database in the cloud.

Now launch the auth, user and gateway services. Just go to each directory and run `npm install` followed by `npm start`.

Lastly, go to the webapp directory and launch this component with `npm install` followed by `npm start`.

After all the components are launched, the app should be available in localhost in port 3000.

## Deployment
For the deployment, we have several options. The first and more flexible is to deploy to a virtual machine using SSH. This will work with any cloud service (or with our own server). Other options include using the container services that all the cloud services provide. This means, deploying our Docker containers directly. Here I am going to use the first approach. I am going to create a virtual machine in a cloud service and after installing docker and docker-compose, deploy our containers there using GitHub Actions and SSH.

### Machine requirements for deployment
The machine for deployment can be created in services like Microsoft Azure or Amazon AWS. These are in general the settings that it must have:

- Linux machine with Ubuntu > 20.04 (the recommended is 24.04).
- Docker installed.
- Open ports for the applications installed (in this case, ports 3000 for the webapp and 8000 for the gateway service).

Once you have the virtual machine created, you can install **docker** using the following instructions:

```ssh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
```

### Continuous delivery (GitHub Actions)
Once we have our machine ready, we could deploy by hand the application, taking our docker-compose file and executing it in the remote machine. In this repository, this process is done automatically using **GitHub Actions**. The idea is to trigger a series of actions when some condition is met in the repository. The precondition to trigger a deployment is going to be: "create a new release". The actions to execute are the following:

![imagen](https://github.com/user-attachments/assets/7ead6571-0f11-4070-8fe8-1bbc2e327ad2)


As you can see, unitary tests of each module and e2e tests are executed before pushing the docker images and deploying them. Using this approach we avoid deploying versions that do not pass the tests.

The deploy action is the following:

```yml
deploy:
    name: Deploy over SSH
    runs-on: ubuntu-latest
    needs: [docker-push-userservice,docker-push-authservice,docker-push-llmservice,docker-push-gatewayservice,docker-push-webapp]
    steps:
    - name: Deploy over SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |
          wget https://raw.githubusercontent.com/arquisoft/wichat_es4a/master/docker-compose.yml -O docker-compose.yml
          docker compose --profile prod down
          docker compose --profile prod up -d --pull always
```

This action uses three secrets that must be configured in the repository:
- DEPLOY_HOST: IP of the remote machine.
- DEPLOY_USER: user with permission to execute the commands in the remote machine.
- DEPLOY_KEY: key to authenticate the user in the remote machine.

Note that this action logs in the remote machine and downloads the docker-compose file from the repository and launches it. Obviously, previous actions have been executed which have uploaded the docker images to the GitHub Packages repository.
