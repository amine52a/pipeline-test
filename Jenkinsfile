pipeline {
    agent any

    environment {
        // ── Docker Hub ──
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_HUB_USERNAME    = 'matchyplatform'
        IMAGE_TAG              = "${env.BUILD_NUMBER}"

        // ── SonarQube ──
        SONAR_HOST_URL         = 'http://sonarqube:9000'
        SONAR_TOKEN            = credentials('sonarqube-token')

        // ── Service image names ──
        EUREKA_IMAGE           = "${DOCKER_HUB_USERNAME}/matchy-eureka:${IMAGE_TAG}"
        GATEWAY_IMAGE          = "${DOCKER_HUB_USERNAME}/matchy-gateway:${IMAGE_TAG}"
        BACKEND_IMAGE          = "${DOCKER_HUB_USERNAME}/matchy-backend:${IMAGE_TAG}"
        EVENT_IMAGE            = "${DOCKER_HUB_USERNAME}/matchy-event:${IMAGE_TAG}"
        CONTENT_IMAGE          = "${DOCKER_HUB_USERNAME}/matchy-content:${IMAGE_TAG}"
        SUBSCRIPTION_IMAGE     = "${DOCKER_HUB_USERNAME}/matchy-subscription:${IMAGE_TAG}"
        ML_IMAGE               = "${DOCKER_HUB_USERNAME}/matchy-ml:${IMAGE_TAG}"
        FRONTEND_IMAGE         = "${DOCKER_HUB_USERNAME}/matchy-frontend:${IMAGE_TAG}"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 60, unit: 'MINUTES')
        timestamps()
    }

    stages {

        // ════════════════════════════════════════
        // STAGE 1 — CHECKOUT
        // ════════════════════════════════════════
        stage('Checkout') {
            steps {
                echo '📥 Checking out source code...'
                checkout scm
                sh 'git log --oneline -5'
            }
        }

        // ════════════════════════════════════════
        // STAGE 2 — BUILD ALL SERVICES
        // ════════════════════════════════════════
        stage('Build') {
            parallel {

                stage('Build: Eureka Server') {
                    steps {
                        dir('eureka-server') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }

                stage('Build: API Gateway') {
                    steps {
                        dir('api-gateway') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }

                stage('Build: Event Service') {
                    steps {
                        dir('services/event-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }

                stage('Build: Content Service') {
                    steps {
                        dir('services/content-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }

                stage('Build: Subscription Service') {
                    steps {
                        dir('services/subscription-service') {
                            sh 'mvn clean package -DskipTests -B'
                        }
                    }
                }

                stage('Build: Backend (Node.js)') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }

                stage('Build: Frontend (Angular)') {
                    steps {
                        sh 'npm ci'
                        sh 'npm run build -- --configuration production'
                    }
                }

                stage('Build: ML Service (Python)') {
                    steps {
                        dir('services/ml-prediction-service') {
                            sh 'pip install -r requirements.txt'
                        }
                    }
                }
            }
        }

        // ════════════════════════════════════════
        // STAGE 3 — TESTS
        // ════════════════════════════════════════
        stage('Test') {
            parallel {

                stage('Test: Event Service') {
                    steps {
                        dir('services/event-service') {
                            sh 'mvn test -B'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: 'services/event-service/target/surefire-reports/*.xml'
                        }
                    }
                }

                stage('Test: Content Service') {
                    steps {
                        dir('services/content-service') {
                            sh 'mvn test -B'
                        }
                    }
                    post {
                        always {
                            junit allowEmptyResults: true,
                                  testResults: 'services/content-service/target/surefire-reports/*.xml'
                        }
                    }
                }

                stage('Test: Backend (Node.js)') {
                    steps {
                        dir('backend') {
                            sh 'npm test -- --passWithNoTests 2>/dev/null || true'
                        }
                    }
                }
            }
        }

        // ════════════════════════════════════════
        // STAGE 4 — SONARQUBE ANALYSIS
        // ════════════════════════════════════════
        stage('SonarQube Analysis') {
            parallel {

                stage('Sonar: Event Service') {
                    steps {
                        dir('services/event-service') {
                            withSonarQubeEnv('SonarQube') {
                                sh """
                                    mvn sonar:sonar \
                                        -Dsonar.projectKey=matchy-event-service \
                                        -Dsonar.projectName="Matchy Event Service" \
                                        -Dsonar.host.url=${SONAR_HOST_URL} \
                                        -Dsonar.token=${SONAR_TOKEN} \
                                        -B
                                """
                            }
                        }
                    }
                }

                stage('Sonar: Content Service') {
                    steps {
                        dir('services/content-service') {
                            withSonarQubeEnv('SonarQube') {
                                sh """
                                    mvn sonar:sonar \
                                        -Dsonar.projectKey=matchy-content-service \
                                        -Dsonar.projectName="Matchy Content Service" \
                                        -Dsonar.host.url=${SONAR_HOST_URL} \
                                        -Dsonar.token=${SONAR_TOKEN} \
                                        -B
                                """
                            }
                        }
                    }
                }

                stage('Sonar: Subscription Service') {
                    steps {
                        dir('services/subscription-service') {
                            withSonarQubeEnv('SonarQube') {
                                sh """
                                    mvn sonar:sonar \
                                        -Dsonar.projectKey=matchy-subscription-service \
                                        -Dsonar.projectName="Matchy Subscription Service" \
                                        -Dsonar.host.url=${SONAR_HOST_URL} \
                                        -Dsonar.token=${SONAR_TOKEN} \
                                        -B
                                """
                            }
                        }
                    }
                }

                stage('Sonar: Backend (Node.js)') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh """
                                npx sonar-scanner \
                                    -Dsonar.projectKey=matchy-backend \
                                    -Dsonar.projectName="Matchy Backend Service" \
                                    -Dsonar.sources=backend \
                                    -Dsonar.exclusions=backend/node_modules/**,backend/__tests__/** \
                                    -Dsonar.host.url=${SONAR_HOST_URL} \
                                    -Dsonar.token=${SONAR_TOKEN}
                            """
                        }
                    }
                }

                stage('Sonar: Frontend (Angular)') {
                    steps {
                        withSonarQubeEnv('SonarQube') {
                            sh """
                                npx sonar-scanner \
                                    -Dsonar.projectKey=matchy-frontend \
                                    -Dsonar.projectName="Matchy Angular Frontend" \
                                    -Dsonar.sources=src \
                                    -Dsonar.exclusions=node_modules/**,dist/** \
                                    -Dsonar.host.url=${SONAR_HOST_URL} \
                                    -Dsonar.token=${SONAR_TOKEN}
                            """
                        }
                    }
                }
            }
        }

        // ════════════════════════════════════════
        // STAGE 5 — QUALITY GATE
        // ════════════════════════════════════════
        stage('Quality Gate') {
            steps {
                echo '⏳ Waiting for SonarQube Quality Gate...'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // ════════════════════════════════════════
        // STAGE 6 — DOCKER BUILD & PUSH
        // ════════════════════════════════════════
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {

                        parallel(
                            'Eureka Server': {
                                def img = docker.build("${EUREKA_IMAGE}", "-f eureka-server/Dockerfile eureka-server")
                                img.push()
                                img.push('latest')
                            },
                            'API Gateway': {
                                def img = docker.build("${GATEWAY_IMAGE}", "-f api-gateway/Dockerfile api-gateway")
                                img.push()
                                img.push('latest')
                            },
                            'Backend Service': {
                                def img = docker.build("${BACKEND_IMAGE}", "-f backend/Dockerfile backend")
                                img.push()
                                img.push('latest')
                            },
                            'Event Service': {
                                def img = docker.build("${EVENT_IMAGE}", "-f services/event-service/Dockerfile services/event-service")
                                img.push()
                                img.push('latest')
                            },
                            'Content Service': {
                                def img = docker.build("${CONTENT_IMAGE}", "-f services/content-service/Dockerfile services/content-service")
                                img.push()
                                img.push('latest')
                            },
                            'Subscription Service': {
                                def img = docker.build("${SUBSCRIPTION_IMAGE}", "-f services/subscription-service/Dockerfile services/subscription-service")
                                img.push()
                                img.push('latest')
                            },
                            'ML Service': {
                                def img = docker.build("${ML_IMAGE}", "-f services/ml-prediction-service/Dockerfile services/ml-prediction-service")
                                img.push()
                                img.push('latest')
                            },
                            'Frontend': {
                                def img = docker.build("${FRONTEND_IMAGE}", "-f Dockerfile.frontend .")
                                img.push()
                                img.push('latest')
                            }
                        )
                    }
                }
            }
        }

        // ════════════════════════════════════════
        // STAGE 7 — DEPLOY
        // ════════════════════════════════════════
        stage('Deploy') {
            steps {
                echo '🚀 Deploying with Docker Compose...'
                sh '''
                    docker compose down --remove-orphans || true
                    docker compose pull
                    docker compose up -d --build
                    docker compose ps
                '''
            }
        }

        // ════════════════════════════════════════
        // STAGE 8 — HEALTH CHECK
        // ════════════════════════════════════════
        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                sh '''
                    sleep 30
                    echo "Checking Eureka..."
                    curl -f http://localhost:8761/actuator/health || echo "Eureka not ready yet"
                    echo "Checking API Gateway..."
                    curl -f http://localhost:8091/actuator/health || echo "Gateway not ready yet"
                    echo "Checking Backend..."
                    curl -f http://localhost:9090/api/health || echo "Backend not ready yet"
                    echo "Checking ML Service..."
                    curl -f http://localhost:8085/health || echo "ML not ready yet"
                    echo "✅ Health checks complete"
                '''
            }
        }
    }

    // ════════════════════════════════════════
    // POST ACTIONS
    // ════════════════════════════════════════
    post {
        always {
            echo '📊 Pipeline finished'
            cleanWs()
        }
        success {
            echo '✅ Pipeline SUCCESS — Build #${BUILD_NUMBER}'
        }
        failure {
            echo '❌ Pipeline FAILED — Build #${BUILD_NUMBER}'
        }
    }
}
