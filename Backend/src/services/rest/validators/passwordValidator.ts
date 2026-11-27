export default (password: string) => {
  if (!password.trim()) return false

  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/
  // /^(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/

  return regex.test(password)
}
