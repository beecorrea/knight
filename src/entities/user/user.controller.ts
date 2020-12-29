import { UserType } from './user.model';
import { IUserService } from './user.svc';

export class UserController<T extends UserType> {
  private _usrSvc: IUserService<T>;
  constructor(usrSvc: IUserService<T>) {
    this._usrSvc = usrSvc;
  }
  async register(user: T) {
    return await this._usrSvc.register(user);
  }
  async signin(user: T) {
    return await this._usrSvc.signin(user);
  }
}
