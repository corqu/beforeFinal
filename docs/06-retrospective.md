# 프로젝트 회고

## 1. 막혔던 지점

### 에러 상황 : 시스템 변스를 읽어오지 못함

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.

Reason: Failed to determine a suitable driver class

해결 방법 : 
1. application.yml 파일을 다시 하드코딩으로 해서 문제 확인
    - 우선 작동은 하게 바뀜
2. env의 변수 명을 spring 표준으로 바꿈
    - 변화 없음
3. system.env를 .env로 바꿈
    - 성공적으로 백엔드 동작

### 에러상황 : AWS ssh 접속 에러

Warning: Permanently added '43.201.95.204' (ED25519) to the list of known hosts.
Bad permissions. Try removing permissions for user: BUILTIN\\Users (S-1-5-32-545) on file c:/exam/finalprojects/beforePractice/quizapp_corqu.pem.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions for 'quizapp_corqu.pem' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "quizapp_corqu.pem": bad permissions
ec2-user@43.201.95.204: Permission denied (publickey,gssapi-keyex,gssapi-with-mic).

해결 방법 :
1. 기존 권한 초기화
`icacls.exe "quizapp_corqu.pem" /reset`

2. 현재 사용자(나)에게만 '읽기(R)' 권한 부여
`icacls.exe "quizapp_corqu.pem" /grant:r "%USERNAME%":"(R)"
`
 3. 상속 권한 제거 (다른 사용자가 못 보게 막음)
`icacls.exe "quizapp_corqu.pem" /inheritance:r`

### 에러상황 : 프론트 엔드가 백엔드에 fetch를 통해 요구하는 경우 ip를 찾아오지 못함
1. .env.production을 통해 ip설정해뒀지만 .gitignore에 속해있어 안됨
2. .env.production폴더는 root위치에 있고 frontend의 Dockerfile은 하위 디렉토리에 있어서 안됨
- 위치를 옮겨 재빌드 - 성공

### 에러상황 : 로그인시 400 에러가 뜨면서 로그인 안됨
- security부분 csrf 설정 누락 - 추가 후 해결

### 에러상황 : 깃 액션을 통해 자동화 과정 gradlew의 파일을 찾지 못함
- default 경로로 ./backend 추가
- 추가로 /gradlew로 바꿨다가 계속 에러 -> 그냥 / 를 사용하면 루트 경로로 사용 -> backend/gradlew 혹은 default로 ./backend, chmod에 ./gradlew 해서 해결
- deploy과정에서도 docker compose 이런식으로 써놔서 에러는 안났지만 서버가 다시 안열리는 현상 발견

### 에러상황 : CICD를 통해 실행되게 전부 바꿔버리니깐 태초 에러 ip주소를 못받는 에러로 회귀했다


## 2. 이해가 부족하다고 느낀 부분
1. frontend 부분 dockerfile : 이 부분은 전적으로 커서 ai에게 맡긴 부분으로
어떤 식으로 dockerfile을 써야되는지 조차 잘 모르겠다. 우선 ai를 통해 이미지를 생성하고 설계함으로서 프로그램이 정상적으로 돌아가지만
dockerfile을 작성하는 부분에 있어서 조금 더 공부가 필요해 보인다
2. ssh를 통해 pem 키 안에 들어간 후 명령어 사용 : 자바를 설치하고 도커를 설치하고 도커 컴포즈를 설치하는 일련의 과정부터
권한 설정 까지 전부 헷갈리는 부분이다
3. 환경변수 파일 설정 : 가장 에러를 고치는데 오래 걸린 부분이다. 처음엔 변수 명이 잘못된줄 알고 계속 고쳤지만
사실 잘못된 부분은 파일명이라는것을 깨달음. 비유하자면 동그란 구멍에 세모 막대기를 넣기 위해 모서리를 다듬으면서 점점 이상해지고 있었지만 사실 바로 옆에
동그란 막대가 있었던 것. 환경변수를 파일로 지정하는 것에는 관심이 없었지만 조금 찾아보고 공부해야함을 느낌
4. CI/CD 파일 작성 : GitHub Actions파일을 작성해야하는데 막상 작성하려고 보니 하나도 모르겠어서 대부분을 ai의 도움을 받았다. 지금은 조금 알겠다고 느끼지만
새로 프로젝트를 실행하고 새로 작성하게 된다면 또 전부 모를 것 같은 느낌이다. 다만 과정은 어느정도 익숙해졌으니 조금 공부하면 충분히 보완 가능할 것 같다.

## 3. 팀 프로젝트 전에 보완하고 싶은 기술
1. 프론트엔드 부분 - 커서 ai에게 도움을 받으면서 해결하지만 전부 도움을 받기에 프론트엔드 측에서 에러가 발생하면 고치는데 시간이 많이 소요된다. 코드를 작성하는 법보단 보면서 이해하는 능력을 
보완해야 한다.
2. 환경을 구성하는 자잘한 파일 작성 능력 - 프로젝트를 진행하면 많은 파일들을 작성하게 된다. application.yml, dockerfile, cicd 환경 설정용 yml, docker-compose.yml, 시스템 환경 변수용 .env 파일, 프로젝트 설명용 md파일
등등 많은 파일을 작성해야 하지만 대체로 많이 미숙하다. 이를테면 백엔드 프로젝트단에서의 dockerfile을 보면 환경을 구성해주고 jar파일을 복사해서 실행하라는 과정은 머리 속에 있지만 직접 작성하려고 하면
멈칫하게 된다. 다른 파일들도 비슷하다. 과정은 얼추 알아도 작성할 때 되면 어떻게 시작해야하는지 멈칫하며 ai를 꺼내들게 된다. 이 부분을 혼자서도 할 수 있게 공부할 필요가 있다.
3. 서버 관리 부분 - 이 부분은 이 프로젝트에서 실제로 사용해보지 못한 부분이다. 서버 사용량, 부하가 온 부분, 에러가 발생하면 알람 설정, 주기적으로 시행되야 할 명령어 등을
기회가 된다면 사용해보고싶다.

## 4. 진행하면서 느낀 점
이 프로젝트를 시작하기 전까진 혼자 마음속에 자신감이 있었다. 끝까지 다 배웠고 얼추 기억하니깐 혼자서도 잘 해낼거란 막연한 자신감. 그러나 막상 시작하고 나서
내가 얼마나 부족한지 알았다. 본 프로젝트에 들어가기 전 짧은 기간동안 좀 더 갈고닦겠다고 다짐했다. 많은 ai의 도움을 받으며 백엔드 부분 서비스 과정을 생략하고
배포까지의 과정을 진행했지만, 그래도 이 강의를 듣고 처음 시작한 뼈밖에 없던 미니 프로젝트에 살을 붙이고 눈, 코, 입을 붙여서 사람 형태 무언가로 만들어낸 것 같아서 뿌듯하다.