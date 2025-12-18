# CI/CD 설명

## 1. GitHub Actions를 사용하는 이유
배포 후 지속적으로 코드를 수정하며 발전시켜 나가는데 수정본을 재배포 하려면 배포 과정을 모두 다시 해야하기 때문에 자동으로 배포과정을 맡아주는 GitHub Actions를 사용.
Jenkins도 있지만 소규모 작업에선 서버를 새로 만들어서 운영해야하는 jenkins보단 GitHub Actions가 적합하기 때문에 GitHub Actions를 사용

## 2. 워크플로우 실행 조건
/.github/workflows/ 안에 .yml파일을 만들면 git action이 읽고 워크플로우 생성.
yml파일 안에는 name, on, jobs가 필수 요소이며 name은 action과정 전체의 이름, on은 트리거 설정, jobs에는 실제로 실행될 단계들을 적어둠

## 3. 자동화된 단계별 흐름
우선 backend.yml파일을 살펴보면
```
name: CICD Pipeline
on:
  push:
    #    branches: [ "main" ]
    tags:
      - "v-backend-*"
  pull_request:
    branches: ["main"]
    
jobs:
  build-and-push:
    runs-on: ubuntu-22.04

    defaults:
      run:
        working-directory: ./backend

    steps:
    ...
    
  deploy:
    runs-on: ubuntu-22.04
    needs: build-and-push
    if: startsWith(github.ref, 'refs/tags/')

    steps:
      - name: Deploy to Server
```
과정으로 이루어져있다 여기서 전체 이름은 CICD PIPELINE, 실행 트리거는 v-backend의 tag가 깃에 푸시되거나
main 브랜치에 pull_request가 오면 실행된다. 하지만 실제 배포는 pull_request가 아닌 태그가 왔을때로 한정지어 놓아서
서버에서는 버젼을 지정한 도커 이미지만 가져가서 사용한다.

마찬가지로 프론트엔드도 동일하다
```
name: Frontend CICD Pipeline
on:
  push:
    tags:
      - "v-front-*"
jobs:
  frontend-build-and-push:
    runs-on: ubuntu-22.04
    defaults:
      run:
        working-directory: ./frontend

    steps:
      - name: Checkout code
        ...
        
  deploy:
    runs-on: ubuntu-22.04
    needs: frontend-build-and-push
    if: startsWith(github.ref, 'refs/tags/')

    steps:
      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST}}
          username: ${{ secrets.USERNAME}}
          key: ${{ secrets.KEY }}
          port: ${{ secrets.PORT }}
          script: |
            cd /home/${{ secrets.USERNAME }}/app

            docker-compose pull

            docker-compose up -d

            docker image prune -f
```
백엔드와 동일하게 정해진 태그를 받아야만 배포가 진행된다. 단지 커서를 사용해서 프론트를 개발했기에 새로운 branch에서 pull_request 받는 과정은 생략했다.

## 4. 실패했을 때 원인과 해결 과정

### 1. 경로 설정 오류
다른 실습 프로젝트와 달리 루트 폴더 안에 git이 있고 하위 폴더 backend에서 개발을 진행했기에 경로 신경을 전혀 쓰지 않았다.
실행 과정에서 gradlew를 찾을 수 없다는 오류를 보고 defaults라는 명령어를 찾아서 작성해서 해결하였다.

### 2. 도커 이미지 풀링 문제
위와 비슷한 이유이다. 백엔드 부분만 생각했기에 프론트부분을 제거해놨는데 도커 컴포즈 파일 안에 버전을 백과 프론트 전부 latest버전으로 바꾸면서
프론트 도커 이미지를 찾아오지 못해 에러가 발생했고, 프론트부분도 CI/CD파일을 만들어 수정이 되면 이미지를 보내고 latest버전을 유지하게 함으로서
다시 정상적으로 서버가 열리게 되었다.