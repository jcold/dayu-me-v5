---
id: 1694247725127
created_at: 2023-09-09 16:22
---

## 本地启动Jenkins服务

```bash
java \
  -Djavax.net.ssl.trustStore=$JAVA_HOME/jre/lib/security/jssecacerts \
  -Djavax.net.ssl.trustStorePassword=changeit \
  -Dcom.sun.net.ssl.checkRevocation=false \
  -jar jenkins.war --httpPort=8080
```

## Pipeline 示例

之前用Jenkins的Pipeline做了一个自动打包的任务，现在都用一体化的CI/CD了，因此特将之前的配置记录下来以备之后查阅。

```groovy
pipeline {
    agent any

    parameters {
        string(name: 'version', defaultValue: '', description: '版本号')
        string(name: 'coverage', defaultValue: '', description: '灰度范围')
    }

    stages {
        
        stage('Build FE') {
            steps {
                build job: "daobox-note-fe",
                    parameters: [
                        string(name: 'module', value: "note:electron:build"),
                    ]  
                build job: "daobox-note-assets",
                    parameters: [
                    ]  
            }
        }


        stage('Build BE') {
            steps {
                build job: "daobox-note-be",
                    parameters: [
                        string( name: 'module', value: "macos_amd64"),
                        string( name: 'version', value: "${params.version}")
                    ]  
                    
                build job: "daobox-note-be",
                    parameters: [
                        string( name: 'module', value: "windows_amd64"),
                        string( name: 'version', value: "${params.version}")
                    ]  
            }
                    
           
        }


        stage("desktop") {
            steps {
                build job: "daobox-note-desktop",
                    parameters: [
                        string( name: 'module', value: "macos_build"),
                    ]  
                    
                build job: "daobox-note-desktop",
                    parameters: [
                        string( name: 'module', value: "windows_build"),
                    ]  
            }
        }
        

        stage("deploy") {
            steps {
                build job: "daobox-deploy-desktop",
                    parameters: [
                        string( name: 'channel', value: "alpha"),
                        string( name: 'coverage', value: "${params.coverage}"),
                    ]  
            }
        }
        
        
        
    }
}
```