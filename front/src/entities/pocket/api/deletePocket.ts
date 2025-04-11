export const deletePocket = async (pocketId: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pockets/${pocketId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('포켓 삭제에 실패했습니다');
  }

  return await response.json();
};
