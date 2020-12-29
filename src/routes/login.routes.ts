import { Router, Request, Response } from 'express';
import { UserController } from '../entities/user/user.controller';
import { UserService } from '../entities/user/user.svc';
import { User, UserSchema } from '../entities/user/user.model';

const loginRouter = Router();
const userController = new UserController(new UserService(User(UserSchema())));
// Register a new user in the database.
loginRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const signResult = await userController.signin(req.body);
    const { code, msg, ok } = signResult;
    if (code === 200) {
      res.status(200).json({ ok: true, data: signResult.token });
    } else {
      res.status(code).json({ ok, data: msg });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, data: "Couldn't sign in an user :(" });
  }
});

loginRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const newUser = await userController.register(req.body);
    res.status(200).json({ ok: true, data: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, data: "Couldn't create an user :(" });
  }
});
loginRouter.get('/login/:token', async (req: Request, res: Response) => {
  try {
    const isUserSigned = await userController.isSigned(req.params.token);
    if (isUserSigned) res.status(200).send({ ok: true, data: isUserSigned });
    else
      res.status(400).json({ ok: false, data: 'Your session has expired. Please sign in again.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, data: "Couldn't check if the user is logged in :(" });
  }
});
export { loginRouter };
