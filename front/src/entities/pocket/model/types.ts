// 포켓 타입 정의
export interface Pocket {
  id: number;
  name: string;
  accountName: string;
  totalAmount: number;
  savedAmount: number;
  type: "UNUSED" | "USING" | "USED";
  isActivated: boolean;
  isFavorite: boolean;
  imgUrl: string;
  endDate: string;
}

// 포켓 상세 타입 정의
export interface PocketDetail extends Pocket {
  accountId: number;
  categoryId: number;
  categoryName: string;
  productName: string;
  link: string;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

// 계좌 아이디 타입 정의
interface Account {
  id: number;
}

// 카테고리 아이디 타입 정의
interface Category {
  id: number;
}

// 금액 타입 정의
interface Amount {
  amount: number;
}

// 포켓 목록 조회 응답
export interface PocketListResponse {
  pockets: Pocket[];
}

// 포켓 검색 응답
export interface PocketSearchResponse {
  pocket: Pocket;
}

// 포켓 상세 조회 응답
export interface PocketDetailResponse {
  pocketdetail: PocketDetail;
}

// 포켓 필터링 응답
export interface PocketFilterResponse {
  pocket: Pocket[];
}

// 포켓 생성 링크 요청
export interface PocketCreateLinkRequest {
  link: string;
}

export interface PocketCreateLinkResponse {
  productUuid: string;
}

export interface PocketCreateWithLinkRequest {
  endDate: string | null;
  account: { id: number};
  categoryId: number;
  totalAmount: {amount: number};
  isFavorite: boolean;
  crawlingUuid: string;
}

export interface PocketCreateWithLinkResponse {
  pocketId: number;
}


// 포켓 생성 요청
export interface PocketCreateRequest {
  name: string;
  startDate: string | null;
  endDate: string | null;
  account: {
    id: number;
  };
  categoryId: number;
  totalAmount: {
    amount: number;
  },
  savedAmount: {
    amount: number;
  }
}

// 포켓 생성 응답
export interface PocketCreateResponse {
  id: number;
  name: string;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  savedAmount: number;
  link: string | null;
  imgUrl: string | null;
  startDate: string | null;
  endDate: string;
  isFavorite: boolean;
  type: "GATHERING" | "USING" | "COMPLETED";
  createdAt: string;
}

// 포켓 수정 요청
export interface PocketUpdateRequest {
  name: string;
  productName: string;
  link: string | null;
  startDate: string;
  endDate: string;
  account: Account;
  category: Category;
  totalAmount: Amount;
  savedAmount: Amount;
  isFavorite: boolean;
}

// 포켓 수정 응답
export interface PocketUpdateResponse {
  id: number;
  name: string;
  accountId: number;
  accountName: string;
  totalAmount: number;
  savedAmount: number;
  link: string | null;
  imgUrl: string | null;
  startDate: string;
  endDate: string;
  isFavorite: boolean;
  type: "GATHERING" | "USING" | "COMPLETED";
  updatedAt: string;
}

// 포켓 더 모으기 요청
export interface PocketGatherRequest {
  savedAmount: {amount : number};
}

// 포켓 더 모으기 응답
export interface PocketGatherResponse {
  id: number;
  name: string;
  previousAmount: number;
  addedAmount: number;
  currentAmount: number;
  totalAmount: number;
  progressPercentage: number;
  updatedAt: string;
}

// 포켓 즐겨찾기 요청
export interface PocketIsFavoriteRequest {
  isFavorite: boolean;
}

// 포켓 즐겨찾기 응답
export interface PocketIsFavoriteResponse {
  id: number;
  name: string;
  isFavorite: boolean;
}
