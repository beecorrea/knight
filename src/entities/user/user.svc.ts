import { Model } from 'mongoose';
import { UserDocument, UserType } from './user.model';
import { hashSync, compareSync, genSaltSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
export interface IUserService<T extends UserType> {
  register(user: T): Promise<T>;
  signin(user: T): Promise<{ ok: boolean; code: number; msg: string; token?: string }>;
  isSigned(token: string): Promise<boolean | object>;
  searchUser(user: T): Promise<object | boolean>;
}
export class UserService implements IUserService<UserType> {
  private _userModel;

  constructor(userModel: Model<UserDocument>) {
    this._userModel = userModel;
  }

  async register(user: UserType): Promise<UserType> {
    const newUser = new this._userModel(user);
    newUser.password = hashSync(newUser.password, genSaltSync());
    return await newUser.save();
  }
  async searchUser(user: UserType): Promise<false | UserDocument> {
    const usr = await this._userModel.findOne({ email: user.email });
    if (!usr) return false;
    return usr;
  }
  async signin(
    user: UserType,
  ): Promise<{ ok: boolean; code: number; msg: string; token?: string }> {
    try {
      const userSignIn = await this.searchUser(user);
      if (!userSignIn) return { ok: false, code: 404, msg: 'User not found!' };
      if (!compareSync(user.password, userSignIn.password))
        return { ok: false, code: 400, msg: 'Wrong password!' };
      else {
        const signParams = { email: userSignIn.email, role: userSignIn.role, _id: userSignIn._id };
        const token = sign(signParams, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 8, // 8 hours
          issuer: 'KNIGHT_API',
          subject: userSignIn.email,
          audience: 'ANTHILL',
        });
        return {
          ok: true,
          code: 200,
          msg: 'Signed in!',
          token,
        };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, code: 500, msg: 'Internal server error!!' };
    }
  }
  async isSigned(token: string): Promise<false | object> {
    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      return decoded as object;
    } catch (error) {
      console.log('Error verifying JWT!\n', error);
      return false;
    }
  }
}
