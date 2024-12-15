import service from "@/libs/request";
export function login(data) {
  return service.post("/user/signIn", data);
}