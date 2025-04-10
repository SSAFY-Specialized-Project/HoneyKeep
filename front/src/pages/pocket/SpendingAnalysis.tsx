import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import getPocketAnalysis from '@/entities/analysis/api/getPocketAnalysis';
import { useQuery } from '@tanstack/react-query';
import { getMeAPI } from '@/entities/user/api';

const typeCommentMap: Record<string, string> = {
  '계획 마스터':
    '포켓을 잘 만들고 실천까지 해내는 완벽한 계획러예요! 지금처럼만 소비를 유지해보세요.',
  계획러버:
    '계획은 잘 세우지만 실천이 조금 아쉬워요. 포켓 사용을 꾸준히 이어가면 더 좋아질 거예요!',
  '감정 소비러':
    '즉흥적인 소비가 많은 편이에요. 감정 소비를 줄이고 계획을 조금만 더 지켜보는 건 어떨까요?',
  '포켓 탈주러': '포켓을 거의 사용하지 않아요. 작은 계획부터 차근차근 시작해보는 건 어떨까요?',
};

const SpendingAnalysis = () => {
  const { data: analysisData } = useQuery({
    queryFn: getPocketAnalysis,
    queryKey: ['pocket-analysis'],
    staleTime: 60 * 1000 * 20,
  });

  const { data: userData } = useQuery({
    queryFn: getMeAPI,
    queryKey: ['my-info'],
    staleTime: 60 * 1000 * 60,
  });

  const plannedRatio = useMemo(() => {
    if (!analysisData) return 0;
    const total = analysisData.data.plannedAmount + analysisData.data.unplannedAmount;
    return total === 0 ? 0 : Math.round((analysisData.data.plannedAmount / total) * 100);
  }, [analysisData]);

  const pocketRatios = useMemo(() => {
    if (!analysisData) return { success: 0, incomplete: 0, exceeded: 0 };
    const { successAmount, incompleteAmount, exceededAmount } = analysisData.data.pocketUsage;
    const total = successAmount + incompleteAmount + exceededAmount;
    const success = total === 0 ? 0 : Math.round((successAmount / total) * 100);
    const incomplete = total === 0 ? 0 : Math.round((incompleteAmount / total) * 100);
    const exceeded = 100 - success - incomplete;
    return { success, incomplete, exceeded };
  }, [analysisData]);

  if (!analysisData || !userData) return <div>로딩 중...</div>;

  const comment =
    typeCommentMap[analysisData.data.userType] ?? '당신만의 소비 성향을 분석 중이에요.';

  return (
    <div className="w-full space-y-6 p-5">
      <div>
        <h2 className="text-xl font-bold">
          {userData.data.name}님은 {analysisData.data.userType}예요!
        </h2>
        <p className="whitespace-pre-line text-gray-500">{comment}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold">내 소비 중 계획된 소비는 얼마나 될까요?</h3>
          <p className="text-sm text-gray-500">
            포켓을 사용하여 지출한 내역을 계획 소비로 분류하였어요
          </p>
          <div className="my-4 flex items-center justify-center">
            <div className="relative h-32 w-32">
              <svg className="absolute top-0 left-0 h-full w-full" viewBox="0 0 48 48">
                {/* 비계획 소비 배경 */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#FFE0A3"
                  strokeWidth="8"
                  strokeDasharray="126"
                  strokeDashoffset="0"
                />
                {/* 계획 소비 위에 덮어 그림 */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#FFAA00"
                  strokeWidth="8"
                  strokeDasharray="126"
                  strokeDashoffset={126 - (plannedRatio / 100) * 126}
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <p className="text-lg font-bold">{plannedRatio}%</p>
                  <p className="text-sm text-gray-500">계획 소비</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-yellow-500"></span> 계획 소비 (
              {analysisData.data.plannedAmount.toLocaleString()}원)
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-3 w-3 rounded-sm bg-yellow-300"></span> 비계획 소비 (
              {analysisData.data.unplannedAmount.toLocaleString()}원)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold">포켓을 얼마나 잘 활용하고 있을까요?</h3>
          <p className="text-sm text-gray-500">
            계획에 따라 사용한 포켓은 {pocketRatios.success}%예요
          </p>

          <div className="my-4">
            <p className="text-lg font-bold">{analysisData.data.pocketTotal.toLocaleString()}원</p>
            <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-500"
                style={{ width: `${pocketRatios.success}%` }}
              ></div>
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${pocketRatios.incomplete}%` }}
              ></div>
              <div
                className="h-full bg-red-500"
                style={{ width: `${pocketRatios.exceeded}%` }}
              ></div>
            </div>
          </div>

          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle size={16} /> 계획 성공 {pocketRatios.success}%
              </span>
              <span>{analysisData.data.pocketUsage.successAmount.toLocaleString()}원</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle size={16} /> 미완료 {pocketRatios.incomplete}%
              </span>
              <span>{analysisData.data.pocketUsage.incompleteAmount.toLocaleString()}원</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-red-600">
                <XCircle size={16} /> 초과 사용 {pocketRatios.exceeded}%
              </span>
              <span>{analysisData.data.pocketUsage.exceededAmount.toLocaleString()}원</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold">포켓 금액 초과 원인</h3>
          <p className="text-sm text-gray-500">포켓 금액을 초과하여 지출한 주요 원인이에요</p>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            {[...analysisData.data.overspendingReasons]
              .sort((a, b) => b.count - a.count)
              .map((reason, idx, arr) => {
                const total = arr.reduce((sum, r) => sum + r.count, 0) || 1;
                const ratio = (reason.count / total) * 100;
                const opacity = 0.2 + 0.8 * (reason.count / total);

                return (
                  <div key={idx}>
                    <p className="mb-1 flex justify-between">
                      <span>{reason.label}</span>
                      <span className="text-gray-400">{reason.count}회</span>
                    </p>
                    <div
                      className="h-4 rounded-full"
                      style={{
                        width: `${ratio}%`,
                        backgroundColor: `rgba(255, 170, 0, ${opacity.toFixed(2)})`,
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpendingAnalysis;
