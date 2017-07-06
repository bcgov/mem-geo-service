pipeline {
    agent any
    tools {
        nodejs 'NodeJS-V8.x'
    }
    stages {
        stage('build mem-geo-service'){
            steps {
                openshiftBuild(bldCfg: 'mem-geo-service', showBuildLogs: 'true')
            }
        }
        stage('tag mem-geo-service'){
            steps {
                openshiftTag(srcStream: 'mem-geo-service', srcTag: 'latest', destStream: 'mem-geo-service', destTag: 'dev')
            }
        }
    }
}