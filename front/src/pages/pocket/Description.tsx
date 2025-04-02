import { addCommas } from '@/shared/lib';
import {
  ArrowRight,
  Plus,
  Minus,
  Calendar,
  Bell,
  MessageCircle,
  CreditCard,
  Receipt,
  HelpCircle,
  Settings,
  Clock,
  Tag,
} from 'lucide-react';
import { useState } from 'react';

export default function Description() {
  // 각 FAQ 항목의 확장/축소 상태를 관리
  const [openFaqs, setOpenFaqs] = useState({
    faq1: false,
    faq2: false,
    faq3: false,
    faq4: false,
    faq5: false,
  });

  console.log(addCommas(1000000));

  // FAQ 항목의 토글 기능
  const toggleFaq = (faqId) => {
    setOpenFaqs({
      ...openFaqs,
      [faqId]: !openFaqs[faqId],
    });
  };

  return (
    <div
      className="mx-auto w-full max-w-4xl bg-gray-50 px-5 py-10 text-gray-800"
      style={{ fontFamily: 'Pretendard, sans-serif' }}
    >
      {/* 헤더 - 포켓 소개 */}
      <section className="mb-12">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="mb-6 flex items-center">
            <div className="mr-4 rounded-full bg-[var(--color-brand-primary-100)] p-3">
              <CreditCard size={24} className="text-[var(--color-brand-primary-500)]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">포켓 이용 가이드</h1>
          </div>

          <p className="mb-6 text-gray-600">
            '포켓'은 다가오는 소비를 계획하고 자산을 효율적으로 관리할 수 있는 가상 지갑
            서비스입니다. 포켓의 주요 기능과 이용 방법을 확인해보세요.
          </p>

          <div className="mb-4 rounded-lg bg-orange-50 p-4">
            <div className="flex items-start">
              <div className="mr-3 shrink-0 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <HelpCircle size={18} className="text-[var(--color-brand-primary-500)]" />
              </div>
              <p className="text-gray-700">
                <span className="font-medium">포켓이란?</span> 실제 계좌에서 자금을 이체하지 않고도,
                앞으로 사용할 돈을 용도별로 구분해 관리할 수 있는 가상의 지갑입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 자주 묻는 질문 섹션 */}
      <section className="mb-12">
        <h2 className="mb-6 px-2 text-xl font-bold">자주 묻는 질문</h2>

        {/* 질문 1 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
          <button
            className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left"
            onClick={() => toggleFaq('faq1')}
          >
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <span className="font-bold text-[var(--color-brand-primary-500)]">Q</span>
              </div>
              <span className="font-medium">포켓은 어떤 장점이 있나요?</span>
            </div>
            {openFaqs.faq1 ? (
              <Minus size={20} className="text-gray-400" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
          </button>

          {openFaqs.faq1 && (
            <div className="p-5">
              <div className="mb-4 pl-10">
                <div className="flex flex-wrap gap-4">
                  <div className="flex min-w-64 flex-1 items-start rounded-lg bg-gray-50 p-3">
                    <div className="mr-2 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                      <Clock size={16} className="text-[var(--color-brand-primary-500)]" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">미래 소비 대비</p>
                      <p className="text-xs text-gray-600">
                        지출 계획을 세워 자금을 미리 준비할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-64 flex-1 items-start rounded-lg bg-gray-50 p-3">
                    <div className="mr-2 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                      <Settings size={16} className="text-[var(--color-brand-primary-500)]" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">가상 계좌 관리</p>
                      <p className="text-xs text-gray-600">
                        자금 이체 없이 시각적으로 자산을 용도별로 구분합니다.
                      </p>
                    </div>
                  </div>

                  <div className="flex min-w-64 flex-1 items-start rounded-lg bg-gray-50 p-3">
                    <div className="mr-2 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                      <Calendar size={16} className="text-[var(--color-brand-primary-500)]" />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-medium">일정 기반 계획</p>
                      <p className="text-xs text-gray-600">
                        사용 예정일을 기준으로 지출을 체계적으로 관리합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 질문 2 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
          <button
            className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left"
            onClick={() => toggleFaq('faq2')}
          >
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <span className="font-bold text-[var(--color-brand-primary-500)]">Q</span>
              </div>
              <span className="font-medium">포켓은 어떻게 만드나요?</span>
            </div>
            {openFaqs.faq2 ? (
              <Minus size={20} className="text-gray-400" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
          </button>

          {openFaqs.faq2 && (
            <div className="p-5">
              <div className="space-y-4 pl-10">
                <div className="flex items-start">
                  <div className="mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)] text-[var(--color-brand-primary-500)]">
                    1
                  </div>
                  <div>
                    <p className="mb-1 font-medium">지출 정보 입력</p>
                    <p className="mb-1 text-sm text-gray-600">
                      포켓 이름, 목적, 금액을 입력하세요. (예: 제주도 여행, 세탁기 구매)
                    </p>
                    <div className="mt-2 rounded-lg bg-gray-50 p-3 text-sm">
                      <div className="flex items-center text-[var(--color-brand-primary-500)]">
                        <Tag size={14} className="mr-2" />
                        <p>온라인 쇼핑 시 상품 링크를 첨부하면 정보가 자동으로 불러와집니다.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)] text-[var(--color-brand-primary-500)]">
                    2
                  </div>
                  <div>
                    <p className="mb-1 font-medium">카테고리와 계좌 선택</p>
                    <p className="text-sm text-gray-600">
                      지출 목적에 맞는 카테고리를 선택하고, 연결할 계좌를 지정합니다.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[var(--color-brand-primary-100)] px-2 py-1 text-xs text-[var(--color-brand-primary-500)]">
                        정기구독
                      </span>
                      <span className="rounded-full bg-[var(--color-brand-primary-100)] px-2 py-1 text-xs text-[var(--color-brand-primary-500)]">
                        여행
                      </span>
                      <span className="rounded-full bg-[var(--color-brand-primary-100)] px-2 py-1 text-xs text-[var(--color-brand-primary-500)]">
                        식비
                      </span>
                      <span className="rounded-full bg-[var(--color-brand-primary-100)] px-2 py-1 text-xs text-[var(--color-brand-primary-500)]">
                        건강/의료
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-3 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)] text-[var(--color-brand-primary-500)]">
                    3
                  </div>
                  <div>
                    <p className="mb-1 font-medium">목표 금액 설정</p>
                    <p className="mb-2 text-sm text-gray-600">
                      지출에 필요한 금액을 설정하세요. 이 금액은 실제 계좌에서 차감되지 않고
                      가상으로 구분됩니다.
                    </p>

                    <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">목표 금액</span>
                        <span className="text-sm font-medium">300,000원</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 w-1/3 rounded-full bg-[var(--color-brand-primary-500)]"></div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-gray-500">현재 100,000원</span>
                        <span className="text-xs text-gray-500">33%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 질문 3 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
          <button
            className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left"
            onClick={() => toggleFaq('faq3')}
          >
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <span className="font-bold text-[var(--color-brand-primary-500)]">Q</span>
              </div>
              <span className="font-medium">포켓에 돈을 어떻게 채우나요?</span>
            </div>
            {openFaqs.faq3 ? (
              <Minus size={20} className="text-gray-400" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
          </button>

          {openFaqs.faq3 && (
            <div className="p-5">
              <div className="pl-10">
                <p className="mb-4 text-gray-600">
                  목표 금액을 한 번에 채울 필요 없이, 여유가 있을 때마다 조금씩 채워넣을 수
                  있습니다.
                </p>

                <div className="mb-4 flex flex-col gap-3 md:flex-row">
                  <div className="flex-1 rounded-lg bg-[var(--color-brand-primary-100)] p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs font-bold text-[var(--color-brand-primary-500)]">
                          1
                        </span>
                      </div>
                      <p className="text-sm font-medium">처음 시작은 부담 없이</p>
                    </div>
                    <p className="mb-2 text-xs text-gray-700">처음에는 소액으로 시작</p>
                    <div className="mb-2 h-2 w-full rounded-full bg-white">
                      <div className="h-2 w-1/5 rounded-full bg-[var(--color-brand-primary-500)]"></div>
                    </div>
                    <p className="text-xs text-gray-500">목표의 20%</p>
                  </div>

                  <div className="flex-1 rounded-lg bg-orange-50 p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs font-bold text-[var(--color-brand-primary-500)]">
                          2
                        </span>
                      </div>
                      <p className="text-sm font-medium">조금씩 더하기</p>
                    </div>
                    <p className="mb-2 text-xs text-gray-700">여유 있을 때 추가</p>
                    <div className="mb-2 h-2 w-full rounded-full bg-white">
                      <div className="h-2 w-3/5 rounded-full bg-[var(--color-brand-primary-500)]"></div>
                    </div>
                    <p className="text-xs text-gray-500">목표의 60%</p>
                  </div>

                  <div className="flex-1 rounded-lg bg-[var(--color-brand-primary-100)] p-4">
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs font-bold text-[var(--color-brand-primary-500)]">
                          3
                        </span>
                      </div>
                      <p className="text-sm font-medium">목표 달성!</p>
                    </div>
                    <p className="mb-2 text-xs text-gray-700">지출일까지 완성</p>
                    <div className="mb-2 h-2 w-full rounded-full bg-white">
                      <div className="h-2 w-full rounded-full bg-[var(--color-brand-primary-500)]"></div>
                    </div>
                    <p className="text-xs text-gray-500">목표의 100%</p>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="flex items-center text-sm text-gray-700">
                    <span className="mr-2 text-[var(--color-brand-primary-500)]">💡</span>
                    '더 채우기' 버튼을 통해 언제든지 포켓에 자금을 추가할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 질문 4 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
          <button
            className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left"
            onClick={() => toggleFaq('faq4')}
          >
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <span className="font-bold text-[var(--color-brand-primary-500)]">Q</span>
              </div>
              <span className="font-medium">포켓으로 어떻게 결제하나요?</span>
            </div>
            {openFaqs.faq4 ? (
              <Minus size={20} className="text-gray-400" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
          </button>

          {openFaqs.faq4 && (
            <div className="p-5">
              <div className="space-y-4 pl-10">
                <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-3 flex items-center">
                      <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                        <CreditCard className="text-[var(--color-brand-primary-500)]" size={16} />
                      </div>
                      <p className="font-medium">포켓에서 직접 결제</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      결제 시 앱 내에서 포켓을 선택하면 자동으로 사용 완료 처리됩니다.
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-3 flex items-center">
                      <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                        <Receipt className="[var(--color-brand-primary-500)]" size={16} />
                      </div>
                      <p className="font-medium">일반 결제 후 연결</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      이미 결제한 내역도 포켓에 연결해 관리할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <h4 className="mb-2 font-medium">결제 프로세스</h4>
                  <ol className="space-y-2">
                    <li className="flex items-center">
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs text-[var(--color-brand-primary-500)]">1</span>
                      </div>
                      <p className="text-sm">앱에서 '결제하기' 선택</p>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs text-[var(--color-brand-primary-500)]">2</span>
                      </div>
                      <p className="text-sm">사용할 포켓 선택</p>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <span className="text-xs text-[var(--color-brand-primary-500)]">3</span>
                      </div>
                      <p className="text-sm">결제 확인 후 완료</p>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 질문 5 */}
        <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
          <button
            className="flex w-full items-center justify-between border-b border-gray-100 p-5 text-left"
            onClick={() => toggleFaq('faq5')}
          >
            <div className="flex items-center">
              <div className="mr-3 rounded-full bg-[var(--color-brand-primary-100)] p-2">
                <span className="font-bold text-[var(--color-brand-primary-500)]">Q</span>
              </div>
              <span className="font-medium">포켓의 상태는 어떻게 변하나요?</span>
            </div>
            {openFaqs.faq5 ? (
              <Minus size={20} className="text-gray-400" />
            ) : (
              <Plus size={20} className="text-gray-400" />
            )}
          </button>

          {openFaqs.faq5 && (
            <div className="p-5">
              <div className="pl-10">
                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <h4 className="mb-3 font-medium">포켓 상태 흐름</h4>
                  <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Calendar size={20} className="text-gray-600" />
                      </div>
                      <p className="text-xs">계획됨</p>
                    </div>

                    <ArrowRight size={16} className="rotate-90 text-gray-400 md:rotate-0" />

                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <Plus size={20} className="text-orange-500" />
                      </div>
                      <p className="text-xs">모으는 중</p>
                    </div>

                    <ArrowRight size={16} className="rotate-90 text-gray-400 md:rotate-0" />

                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <CreditCard size={20} className="text-[var(--color-brand-primary-500)]" />
                      </div>
                      <p className="text-xs">사용 중</p>
                    </div>

                    <ArrowRight size={16} className="rotate-90 text-gray-400 md:rotate-0" />

                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-brand-primary-100)]">
                        <Receipt size={20} className="text-[var(--color-brand-primary-500)]" />
                      </div>
                      <p className="text-xs">완료됨</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <div className="flex items-start">
                    <div className="mr-3 shrink-0 rounded-full bg-white p-2">
                      <Bell size={16} className="text-[var(--color-brand-primary-500)]" />
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">참고:</span> 연동된 계좌의 잔액이 부족하면
                      포켓은 일시적으로 비활성화됩니다. 계좌에 자금을 추가하면 자동으로 복구됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 도움말 배너 */}
      <section>
        <div className="rounded-xl bg-[var(--color-brand-primary-100)] p-6 text-white shadow-md">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-[var(--color-gray-800)]">
                더 궁금한 점이 있으신가요?
              </h2>
              <p className="text-sm text-[var(--color-gray-800)]">
                포켓 사용 방법, 기능 안내 등 다양한 질문에 AI 챗봇이 답변해 드립니다.
              </p>
            </div>

            <button className="flex items-center rounded-full bg-[var(--color-brand-primary-500)] px-6 py-2 font-medium shadow-md">
              <MessageCircle className="mr-2" size={16} />
              챗봇에게 물어보기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
