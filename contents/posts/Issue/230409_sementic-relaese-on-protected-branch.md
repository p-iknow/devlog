---
title: "protected branch에 sementic-release/git을 적용할때 발생하는 이슈"
date: '2023-04-09T23:46:37.121Z'
template: 'post'
draft: false
slug: 'issue/sementic-release-on-protected-branch'
category: 'issue'
tags:
  - 'packages'
  - 'sementic-release'
  - 'issue'
description: 'sementic-release/git 에서 main 브랜치에 commit을 생성하는 단계에서 에러가 발생한다. 이를 해결하는 방법을 다룬다'
---
![issue log](https://imgur.com/h49WNfq.png)
## 배경

ci 에서 `sementic-release` 를 사용해 버전에 대한 태그를 생성하고 해당 내용을 main branch에 `commit` 하는 step이 있다. 이 step의 결과물로 아래 표시된 커밋이 main branch에 생성된다.
![image-20230409224855473](https://i.imgur.com/cO9wq2A.png)
이 역할을 하는 package가 `semantic-release/git` 인데, `.releaserc` 파일에 아래와 같이 정의하면 위와 같이 동작한다.
![image-20230409224923939](https://i.imgur.com/XHNNZKJ.png)
github action의 push rule로 main에 특정 commit이 merge되는 경우 sementic-release/git 을 통해 버전을 생성하고자 한다. ([관련 코드](https://github.com/p-iknow/style-config/blob/main/.github/workflows/release.yml))

```yaml
name: Release
on:
  push:
    branches:
      - main
      - beta
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
          persist-credentials: false
          ref: ${{ github.event.inputs.commit_sha }}
      - name: Semantic Release
        uses: cycjimmy/semantic-release-action@v3
        env:
          GITHUB_TOKEN: ${{ secrets.PERSONAL_GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

그러나 위 세팅을 적용후 실제 main 브랜치에 commit을 생성하는 단계에서 에러가 발생했다.

## 이슈
![image-20230409224016214](https://i.imgur.com/q3c1WNs.png)
![image-20230409224208365](https://i.imgur.com/guGQvzL.png)

```shell
deploy
Error: Command failed with exit code 1: git push --tags ***github.com/p-iknow/style-config HEAD:main
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
To https://github.com/p-iknow/style-config
 ! [remote rejected] HEAD -> main (protected branch hook declined)
error: failed to push some refs to 'https://github.com/p-iknow/style-config'
```

## 원인
`sementic-release/git` 이 적용된 레포의 `main` branch에는 `protected branch rule`이 적용되어 있다.  main branch로 merge 할 때는 꼭 pull request를 통해서 해야하는 rule이다. 이 rule이 있기 때문에 ci 상에서 sementic-release/git 이 만들어낸 commit merge가 실패하게 된 것이다.
![image-20230409225141638](https://i.imgur.com/BR3SnX8.png)



## 해결
위 rule을 무시하고 sementic-release/git 이 만들어 낸 commit을 merge 하기 위해서는 해당 Repo의 읽기/쓰기 권한이 부여된 Personal Access Token이 필요하다. 이 토큰을 만드는 과정은 아래와 같다.
Setting 클릭
[!github-settings](다ttps://i.imgur.com/8Lrc4cx.png)
Developer Settings 클릭
![image-20230409225328릭35](https://i.imgur.com/akZ66PB.png)
Personal access token 클릭하고 Generate new token 클릭
!ㅇimage-20230409225340964](https://i.imgur.com/9Mr48K4.png)
repo의 권한 체크
![token-setting크](https://i.imgur.com/CXgFUxX.png)
위 처럼 Personal Access Token 이 발급되면 레포의 Setting → Secrets → Actions 에 가서 Secrets을 만들어준다.
![image-20230409225405739](https://i.imgur.com/UmwjUdf.png)
그 후 [PR](https://github.com/p-iknow/style-config/pull/6/files) 예시 처럼 기본 GITHUB_TOKEN을 PERSONAL_GITHUB_TOKEN 으로 대체해두었다.
![image-20230409225711586](https://i.imgur.com/tdnWbFa.png)
이후에는 release action을 할 때 github의 write권한이 있기 때문에 protected branch rule 을 ignore하고 commit이 가능해진다. 이로써 protected-branch에 sementic-release/git 반영시 발생하는 이슈를 해결할 수 있다.

## 참고

- [깃헙 이슈](https://github.com/semantic-release/git/issues/196)