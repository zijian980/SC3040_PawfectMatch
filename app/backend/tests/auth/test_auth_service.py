# tests/test_auth_service.py
import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4
from app.auth.service import AuthService
from app.auth.models import Auth, AuthSession
from app.auth.schemas import AuthRegister, OAuthRegister, AuthPasswordUpdate, AuthLoginResponse
from app.auth.exceptions import InvalidCredentials, EmailAlreadyExists, PasswordMismatch
from datetime import datetime, timedelta
from pydantic import SecretStr


@pytest.fixture
def mock_repo():
    return MagicMock()


@pytest.fixture
def auth_service(mock_repo):
    return AuthService(repo=mock_repo)


def test_login_success(auth_service, mock_repo):
    auth = Auth(id=uuid4(), email="test@test.com")
    auth.verify_password = MagicMock(return_value=True)
    mock_repo.get_by_email.return_value = auth

    result = auth_service.login(email="test@test.com", password=SecretStr("P@ssw0rd123!"))

    assert isinstance(result, AuthLoginResponse)
    auth.verify_password.assert_called_once_with("P@ssw0rd123!")
    auth_service.repo.get_by_email.assert_called_once_with(email="test@test.com")


def test_login_invalid(auth_service, mock_repo):
    mock_repo.get_by_email.return_value = None

    with pytest.raises(InvalidCredentials):
        auth_service.login(email="wrong@test.com", password="P@ssw0rd123!@")

    auth_service.repo.get_by_email.assert_called_once_with(email="wrong@test.com")


def test_retrieve_auth_by_session_success(auth_service, mock_repo):
    id = uuid4()
    auth = Auth(id=id, email="a@b.com")
    mock_repo.get_by_session_id.return_value = auth

    result = auth_service.retrieve_auth_id_by_session(session_id="sess123")

    assert result == auth.id
    auth_service.repo.get_by_session_id.assert_called_once_with("sess123")


def test_retrieve_auth_by_session_invalid(auth_service, mock_repo):
    mock_repo.get_by_session_id.return_value = None

    with pytest.raises(InvalidCredentials):
        auth_service.retrieve_auth_id_by_session(session_id="invalid")


def test_register_success(auth_service, mock_repo):
    mock_repo.get_by_email.return_value = None
    auth_in = AuthRegister(
        email="new@test.com",
        password="P@ssw0rd123!",
        first_name="Tester",
        dob=datetime.now() - timedelta(days=365 * 18),
        gender="male",
    )
    auth_service.repo.create_auth = MagicMock()

    with patch("app.auth.service.Auth", spec=Auth) as AuthMock:
        auth_instance = AuthMock.return_value
        auth_instance.set_password = MagicMock()
        auth_instance.id = uuid4()

        auth_service.register(auth_in=auth_in)

    auth_service.repo.create_auth.assert_called_once()
    auth_service.repo.get_by_email.assert_called_once_with(auth_in.email)
    auth_instance.set_password.assert_called_once_with(auth_in.password.get_secret_value())


def test_register_existing_email(auth_service, mock_repo):
    mock_repo.get_by_email.return_value = Auth(email="exists@test.com")
    auth_in = AuthRegister(
        email="exists@test.com",
        password="P@ssw0rd123!",
        first_name="Tester",
        dob=datetime.now() - timedelta(days=365 * 18),
        gender="male",
    )

    with pytest.raises(EmailAlreadyExists):
        auth_service.register(auth_in=auth_in)

    auth_service.repo.get_by_email.assert_called_once_with("exists@test.com")


def test_register_oauth(auth_service, mock_repo):
    auth_in = OAuthRegister(email="oauth@test.com", first_name="User", last_name="User")
    auth_service.repo.create_auth = MagicMock()

    result = auth_service._register_oauth(auth_in=auth_in)

    assert isinstance(result, Auth)
    auth_service.repo.create_auth.assert_called_once()


def test_create_session(auth_service, mock_repo):
    auth = Auth(email="test@test.com")
    auth_service.repo._create_session = MagicMock()

    result = auth_service._create_session(auth=auth)

    assert isinstance(result, AuthSession)
    assert isinstance(result.session_id, str)
    assert result.auth == auth
    auth_service.repo.create_session.assert_called_once_with(result)


def test_change_password_success(auth_service, mock_repo):
    auth = Auth(id=uuid4())
    auth.set_password("oldP@ssw0rd123!")
    auth.verify_password = MagicMock(return_value=True)
    auth.set_password = MagicMock()
    mock_repo.get_by_id.return_value = auth
    auth_pw_in = AuthPasswordUpdate(old_password="oldP@ssw0rd123!", new_password="P@ssw0rd123!")

    auth_service.change_password(user_id=auth.id, auth_pw_in=auth_pw_in)

    auth.verify_password.assert_called_once_with("oldP@ssw0rd123!")
    auth.set_password.assert_called_once_with("P@ssw0rd123!")


def test_change_password_user_not_found(auth_service, mock_repo):
    mock_repo.get_by_id.return_value = None
    auth_pw_in = AuthPasswordUpdate(old_password="oldP@ssw0rd123!", new_password="P@ssw0rd123!")
    id = uuid4()

    with pytest.raises(InvalidCredentials):
        auth_service.change_password(user_id=id, auth_pw_in=auth_pw_in)

    auth_service.repo.get_by_id.assert_called_once_with(id)


def test_change_password_wrong_old(auth_service, mock_repo):
    id = uuid4()
    auth = Auth(id=id)
    auth.set_password("oldP@ssw0rd123!")
    auth.verify_password = MagicMock(return_value=False)
    mock_repo.get_by_id.return_value = auth
    auth_pw_in = AuthPasswordUpdate(old_password="oldP@ssw0rd123!@", new_password="P@ssw0rd123!")

    with pytest.raises(PasswordMismatch):
        auth_service.change_password(user_id=auth.id, auth_pw_in=auth_pw_in)

    auth_service.repo.get_by_id.assert_called_once_with(id)
    auth_service.repo.verify_password("oldP@ssw0rd123!@")
