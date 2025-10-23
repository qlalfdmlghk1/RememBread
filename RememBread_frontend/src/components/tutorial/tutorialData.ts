export interface TutorialPage {
  title: string;
  subTitle?: string;
  description: string;
  componentKey: string;
}

export const tutorialPages: TutorialPage[] = [
  {
    title: "1. 인덱스카드 생성하기",
    subTitle: "1-1. 직접입력",
    componentKey: "MakeCardTutorial",
    description: "직접 입력하여 카드를 만들어보세요.",
  },
  {
    title: "1. 인덱스카드 생성하기",
    subTitle: "1-2. 대량 텍스트",
    componentKey: "MakeLargeStringTutoria",
    description: "대량 텍스트를 넣어서 카드를 만들어보세요.",
  },

  {
    title: "2. 인덱스카드 보기",
    subTitle: "2-1. 학습하기",
    componentKey: "StudyTutorial",
    description: "카드셋을 학습해볼까요? 학습 내역은 자동으로 기록돼요!",
  },
  {
    title: "2. 인덱스카드 보기",
    subTitle: "2-2. 테스트하기",
    componentKey: "TestTutorial",
    description: "공부했으면 테스트를 해봐야겠죠? \n마이페이지에서 성적을 확인해 볼 수 있어요.",
  },
  {
    title: "2. 인덱스카드 보기",
    subTitle: "2-3. 카드 가져오기",
    componentKey: "TakeCardSetTutorial",
    description: "다른 친구가 만든 카드를 가져올 수도 있어요!",
  },

  {
    title: "3. 학습 지도",
    subTitle: "3-1. 학습 경로 조회하기",
    componentKey: "MapTutorial",
    description: "나의 학습 기록을 지도에서 확인해 보세요!",
  },
  {
    title: "3. 학습 지도",
    subTitle: "3-2. 위치 알림 설정하기",
    componentKey: "LocationAlert",
    description: "학습 알람을 설정하여 원하는 위치에서 학습 알림을 받을 수 있어요!",
  },
  {
    title: "4. 두뇌 게임",
    subTitle: "4-1. 4종의 학습 게임",
    componentKey: "BrainGameTutorial",
    description: "공부하기 지쳤나요? \n 게임으로 머리를 말랑말랑하게 해보세요!",
  },
  {
    title: "5. 프로필",
    subTitle: "5-1. 프로필 조회",
    componentKey: "ProfileTutorial",
    description: "나의 프로필을 설정하고 학습기록을 확인해보세요.",
  },
  {
    title: "5. 프로필",
    subTitle: "5-2. 캐릭터 해금",
    componentKey: "CharacterTutorial",
    description: "쉿 비밀인데 캐릭터가 6종이나 있다는 사실!",
  },
];
