---
title: "git rebase --onto 옵션 그리고 PR 쪼개기의 기술"
date: '2023-05-07T23:46:37.121Z'
template: 'post'
draft: false
slug: 'git/git-rebase-onto-and-split-pr-into-smaller-units'
category: 'git'
img: 'https://p-iknow.netlify.app/git.webp'
tags:
  - 'git'
  - 'github'
  - 'pull request'
description: 'git rebase --onto 옵션을 활용하여 PR을 보다 작은 단위로 작성하는 법에 대해 설명한다. pr에서 이전 커밋 내용 삭제하는 방법을 배울 수 있다.'

---

![git](../../../static/git.webp)

## 배경

코드량이 길고 고려해야 할 컨텍스트가 많으면 리뷰가 부담스럽다. 인간의 뇌는 한정된 자원을 가지고 집중할 수 있는데, 길고 컨텍스트가 많은 코드는 인지부하를 일으킨다.(`프로그래머의 뇌`에서 나온 내용) 목적이 분명하고 짧은 코드 일 수록 리뷰어가 알아야할 컨텍스트의 범위가 한정되고 리뷰 자체에 집중할 수 있는 여력이 생긴다. 따라서 PR을 잘개 쪼깨면 리뷰어가 보다 분명하게 코드를 이해할 수 있다. 분명한 이해를 바탕으로 한 코드리뷰는 리뷰의 품질 향상에 도움이 된다.

또한 한번에 완성된 코드를 PR에 올렸을 때 리뷰에서 코드 디자인의 변경이 제안이 되면 이런 제안은 코드 반영이 부담스럽다. 이미 PR에 올린 코드를 생성하는데 상당한 일정을 소비했을 것이고 데드라인이 얼마 안 남은 상태에서 코드의 근간을 흔드는 변경은 부담스럽다. 리뷰어 입장에서도 일정이 얼마 안남은 상태에서 suggestion 반영을 더 강제하기 어렵다. 짧은 코드, PR, 리뷰 사이클은 더 큰 변경으로 가기전, 이른 시간에 코드의 디자인이나 전체적인 얼개에 대한 리뷰가 가능하다.

결과적으로 짧고 분명한 PR은 리뷰와 코드 품질 향상에 좋다. 하지만 직접 코드를 생성하는 사람 입장에서 작은 단위의 PR은 작업흐름이 끊긴다. 잘개 쪼개서 올린 PR의 리뷰가 다음 작업을 진행하는데  blocker가 될 수 있다. 따라서 작업흐름을 끊지 않으면서, 리뷰를 잘개 쪼개는 기술이 필요하다. `git rebase`  명령어의 `--onto` 옵션이 PR을 잘개 쪼개는데 큰 도움을 줄 수 있다. 이 글에서는 `git rebase` 의 `onto`  옵션에 대해 알아보고 이를 이용해서 PR을 잘개 쪼개는 방법에 대해 알아본다.

## `git rebse --onto`  가 필요한 순간

은행 계좌 상세 화면 피쳐를 만들어야 한다고 가정해보자. 위에서 말했던 짧고 분명한 단위로 PR을 생성하기 위해, presenter(로직 없이 순수한 UI 만 가진 컴포넌트) 구현을 목적으로 작업을 시작하고, 첫번째 PR을 생성한다.

