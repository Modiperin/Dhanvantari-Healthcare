export default (email: string, isLogin: boolean = false) => {
  const tester =
    // eslint-disable-next-line no-useless-escape
    /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i

  if (!email) return false

  if (email.length > 254) return false

  if (!tester.test(email)) return false

  const parts = email.split('@')

  if (parts.length !== 2) return false
  if (parts[0].length > 64) return false
  if (isLogin) return true
  return true
}
