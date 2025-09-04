pipeline {
    agent any

    environment {
        // ===== GitHub =====
        GIT_REPO       = 'https://github.com/AngelPbx/UcaaS-Frontend.git'
        GIT_BRANCH     = 'DevOps-Testing'
        GIT_CREDENTIAL = 'aaf11c10-a58c-44a6-bf63-2bf01cc80f03'   // Jenkins Credential ID

        // ===== Remote Web Server =====
 		WEB_SERVER_CONFIG = '7daaaf07-a062-4621-a522-9fe7e11a2223'
        WEB_SERVER_IP     = '10.0.6.100'
        CONTAINER_NAME    = 'ucaas-frontend'
        APP_PORT          = '80'   // Change depending on React app port
        CONTAINER_PORT    = '80'
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
                 docker build --memory=2g --memory-swap=4g -t ucaas-backend .
                 docker tag ucaas-backend:latest 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:latest
                 docker tag ucaas-backend:latest 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:${IMAGE_TAG}"

                """
            }
       }

        stage('ECR Login & Push') {
            steps {
                aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 940321698187.dkr.ecr.us-east-2.amazonaws.com {
                    
                    sh """
                    docker push 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:latest
                    docker push 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:${IMAGE_TAG}"
                    docker rmi 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:latest || true
                    docker rmi 940321698187.dkr.ecr.us-east-2.amazonaws.com/ucaas-backend:${IMAGE_TAG}" || true                
                    
                    """
                }
           }
        }

//stage('Deploy to Web Server') {
 //   steps {
  //      sshagent (credentials: ["${env.WEB_SERVER_CONFIG}"]) {
   //         withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIAL}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
    //            sh """
     //               ssh -o StrictHostKeyChecking=no admin@${WEB_SERVER_IP} <<EOF
      //                  echo "${DOCKER_PASS}" | sudo docker login docker.io -u "${DOCKER_USER}" --password-stdin
       //                 cd /home/admin/Ucaas-Docker
        //                sudo docker-compose pull
         //               sudo docker-compose down
          //              sudo docker-compose up -d --remove-orphans
           //             sudo docker image prune -af
//EOF
 //               """
  //          }
   //     }
    //}
//}      
                }
}
