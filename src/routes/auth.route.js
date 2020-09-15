import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import SignUpValidator from '../validations/auth/signup.validator';
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

export default router;
