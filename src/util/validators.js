module.exports.validateRegisterInput = (username, email, password, confirmPassword) => {
  const errors = {}
  if (username.trim() === '') {
    errors.username = 'Nome de usuário não pode ser vazio.'
  } else if (email.trim() === '') {
    errors.email = 'Email não pode ser vazio.'
  } else if (password === '') {
    errors.password = 'A senha não pode ser vazia.'
  } else if (confirmPassword === '') {
    errors.confirmPassword = 'Você deve confirmar sua senha'
  } else if (confirmPassword != password) {
    errors.password = 'As senhas não coincidem'
    errors.confirmPassword = 'As senhas não coincidem'
  } else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regex)) {
      errors.email = 'Você não inseriu um endereço de email válido.'
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}

module.exports.validateLoginInput = (email, password) => {
  const errors = {}
  if (email.trim() === '') errors.email = 'Email não pode ser vazio.'
  if (password === '') errors.password = 'A senha não pode ser vazia.'
  else {
    const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regex)) {
      errors.email = 'Você não inseriu um endereço de email válido.'
    }
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1
  }
}
