# Idea-share-project

<br>

## swagger API

https://idea-share-pro.herokuapp.com/api-docs

<br>

## Summary

Idea share 서비스는 팀원들과 프로젝트를 진행하는 과정에서 자유롭게 아이디어를 공유하고 확장할 수 있도록 하는 기능을 제공한다.

유저는 팀을 생성할 수 있으며 자동으로 해당 팀의 리더가 된다.

멤버들은 팀에 참가하기 위하여 리더가 팀 생성시에 설정한 패스워드와 팀 고유 코드가 필요하다. 해당 코드는 팀 생성 시 자동으로 생성된다.

팀 리더는 프로젝트를 생성할 수 있으며, 모든 팀원은 프로젝트에 접근 가능하다.

프로젝트 내에서 자유롭게 자신의 아이디어를 올릴 수 있다.

아이디어에 코멘트를 추가하여 기존 아이디어를 연결하는 새로운 아이디어를 낼 수 있다.

유저는 아이디어와 코멘트에 좋아요를 남길 수 있으며, 좋아요 순으로 정렬되어 가장 많은 좋아요를 받은 인스턴스가 상단에 위치하게 된다.

같은 팀에 속한 멤버는 모든 아이디어와 코멘트를 열람하고 좋아요를 남길 수 있는 권한이 있다.

<br>

<br>

## Security

#### jwt authentication

-   json web token 을 통한 사용자 로그인 구현
-   xss attack 에 대응하기 위해 httpOnly 쿠키에 토큰 저장
-   브라우저를 통한 접속이 아닌 경우를 위해 body 를 통한 토큰 전달

#### CSRF token

-   CSRF attack 에 대응하기 위해 도메인 접속 시 csrf 토큰 전달
-   idempotent 하지 않은 요청에 대해 csrf 토큰 검증

<br>

<br>

## Dependency injection

-   각 라우터와 컨트롤러, 데이터베이스 간 의존 관계를 줄이기 위해 인터페이스화
-   테스트에 용이한 구조로 설계

<br>

<br>

## Test code

-   jest 를 이용한 테스트 코드 작성
-   모든 middleware 와 controller 에 대한 테스트 완료

<br>

<br>

## Database

-   sql
-   prisma orm
