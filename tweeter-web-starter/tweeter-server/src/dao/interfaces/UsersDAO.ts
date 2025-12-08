import { UserRecord } from "../../model/types/UserRecord";

export interface UsersDAO {
  getUser(alias: string): Promise<UserRecord | null>;
  createUser(user: UserRecord): Promise<void>;
}
