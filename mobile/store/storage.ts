/**
 * MMKV — AsyncStorage dan 10x tez, SQLite dan ham tezroq.
 * Token, til va kichik sozlamalar uchun ishlatiladi.
 */
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({ id: "savdo-storage" });

export const mmkv = {
  getString: (key: string) => storage.getString(key) ?? null,
  setString: (key: string, value: string) => storage.set(key, value),
  delete: (key: string) => storage.delete(key),
  getBoolean: (key: string) => storage.getBoolean(key) ?? false,
  setBoolean: (key: string, value: boolean) => storage.set(key, value),
};
