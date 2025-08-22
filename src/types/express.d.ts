import { User } from 'src/user/user.schema';

declare global {
  namespace Express {
    interface User {
      _id: string;
      username: string;
      email: string;
      profilePicture: string;
    }
  }
}
