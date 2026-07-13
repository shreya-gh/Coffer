
export function getOrCreateUserId() {
  let id = localStorage.getItem("coffer_user_id");

  if (!id) {
    id = crypto.randomUUID(); 
    localStorage.setItem("coffer_user_id", id);
  }

  return id;
}


export function getUserId() {
  return localStorage.getItem("coffer_user_id");
}