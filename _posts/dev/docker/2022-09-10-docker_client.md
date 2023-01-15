---
title:  "[Docker] Docker Client 주요 명령어"
excerpt: "Docker Client 주요 명령어"

categories:
  - Dev
  - Docker
tags:
  - Docker
  - DevOps

last_modified_at: 2022-09-10
use_math: false
---

{% include notice_box.html text="이 내용은 [따라하며 배우는 도커와 CI 환경]을 보고 정리한 내용입니다." %}

🐋 **<u>docker run [이미지_이름]</u>**: 이미지로부터 컨테이너를 생성하고 실행하라. `create`와 `start`의 합과 동일.

* docker run [이미지_이름] **<u>[추가_명령어]</u>** : 원래 이미지 속 '컨테이너 실행 시의 자동 작동 명령어'가 아닌 [추가_명령어]를 수행하라.
    ```bash
    docker run alpine ls 
        # 컨테이너 실행 후, ls로 내부 파일 목록 출력
    ```
* docker run -it [컨테이너_ID] **<u>sh</u>** : 외부에서 컨테이너의 셸 환경으로 접속. `docker exec -it [컨테이너_ID] sh`와 동일한 기능.

🐋 **<u>docker create [이미지_이름]</u>** : 해당 이미지로 컨테이너를 생성하라.

🐋 **<u>docker start [컨테이너_ID/이름]</u>** : 해당 컨테이너를 시작해서 실행하라

* docker start [컨테이너_ID/이름] **<u>-a</u>** : 컨테이너 안에서 출력되는 결과물을 터미널에서 볼 수 있음. (a = attach)

🐋 **<u>docker ps</u>** : 현재 실행중인 컨테이너를 나열하라. (ps = process status)

* docker ps **<u>--format 'table {% raw %}{{.[표시할_항목]}}{% endraw %} \t ...'</u>** : 실행중인 컨테이너 정보 중 특정 항목만 표시하라.
    ```bash
    docker ps --format 'table {% raw %}{{.Names}} \t {{.Image}} \t {{.Status}}{% endraw %}'
        # 컨테이너의 이름, 이미지, 상태를 탭으로 구분하여 출력
    ```
* docker ps **<u>-a</u>** : 중단된 컨테이너까지 모두 표시하라. (a = all)

🐋 **<u>docker rename [컨테이너_이름] [변경할_이름]</u>** : 컨테이너의 이름을 변경하라

🐋 **<u>docker stop [컨테이너_ID/이름]</u>** : 실행중인 작업을 모두 마친 뒤(`SIGTERM`) 컨테이너를 중지(`SIGKILL`)하라.

🐋 **<u>docker kill [컨테이너_ID/이름]</u>** : 바로 컨테이너를 중지하라(`SIGTERM` 없이 바로 `SIGKILL`).

🐋 **<u>docker rm [컨테이너_ID/이름]</u>** : 컨테이너를 삭제하라. 단, 컨테이너는 반드시 중지된 상태여야 함. (rm = remove)

* docker rm **`docker ps -a -q`** : 중지된 모든 컨테이너를 삭제하라. 백틱(\`)으로 둘러싸인 내용은 일종의 명령어인데, `docker ps -a -q`는 모든(`-a`) 중단된 컨테이너의 ID를(`-q`, q = quiet) 출력함. 따라서 그 아이디를 모두 모아 `rm`을 하는 것임.

🐋 **<u>docker rmi [이미지_ID]</u>** : 도커 이미지를 삭제함

🐋 **<u>docker system prune</u>** : 중지된 모든 컨테이너, 네트워크, 이미지 등을 삭제하고, 삭제된 목록과 확보한 사이즈를 알려줌

🐋 **<u>docker exec [컨테이너_ID] [명령어]</u>** : 외부에서 컨테이너에 명령어 전달

* docker exec **<u>-it</u>** [컨테이너_ID] <명령어>: 명령어 실행 후에도 다음 작업이 가능. 바로 꺼지지 않음. (i = interactive, t = terminal)
* docker exec -it [컨테이너_ID] **<u>sh</u>** : 외부에서 컨테이너에 셸 환경으로 접속. 접속 후에는 `ls`나 `touch` 등 일반 터미널처럼 해당 컨테이너의 셸을 사용할 수 있음.