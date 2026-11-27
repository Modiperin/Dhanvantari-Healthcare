export default (password: string) => {
  if (!password.trim()) return false

  const regex =
    // /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/
    /^(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/

  return regex.test(password)
}
