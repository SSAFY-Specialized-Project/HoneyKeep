from fastapi import Header, HTTPException
import jwt

from app.config import Config


def get_user_id(authorization: str = Header(...)) -> str:
    """
    Authorization 헤더에서 Bearer 토큰을 추출해 디코딩하고,
    토큰에 포함된 userId를 반환합니다.
    JWT 만료(expiration)도 검증합니다.
    """
    try:
        scheme, token = authorization.split()

        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    try:
        decoded_token = jwt.decode(token, Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM])

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="JWT가 만료되었습니다.")
    
    except jwt.PyJWTError as e:
        raise HTTPException(status_code=401, detail="Token decode failed")
    
    user_id = decoded_token.get("userId")

    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    
    return user_id
    