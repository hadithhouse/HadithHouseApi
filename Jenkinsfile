#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    stage('Build Dev') {
      steps {
        configFileProvider([configFile(fileId: 'HadithHouse-server_settings.py-Dev', variable: 'SERVER_SETTINGS_PATH')]) {
          sh('''chmod +x build.sh
./build.sh''')
        }
      }
    }

    stage('Deploy Dev') {
      steps {
        echo('Arhive HadithHouseWebsite folder')
        sh('zip -qr /tmp/archive.zip *')

        echo('Copy the archive to dev.hadithhouse.net for deployment')
        sh('''scp /tmp/archive.zip deployer@dev.hadithhouse.net:/tmp/archive.zip
rm /tmp/archive.zip
''')

        echo ('Unzip the archive and start the deployment.')
        sh('''ssh deployer@dev.hadithhouse.net << EOF
cd /tmp
rm -rf HadithHouseWebsite
mkdir HadithHouseWebsite
unzip -qo /tmp/archive.zip -d HadithHouseWebsite
cd HadithHouseWebsite
chmod +x deploy.sh
./deploy.sh
cd ..
rm -rf HadithHouseWebsite
EOF''')
      }
    }

    stage('Approve Dev') {
      steps {
        echo 'Not implemented yet.'
      }
    }

    stage('Build Prod') {
      steps {
        configFileProvider([configFile(fileId: 'HadithHouse-server_settings.py', variable: 'SERVER_SETTINGS_PATH')]) {
          sh('''chmod +x build.sh
./build.sh''')
        }
      }
    }

    stage('Deploy Prod') {
      steps {
        echo('Arhive HadithHouseWebsite folder')
        sh('zip -qr /tmp/archive.zip *')

        echo('Copy the archive to www.hadithhouse.net for deployment')
        sh('''scp /tmp/archive.zip deployer@www.hadithhouse.net:/tmp/archive.zip
rm /tmp/archive.zip''')

        echo ('Unzip the archive and start the deployment.')
        sh('''ssh deployer@www.hadithhouse.net << EOF
cd /tmp
rm -rf HadithHouseWebsite
mkdir HadithHouseWebsite
unzip -qo /tmp/archive.zip -d HadithHouseWebsite
cd HadithHouseWebsite
chmod +x deploy.sh
./deploy.sh
cd ..
rm -rf HadithHouseWebsite
EOF''')
      }
    }
  }
}
