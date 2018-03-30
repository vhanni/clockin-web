export const InvUser = function (username) {
  if (typeof username !== 'string') return 'username_chars'
  if (username.length === 0) return 'username_empty'
  if (username.length < 3 || username.length > 15) return 'username_must_be_3_to_15_characters'
  if (!/^[a-z0-9_-]*$/i.test(username)) return 'username_chars'
  if (username === '__proto__') return 'user_not_found'
  return false
}

export const InvInvite = function (invite) {
  if (typeof invite !== 'string') return 'invite_chars'
  if (invite.length === 0) return 'invite_empty'
  if (invite.length < 64 || username.length > 64) return 'invite_length'
  if (!/^[a-z0-9_-]*$/i.test(invite)) return 'invite_chars'
  if (invite === '__proto__') return 'Invalid_invitation_code'
  return false
}