![image-20230424091956275](https://i.imgur.com/OcgW8Cz.png)

현 상태의 git 그래프는 다음과 같다.

![image-20230424091134741](https://i.imgur.com/HgLC7yT.png)

작업 환경에서 동료의 리뷰는 즉각 이루어지지 않는다. 비동기 리뷰가 작업의 blocker 가 되서는 안된다. 따라서 현재 까지 완성한 커밋을 base로 새로운 브랜치를 만들어 다음 작업을 이어나간다. 아래 이미지를 확인해보면 make-presenter-component 브랜치를 base로 해서 다음 작업 make-mock-data 브랜치를 생성해서 작업을 이어갔다.

![image-20230424092615536](https://i.imgur.com/PobNT3c.png)

mockData2 커밋을 완성할 무렵 동료의 리뷰가 끝나서 해당 PR을 작업브랜치로 squash merge 했고 상태는 아래와 같다.

![image-20230507110454968](https://i.imgur.com/lihbEWF.png)

이제 mockData 만들기가 완성됬다. 목데이터 만들기 작업 브랜치를 피쳐브랜치로 squash merge 하는 PR을 작성했다. 그런데 PR 확인하던중 문제를 발견했다.

![image-20230507111557640](https://i.imgur.com/rins6B9.png)

이전 PR에서 리뷰가 된 내용이 이번 PR에도 포함됬다. 물론 merge가 가능하지만, 이미 리뷰된 코드가 다시 PR, commit(피쳐브랜치관점에서는 commit) 에 포함되면 불필요한 컨텍스트가 생성되고, 리뷰 그리고 추후 히스토리 파악에 어려움이 생긴다.

![image-20230507111548395](https://i.imgur.com/1XnMK6n.png)

해당 이슈를 해결하기 위해 보통은 아래와 같이 피쳐브랜치를 작업브랜치로 머지한다.

![image-20230507112643091](https://i.imgur.com/7Wgfq5b.png)

files changed 에서 불필요한 변경사항이 사라졌다.

![image-20230507112820143](https://i.imgur.com/AIFf5TA.png)

다만 여전히 목데이터 작업과 무관한 커밋 history가 남아 있다.

![image-20230507113523517](https://i.imgur.com/qettv7V.png)

 리뷰어가 별도 커밋 내용을 확인하지 않고 최종적으로 완성된 코드만을 리뷰한다면 피쳐브랜치를 머지하는 것으로 문제가 해결된다. 허나 commit 은 코드를 이해하는데 필요한 중요한 정보다. 아래는 github에서 커밋별 리뷰를 진행하는 예제인데,  코드의 변경과 변경에 대한 이유와 맥락이 커밋 메시지에 드러나가기 때문에 코드의 이해가 편하다.

![image-20230507113722171](https://i.imgur.com/pM0PVbc.png)

자 그렇다면 어떻게 해당 작업의 commit history만 남길 수 있을까?  `git rebase --onto` 가 필요한 순간이다.

## `git reabse --onto`

git rebase --onto의 spec을 살펴보기 전에 바로 위 명령어를 사용해 목적을 달성해보자. 우선 git의 상태를 merge 이전 상태로 되돌린다.

![image-20230507115605341](https://i.imgur.com/ZHr6iRX.png)

그 후 아래 git 명령어를 입력한다.

```bash
git rebase --onto feat-bank-account-detail 6974c0d^
```

`feat-bank-account-detail` 은 새롭게 base가 될 커밋이고, `6974c0d` 는 mockData1 커밋의 hash값이다.

![image-20230507120259234](https://i.imgur.com/LI8219m.png)

해당 명령의 결과는 위와 같다. 마치 mockData1, mockData2를 순서대로 `cherryPick` 한것 같은 효과를 가져온다. 우리의 본 목적인 **"해당 작업에 필요한 커밋 히스토리(mockData1, mockData2)만 남긴다."** 를 달성했다. 목적을 달성했으니 PR을 만들어보자. (주의!!! 이미 `make-mock-data` 브랜치가 origin에 등록되어 있을 경우, rebase를 진행했으므로 force push를 해야한다. local의 git 상태는 orgin의 history와 base commit 이 다르다. 이런 경우 orgin으로의 push가 막히게 된다.)

![image-20230507165932286](https://i.imgur.com/lMFJa8t.png)

성공!! 이제 PR에 원하는 커밋히스토리만 남았다. 이제 `git rebase --onto` 명령어가 어떻게 이런 결과를 만들었는지 살펴보자.

```bash
git rebase --onto <newparent> <oldparent> <until>
git rebase --onto feat-bank-account-detail 6974c0d^

```
<newparent>:feat-bank-account-detail => rebase가 될 base commit  hash

<oldparent>: 6974c0d^(mockData1) => rebase를 시작할 commit hash, 여기서^는 parent 라는 의미로 mockData1 의 parent인 4e0c2(PresenterComponent3) 를 의미한다.

<until>: 생략 => 여기에 입력된 commit 까지 rebase 가 된다. 생략시 해당 현재 브랜치의 마지막 commit이 기본값이 된다.

따라서 `4e0c2(PresenterComponent3) ===  6974c0d^(mockData1)`  의 다음 커밋 `6974c0d(mockData1)` 부터  해당 브런치의 마지막 커밋인 `ab12ae(mockData2)` 구간을  `8b330(feat-bank-account-detail branch의 head commit)` 을 base로 하여 rebase하겟다는 뜻이다.  더 간단히 하면 `mockData1 ~ mockData2` 를 때네어  feat-bank-account-detail branch에 rebase 한다는 뜻이다.

이 정보를 가지고 또 다른 예제를 살펴보자

```
Before
A---B---C---F---G (branch)
         \
          D---E---H---I (HEAD my-branch)
```

위 상태에서 아래 명령어를 입력하면

```
git rebase --onto F D
```

아래와 같이 D 다음인 E 커밋부터 해당 브랜치의 마지막 커밋인 I까지가 F 커밋을 base로 하여 rebase 된다.

```
Before                                    After
A---B---C---F---G (branch)                A---B---C---F---G (branch)
         \                                             \
          D---E---H---I (HEAD my-branch)                E'---H'---I' (HEAD my-branch)
```

## 결론

사실 `git rebase --onto` 자체의 동작은 그리 어렵지 않다. 해당 명령어가 필요한 상황이 언제고, 해당 명령어를 통해 어떤 문제를 해결할 수 있는지 알기가 어렵다. `git rebase --onto` 옵션은 브랜치의 불필요한 커밋 히스토리를 정리하고, 깔끔한 PR을 올리는데 도움을 준다. 리뷰하기에 좋은 PR작성을 고민하고 있다면, 더 작은 단위로 PR을 작성하고, `git rebase --onto`를 이용해서 불필요한 히스토리를 정리해보자.



## 참고 자료

- [git rebase --onto 실습을 진행했던 repository](https://github.com/p-iknow/git-rebase-onto)
- [git rebase --onto에 대한 설명을 훌륭하게 해낸 블로그](https://womanonrails.com/git-rebase-onto)
