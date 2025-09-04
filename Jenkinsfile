pipeline {
    agent any

    environment {
        // ===== GitHub =====
        GIT_REPO       = 'https://github.com/AngelPbx/UcaasS-Backend.git'
        GIT_BRANCH     = 'DevOps-Testing'
        GIT_CREDENTIAL = 'aaf11c10-a58c-44a6-bf63-2bf01cc80f03'   // Jenkins Credential ID
        
        // ===== Remote Web Server =====
 		WEB_SERVER_CONFIG = '7daaaf07-a062-4621-a522-9fe7e11a2223'
        WEB_SERVER_IP     = '10.0.6.100'
        CONTAINER_NAME    = 'ucaas-frontend'
        CONTAINER_PORT    = '8000'
        APP_PORT          = '80'   // Change depending on React app port
        DOCKER_BUILDKIT = "1"
    }

    stages {
        stage('Checkout') {
            steps {
               git branch: "${env.GIT_BRANCH}", 
                    credentialsId: "${env.GIT_CREDENTIAL}", 
                    url: "${env.GIT_REPO}"
            }
       }

          stage('Build Docker Image') {
            steps {
                 sh """
                 docker build --memory=2g --memory-swap=4g -t ucaas-frontend .
                 docker tag ucaas-frontend:latest 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-frontend:latest
                """
            }
       }

        stage('ECR Login & Push') {
            steps {                    
                    sh """
                    aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 940321698187.dkr.ecr.us-east-2.amazonaws.com
                    docker push 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-frontend:latest
                    docker rmi 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-frontend:latest || true             
                    
                    """
           }
        }
                }
}
