export function getUser(){
  try{
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }catch(e){ return null }
}

export function getRole(){
  const u = getUser()
  return u?.role || null
}

export function logout(){
  try{ localStorage.removeItem('token'); localStorage.removeItem('user') }catch(e){}
}

export function isRole(...roles){
  const r = getRole()
  if(!r) return false
  return roles.includes(r)
}
