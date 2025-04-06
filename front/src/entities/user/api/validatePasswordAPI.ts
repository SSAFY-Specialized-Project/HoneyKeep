import {ResponseDTO, ResponseErrorDTO} from '@/shared/model/types';
import {ValidatePasswordRequest} from '@/entities/user/model/types';
import {apiURL} from '@/shared/lib';

const validatePasswordAPI = async (
    data: ValidatePasswordRequest
): Promise<ResponseDTO<boolean>> => {

    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(apiURL("/auth/validate-password"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const responseData: ResponseErrorDTO = await response.json();
            const error = new Error(responseData.message) as Error & { status: number, name: string }
            error.status = responseData.status;
            error.name = responseData.name;
            throw error;
        }

        const responseData: ResponseDTO<boolean> = await response.json();
        return responseData;

    } catch (error) {

        if (error instanceof Error && "status" in error) {
            throw error;
        }

        const networkError: ResponseErrorDTO = {
            status: 500,
            name: "NetworkError",
            message: "에기치 못한 에러가 발생했습니다.",
        };

        throw networkError;

    }
};

export default validatePasswordAPI;