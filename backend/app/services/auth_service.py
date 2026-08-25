from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.login import UserLogin
from app.utils.security import verify_password
from app.utils.jwt_handler import create_access_token


def login_user(db: Session, user: UserLogin):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        return None

    if not verify_password(
        user.password,
        db_user.password
    ):
        return None

    token = create_access_token(
        {
            "sub": db_user.email
        }
    )

    return token