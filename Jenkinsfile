#!/usr/bin/env groovy

pipeline {
  agent any

  stages {
    stage('Build Dev') {
      steps {
        configFileProvider([configFile(fileId: 'HadithHouse-server_settings.py-Dev', variable: 'SERVER_SETTINGS_PATH')]) {
          sh('''chmod +x scripts/build.sh
./scripts/build.sh''')
        }
      }
    }

    stage('Lint Dev') {
      steps {
        sh('''chmod +x scripts/lint.sh
./scripts/lint.sh
exit $?''')
      }
    }

    stage('Test Dev') {
      steps {
        sh('''chmod +x scripts/test.sh
./scripts/test.sh
exit $?''')
      }
    }

    stage('Cleanup Dev Build') {
      steps {
        sh('''chmod +x scripts/cleanup.sh
./scripts/cleanup.sh
exit $?''')
      }
    }

    stage('Deploy Dev') {
      when {
        // Deploy only when the branch being built is master.
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        echo('Arhive HadithHouseApi folder')
        sh('zip -qr --exclude=venv/* /tmp/archive.zip *')

        echo('Copy the archive to dev.hadithhouse.net for deployment')
        sh('''scp /tmp/archive.zip deployer@dev.hadithhouse.net:/tmp/archive.zip
rm /tmp/archive.zip
''')

        echo ('Unzip the archive and start the deployment.')
        sh('''ssh deployer@dev.hadithhouse.net << EOF
cd /tmp
rm -rf HadithHouseApi
mkdir HadithHouseApi
unzip -qo /tmp/archive.zip -d HadithHouseApi
cd HadithHouseApi
chmod +x scripts/deploy.sh
./scripts/deploy.sh
delpoy_exit_code=$?
cd ..
rm -rf HadithHouseApi
exit $deploy_exit_code
EOF
exit $?
''')
      }
    }

    stage('Approve Dev') {
      when {
        // Run approval workflow only when the branch being built is master.
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        sh('''chmod +x scripts/approve.sh
./scripts/approve.sh
exit $?''')
      }
    }

    stage('Build Prod') {
      when {
        // Build prod only when the branch being built is master.
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        configFileProvider([configFile(fileId: 'HadithHouse-server_settings.py', variable: 'SERVER_SETTINGS_PATH')]) {
          sh('''chmod +x scripts/build.sh
./scripts/build.sh
exit $?''')
        }
      }
    }

    stage('Cleanup Prod Build') {
      when {
        // Build prod only when the branch being built is master.
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        sh('''chmod +x scripts/cleanup.sh
./scripts/cleanup.sh
exit $?''')
      }
    }

    stage('Deploy Prod') {
      when {
        // Deploy prod only when the branch being built is master.
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        echo('Arhive HadithHouseApi folder')
        sh('zip -qr --exclude=venv/* /tmp/archive.zip *')

        echo('Copy the archive to www.hadithhouse.net for deployment')
        sh('''scp /tmp/archive.zip deployer@www.hadithhouse.net:/tmp/archive.zip
rm /tmp/archive.zip''')

        echo ('Unzip the archive and start the deployment.')
        sh('''ssh deployer@www.hadithhouse.net << EOF
cd /tmp
rm -rf HadithHouseApi
mkdir HadithHouseApi
unzip -qo /tmp/archive.zip -d HadithHouseApi
cd HadithHouseApi
chmod +x scripts/deploy.sh
./scripts/deploy.sh
delpoy_exit_code=$?
cd ..
rm -rf HadithHouseApi
exit $deploy_exit_code
EOF
exit $?
''')
      }
    }
  }
}
