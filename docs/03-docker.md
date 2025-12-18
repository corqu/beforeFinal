# Docker 구성 설명

## 1. Docker를 사용하는 이유
기본 개발할 때에는 로컬 환경을 사용하지만,
여러명이 사용하는 경우 혹은 배포를 위한 경우에는 
어떤 시스템 환경에서 프로젝트가 동작할지 모르기 때문에
도커를 통해 가상의 컴퓨터 환경에서 동일한 시스템 환경으로
개발 테스트 및 배포가 가능해짐

## 2. Backend Dockerfile
```
FROM eclipse-temurin:21-jre-alpine // 사용할 환경 설정 - 자바21이 설치되어있는 리눅스 컴퓨터를 사용
WORKDIR /app // 작업이 이루어질 디렉토리 - cd app과 동일
COPY build/libs/*.jar app.jar // 해당 로컬 위치에 있는 파일을 도커 컨테이너로 복사해감
EXPOSE 8080 // 사용할 포트를 알리는 역할
ENTRYPOINT ["java", "-jar", "app.jar"] // 컨테이너가 시작될 때 시행될 명령어
```

## 3. Frontend Dockerfile
```
FROM node:20-alpine AS builder // 사용할 환경 node:20, 빌더라고 명명
WORKDIR /app // 작업이 이루어질 디렉토리
COPY package*.json ./ 
RUN npm install // 작업이 시작하고 docker에서 npm 인스톨
COPY . .
RUN npm run build // npm 설치 후 실행 및 빌드

FROM node:18-alpine // node 18 환경에서 실행
WORKDIR /app 
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"] // 컨테이너가 실행되고 cmd창에 해당 명령어 실행
```

## 4. docker-compose 역할
현재 열고있는 도커 컨테이너 개수는 db, backend, frontend 세개이며, 서버가 커지게 된다면 예비용 컨테이너 등으로 
훨씬 더 늘어나게 된다. 이 때 모든 컨테이너를 직접 열게 된다면 시간이 무척이나 오래걸린다.
docker-compose파일에 service단에 일괄적으로 묶어서 관리하게 된다면 그런 점이 개선되며,
가시성이 개선되어 어떤 컨테이너들이 있는지 찾아보기 용이하다.