pipeline {
    agent any

    environment {
        // ===== GitHub =====
        GIT_REPO       = 'https://github.com/AngelPbx/UcaaS-Frontend.git'
        GIT_BRANCH     = 'DevOps-Testing'
        GIT_CREDENTIAL = 'aaf11c10-a58c-44a6-bf63-2bf01cc80f03'   // Jenkins Credential ID

        // ===== Docker Registry (Hub or ECR) =====
        DOCKER_REGISTRY   = 'docker.io'
        DOCKER_NAMESPACE  = 'hare12'   // e.g. username or org
        IMAGE_NAME        = 'ucaas-frontend'
        IMAGE_TAG         = "${BUILD_NUMBER}"
        DOCKER_CREDENTIAL = 'c8ca2715-c702-4275-bf41-cc9a4ac8f987'     // Jenkins Credential ID

        // ===== Remote Web Server =====
 		WEB_SERVER_CONFIG = '9148794c-3118-4a39-a208-58be14568ded'
        WEB_SERVER_IP     = '10.0.24.129'
        CONTAINER_NAME    = 'ucaas-frontend'
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
                 docker build -t ${DOCKER_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} .
                 docker tag ${DOCKER_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_NAMESPACE}/${IMAGE_NAME}:latest
                """
            }
       }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${env.DOCKER_CREDENTIAL}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                    echo $DOCKER_PASS | docker login ${DOCKER_REGISTRY} -u $DOCKER_USER --password-stdin
                    docker push ${DOCKER_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${DOCKER_NAMESPACE}/${IMAGE_NAME}:latest		
                    docker logout ${DOCKER_REGISTRY}
                    """
                }
           }
        }

        stage('Clean Up Local Docker Image') {
            steps {
                sh """
                docker rmi ${DOCKER_NAMESPACE}/${IMAGE_NAME}:"${BUILD_NUMBER}" || true
                """
            }
        }

stage('Deploy to Web Server') {
    steps {
        sshagent (credentials: ['ae6cf6e8-edfc-429b-8f0b-88121457d75a']) {
            withCredentials([usernamePassword(credentialsId: 'c8ca2715-c702-4275-bf41-cc9a4ac8f987', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                sh """
                    ssh -o StrictHostKeyChecking=no admin@10.0.24.129 '
                        echo "${DOCKER_PASS}" | docker login docker.io -u "${DOCKER_USER}" --password-stdin &&
                        sudo docker pull hare12/ucaas-frontend:"${BUILD_NUMBER}" &&
                        sudo docker rm -f ucaas-frontend || true &&
                        sudo docker run -d --name ucaas-frontend -p 80:80 hare12/ucaas-frontend:"${BUILD_NUMBER}" &&
                        sudo docker image prune -f
                    '
                """
            }
        }
    }
}

                }
            }
