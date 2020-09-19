import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import SignUpValidator from '../validations/auth/signup.validator';
import LoginValidator from '../validations/auth/login.validator';
import SocialLoginValidator from '../validations/auth/socialLogin.validator';
import AccountActivationValidator from '../validations/auth/accountActivation.validator';

const router = Router();

router.post('/signup',
  SignUpValidator.validateData(),
  SignUpValidator.myValidationResult,
  SignUpValidator.emailAlreadyExist,
  SignUpValidator.usernameAlreadyExist,
  SignUpValidator.phonenumberAlreadyExist,
  AuthController.signUp);

router.post('/activate_account',
  AccountActivationValidator.validateData(),
  AccountActivationValidator.myValidationResult,
  AccountActivationValidator.emailAlreadyExist,
  AccountActivationValidator.confirmActivationCode,
  AuthController.activateAccount);

router.post('/login',
  LoginValidator.validateData(),
  LoginValidator.myValidationResult,
  AuthController.login);

router.post('/social_login',
  SocialLoginValidator.validateData(),
  SocialLoginValidator.myValidationResult,
  AuthController.socialLogin);

export default router;
